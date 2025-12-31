/**
 * Script de Verificación - Monitorea cuando Hostinger se actualice
 * Ejecuta esto en tu PC para saber cuándo el servidor está listo
 */

const https = require('https');

const SERVER_URL = 'https://completmirror.io/health';
let checkCount = 0;
const MAX_CHECKS = 60; // 10 minutos máximo

console.log('🔍 Monitoreando servidor Hostinger...');
console.log(`📡 Verificando: ${SERVER_URL}\n`);

const checkServer = () => {
    checkCount++;

    https.get(SERVER_URL, (res) => {
        let data = '';

        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const health = JSON.parse(data);

                console.log(`[${new Date().toLocaleTimeString()}] Check #${checkCount}:`);
                console.log(`   Status: ${health.status}`);
                console.log(`   DB: ${health.db_status}`);
                console.log(`   Uptime: ${health.uptime || 'N/A'}`);

                // Verificar si ya se reinició (uptime bajo)
                if (health.uptime && health.uptime.includes('seconds')) {
                    const seconds = parseInt(health.uptime);
                    if (seconds < 120) { // Menos de 2 minutos
                        console.log('\n🎉 ¡SERVIDOR REINICIADO RECIENTEMENTE!');
                        console.log('✅ La auto-migración debería haberse ejecutado.');
                        console.log('\n📋 Verifica en los logs de Hostinger que veas:');
                        console.log('   "🎉 Fase 2 AUTO-MIGRACIÓN COMPLETADA!"\n');
                        process.exit(0);
                    }
                }

                // Si DB está conectada y es la primera vez que lo vemos
                if (health.db_status === 'CONNECTED') {
                    console.log('✅ Base de datos conectada. Esperando señal de reinicio...\n');
                }

            } catch (e) {
                console.log(`⚠️  Respuesta no válida (servidor posiblemente reiniciando...)\n`);
            }

            // Continuar verificando
            if (checkCount < MAX_CHECKS) {
                setTimeout(checkServer, 10000); // Cada 10 segundos
            } else {
                console.log('\n⏰ Tiempo límite alcanzado.');
                console.log('📞 Verifica manualmente en el panel de Hostinger.\n');
                process.exit(1);
            }
        });

    }).on('error', (err) => {
        console.log(`❌ Error de conexión: ${err.message}`);
        console.log('   (Esto puede significar que el servidor está reiniciando)\n');

        if (checkCount < MAX_CHECKS) {
            setTimeout(checkServer, 10000);
        }
    });
};

console.log('⏳ Iniciando monitoreo (checkeando cada 10 segundos)...\n');
checkServer();
