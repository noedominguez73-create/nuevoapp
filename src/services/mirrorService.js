const { generateImage } = require('./geminiService.js');
const { saveUploadedFile, saveGeneratedImage } = require('../utils/fileUtils.js');
const { MirrorUsage, User, SalonConfig, ApiConfig } = require('../models/index.js');
const fs = require('fs');
const fetch = require('node-fetch');

const buildInpaintingPrompt = (hairstyle, color, instructions) => {
    const parts = [];
    if (hairstyle) parts.push(hairstyle);
    if (color) parts.push(color);
    if (instructions) parts.push(instructions);
    return parts.join(". ") || "Enhance hairstyle professional look";
};

const processGeneration = async (user, file, data) => {
    if (user.current_month_tokens >= user.monthly_token_limit) {
        throw new Error('Límite mensual de créditos IA excedido');
    }

    const savedFile = saveUploadedFile(file);

    const config = await SalonConfig.findOne({ where: { user_id: 1 } });

    let promptParts = [];

    if (config?.hairstyle_sys_prompt) promptParts.push(config.hairstyle_sys_prompt);
    if (config?.color_sys_prompt) promptParts.push(config.color_sys_prompt);

    promptParts.push("--- TRANSFORMACIÓN VISUAL ---");

    if (config?.look_sys_prompt_1) promptParts.push(config.look_sys_prompt_1);

    if (data.hairstyle) {
        promptParts.push(`[PEINADO SELECCIONADO]\n${data.hairstyle}`);
    } else if (config?.look_sys_prompt_2 && !data.instructions) {
        promptParts.push(config.look_sys_prompt_2);
    }

    if (data.color) {
        promptParts.push(`[COLOR SELECCIONADO]\n${data.color}`);
    } else if (config?.look_sys_prompt_3 && !data.instructions) {
        promptParts.push(config.look_sys_prompt_3);
    }

    if (data.instructions) {
        promptParts.push(`[DETALLES]\n${data.instructions}`);
    }

    if (config?.look_sys_prompt_4) promptParts.push(config.look_sys_prompt_4);

    let prompt = promptParts.join("\n\n");

    if (promptParts.length === 0 || !config) {
        prompt = buildInpaintingPrompt(data.hairstyle, data.color, data.instructions);
    }

    let resultUrl = savedFile.url;
    let aiDescription = "Processing...";
    let totalTokens = 0;

    try {
        const fileBuffer = fs.readFileSync(savedFile.filepath);

        const apiConfig = await ApiConfig.findOne({
            where: { provider: 'google', is_active: true, section: data.section || 'look' }
        });
        const apiKey = apiConfig?.api_key || process.env.GOOGLE_API_KEY;

        if (!apiKey) throw new Error('No API Key configured');

        const response = await generateImage(prompt, fileBuffer, file.mimetype, data.section);

        let imageFound = false;

        if (response.customData && response.customData.edited_image) {
            resultUrl = response.customData.edited_image;
            aiDescription = "Image Generated Successfully";
            imageFound = true;
        }

        if (!imageFound && response.candidates && response.candidates.length > 0) {
            const parts = response.candidates[0].content.parts;
            for (const part of parts) {
                if (part.inlineData && part.inlineData.data) {
                    const buffer = Buffer.from(part.inlineData.data, 'base64');
                    resultUrl = saveGeneratedImage(buffer, savedFile.filename);
                    aiDescription = "Image Generated (Base64)";
                    imageFound = true;
                    break;
                }
            }
        }

        if (!imageFound) {
            throw new Error("AI returned no image");
        }

        if (response.usageMetadata) {
            totalTokens = response.usageMetadata.totalTokenCount || 0;
        }

    } catch (err) {
        console.error("Generation failed:", err);
        throw err;
    }

    await MirrorUsage.create({
        usage_type: 'generation',
        user_id: user.id,
        total_tokens: totalTokens
    });

    if (totalTokens > 0) {
        user.current_month_tokens += totalTokens;
        await user.save();
    }

    return {
        status: 'success',
        result_url: resultUrl,
        ai_description: aiDescription,
        debug_prompt: prompt
    };
};

module.exports = { buildInpaintingPrompt, processGeneration };
