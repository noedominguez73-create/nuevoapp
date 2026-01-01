const fs = require('fs');

try {
    console.log('Testing routes import...');
    const { setupRoutes } = require('./src/routes/index.js');
    console.log('✅ SUCCESS!');
} catch (error) {
    const errorLog = `
ERROR MESSAGE: ${error.message}

FULL STACK:
${error.stack}

ERROR OBJECT:
${JSON.stringify(error, null, 2)}
`;
    fs.writeFileSync('error_log.txt', errorLog);
    console.log('❌ Error written to error_log.txt');
    console.log('Message:', error.message);
}
