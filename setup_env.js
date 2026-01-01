/**
 * Script de Setup - Crea el archivo .env con credenciales de desarrollo
 * 
 * Ejecutar: node setup_env.js
 */

const fs = require('fs');
const path = require('path');

const envContent = `# ==========================================
# DESARROLLO LOCAL
# ==========================================

# Database - Local MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=u182581262_appnode
DB_USER=root
DB_PASSWORD=1020304050

# JWT Secret
JWT_SECRET=8fba6877520b249d21d54ab635c2d99e5e18a13bbca
JWT_EXPIRES_IN=7d

# Google Gemini
GOOGLE_GEMINI_API_KEY=tu-api-key-aqui

# Application
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=*

# Database optional
DB_LOGGING=false
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_SSL=false
`;

const envProductionContent = `# ==========================================
# PRODUCCIÓN - HOSTINGER
# ==========================================

# Database - Hostinger MySQL
# Obtén estas credenciales en Panel → Bases de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u182581262_appnode
DB_USER=u182581262_appnode
DB_PASSWORD=TU_PASSWORD_HOSTINGER_AQUI

# JWT Secret - Genera uno nuevo con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=8fba6877520b249d21d54ab635c2d99e5e18a13bbca
JWT_EXPIRES_IN=7d

# Google Gemini - https://makersuite.google.com/app/apikey
GOOGLE_GEMINI_API_KEY=TU_API_KEY_AQUI

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn
CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com

# Database optional
DB_LOGGING=false
DB_POOL_MAX=20
DB_POOL_MIN=2
DB_SSL=false
`;

const envPath = path.join(__dirname, '.env');
const envProductionPath = path.join(__dirname, '.env.production.template');

// Crear .env para desarrollo
try {
    if (fs.existsSync(envPath)) {
        console.log('⚠️  Archivo .env ya existe, no se sobreescribirá');
        console.log('   Si necesitas recrearlo, elimínalo manualmente primero');
    } else {
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Archivo .env creado exitosamente');
        console.log('   Ubicación:', envPath);
        console.log('\n📝 Recuerda actualizar las API keys antes de usar la aplicación');
    }
} catch (error) {
    console.error('❌ Error creando .env:', error.message);
}

// Crear template de producción
try {
    fs.writeFileSync(envProductionPath, envProductionContent);
    console.log('\n✅ Template de producción creado: .env.production.template');
    console.log('   Usa este archivo como referencia para configurar en Hostinger');
} catch (error) {
    console.error('❌ Error creando template:', error.message);
}

console.log('\n🚀 Setup completado!');
console.log('\nPróximos pasos:');
console.log('1. Actualiza GOOGLE_GEMINI_API_KEY en .env');
console.log('2. Ejecuta: npm install');
console.log('3. Ejecuta: node server.js');
