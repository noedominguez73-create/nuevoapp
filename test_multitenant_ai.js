// Test script for multi-tenant AI provider system
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function testAIProviders() {
    try {
        console.log('\n🧪 ========================================');
        console.log('   MULTI-TENANT AI PROVIDER TEST');
        console.log('========================================\n');

        const { AIService } = require('./src/services/ai/index');

        // Find test image
        const uploadsDir = path.join(__dirname, 'app/static/uploads/items');
        const files = fs.readdirSync(uploadsDir);
        const imageFile = files.find(f => f.match(/\.(jpg|jpeg|png|webp)$/i));

        if (!imageFile) {
            console.log('❌ No test image found in uploads/items/');
            process.exit(1);
        }

        const imagePath = path.join(uploadsDir, imageFile);
        const imageBuffer = fs.readFileSync(imagePath);
        const mimeType = 'image/jpeg';

        console.log('📸 Test Image:', imageFile);
        console.log('📦 Size:', imageBuffer.length, 'bytes\n');

        // Test Organization 1 (should use Google AI Studio)
        console.log('─'.repeat(60));
        console.log('TEST 1: Organization ID = 1 (Studio Provider)');
        console.log('─'.repeat(60));

        const aiService1 = new AIService(1, 'peinado');
        const providerName = await aiService1.getProviderName();
        console.log('✅ Provider:', providerName);

        const prompt = "Describe this hairstyle in detail for AI generation";
        console.log('📝 Prompt:', prompt);
        console.log('\n⏳ Analyzing image...\n');

        const result1 = await aiService1.analyzeImage(imageBuffer, prompt, mimeType);

        console.log('✅ RESULT:');
        console.log('═'.repeat(60));
        console.log(result1.text);
        console.log('═'.repeat(60));

        if (result1.tokens) {
            console.log('\n📊 Token Usage:');
            console.log('   Input:', result1.tokens.promptTokenCount || 'N/A');
            console.log('   Output:', result1.tokens.candidatesTokenCount || 'N/A');
        }

        console.log('\n✅ TEST PASSED: Multi-tenant AI provider system working!\n');

        // Instructions for Vertex AI testing
        console.log('─'.repeat(60));
        console.log('📋 TO TEST VERTEX AI:');
        console.log('─'.repeat(60));
        console.log('1. Create Google Cloud Project');
        console.log('2. Enable Vertex AI API');
        console.log('3. Create Service Account with role "Vertex AI User"');
        console.log('4. Download credentials JSON');
        console.log('5. Run this SQL:');
        console.log('');
        console.log('   UPDATE api_configs');
        console.log('   SET provider_type = "VERTEX",');
        console.log('       gcp_project_id = "your-project-id",');
        console.log('       gcp_service_account_json = \'{"type": "service_account", ...}\',');
        console.log('       gcp_location = "us-central1"');
        console.log('   WHERE organization_id = 1 AND section = "peinado"');
        console.log('');
        console.log('6. Run this test again');
        console.log('─'.repeat(60));
        console.log('');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ TEST FAILED:');
        console.error('   Error:', error.message);
        console.error('\n   Stack:', error.stack);
        process.exit(1);
    }
}

testAIProviders();
