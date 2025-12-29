const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../../');

const saveUploadedFile = (file, subdir = 'mirror') => {
    const timestamp = Math.floor(Date.now() / 1000);
    const uniqueFilename = `gen_${timestamp}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const uploadDir = path.join(ROOT_DIR, 'app/static/uploads', subdir);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(savePath, file.buffer);

    return {
        filename: uniqueFilename,
        filepath: savePath,
        url: `/static/uploads/${subdir}/${uniqueFilename}`
    };
};

const saveGeneratedImage = (buffer, originalFilename) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const genFilename = `gen_out_${timestamp}_${originalFilename}`;
    const uploadDir = path.join(ROOT_DIR, 'app/static/uploads/mirror');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savePath = path.join(uploadDir, genFilename);
    fs.writeFileSync(savePath, buffer);

    return `/static/uploads/mirror/${genFilename}`;
};

module.exports = { saveUploadedFile, saveGeneratedImage };
