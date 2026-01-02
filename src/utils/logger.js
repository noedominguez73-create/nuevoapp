const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    try {
        fs.mkdirSync(logsDir, { recursive: true });
    } catch (err) {
        console.error('Could not create logs directory:', err);
    }
}

// Stream de escritura para el archivo de log
const logStream = fs.createWriteStream(
    path.join(logsDir, 'app.log'),
    { flags: 'a' }
);

function log(...args) {
    const line = `[${new Date().toISOString()}] ${args.join(' ')}\n`;
    logStream.write(line);
    console.log(...args); // También escribe a stdout
}

function error(...args) {
    const line = `[${new Date().toISOString()}] ERROR ${args.join(' ')}\n`;
    logStream.write(line);
    console.error(...args); // También escribe a stderr
}

module.exports = { log, error };
