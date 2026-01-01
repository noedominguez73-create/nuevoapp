/**
 * Script de Limpieza para Deployment
 * 
 * Este script identifica y opcionalmente elimina archivos innecesarios
 * antes de subir a producción.
 * 
 * Uso:
 *   node cleanup_for_deploy.js --dry-run  (solo mostrar, no eliminar)
 *   node cleanup_for_deploy.js --clean    (ELIMINAR archivos)
 */

const fs = require('fs');
const path = require('path');

// Archivos y carpetas a NO eliminar (whitelist)
const KEEP_PATTERNS = [
    'node_modules',
    '.git',
    'src',
    'app',
    'scripts',
    'package.json',
    'package-lock.json',
    'server.js',
    '.env',
    '.env.example',
    '.env.production.template',
    '.gitignore',
    'README.md',
    'DEPLOY_GUIDE.md',
    'ARCHITECTURE.md',
    'PROJECT_SUMMARY.md',
    'setup_env.js',
    'cleanup_for_deploy.js'
];

// Patrones a eliminar (blacklist)
const DELETE_PATTERNS = {
    folders: [
        'respaldo',
        'respaldo 1',
        'respaldo 2',
        'respaldo creditos',
        'respaldo voz',
        'respaldo_4',
        'respaldo_5',
        'backups',
        'logs',
        '__pycache__',
        '.pytest_cache',
        '.venv',
        'venv_test',
        'instance'
    ],
    files: [
        // Scripts de testing
        /^test_.*\.(js|py)$/,
        /^check_.*\.(js|py)$/,
        /^debug_.*\.(js|py)$/,
        /^verify_.*\.(js|py)$/,
        /^reproduce_.*\.py$/,

        // Archivos de log y output
        /\.log$/,
        /\.txt$/,
        /output.*\.txt$/,
        /debug.*\.txt$/,

        // Archivos temporales
        /^temp_.*$/,
        /\.pyc$/,

        // Archivos de respaldo
        /backup.*\.(py|js)$/,
        /restore.*\.(py|js)$/,

        // Otros
        'vertex-key.json',
        'Procfile',
        'runtime.txt',
        'requirements.txt',
        'requirements_actual.txt',
        'passenger_wsgi.py',
        'pytest.ini',
        '.env.vertex',
        '.env.production'  // Usaremos .env.production.template
    ]
};

function shouldKeep(itemPath, itemName) {
    return KEEP_PATTERNS.some(pattern => itemPath.includes(pattern) || itemName === pattern);
}

function shouldDelete(itemName, isFolder) {
    if (isFolder) {
        return DELETE_PATTERNS.folders.some(pattern =>
            itemName === pattern || itemName.startsWith(pattern)
        );
    } else {
        return DELETE_PATTERNS.files.some(pattern => {
            if (typeof pattern === 'string') {
                return itemName === pattern;
            } else {
                return pattern.test(itemName);
            }
        });
    }
}

function scanDirectory(dir, results = { folders: [], files: [] }) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const relativePath = path.relative(process.cwd(), itemPath);

        // Skip si está en whitelist
        if (shouldKeep(itemPath, item)) {
            continue;
        }

        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            if (shouldDelete(item, true)) {
                results.folders.push(relativePath);
            } else {
                // Recursión en carpetas que no se eliminan
                scanDirectory(itemPath, results);
            }
        } else if (stat.isFile()) {
            if (shouldDelete(item, false)) {
                results.files.push(relativePath);
            }
        }
    }

    return results;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function calculateSize(items) {
    let totalSize = 0;

    for (const item of items) {
        const itemPath = path.join(process.cwd(), item);
        try {
            const stats = fs.statSync(itemPath);
            if (stats.isFile()) {
                totalSize += stats.size;
            } else if (stats.isDirectory()) {
                // Calcular tamaño de carpeta recursivamente
                totalSize += calculateFolderSize(itemPath);
            }
        } catch (err) {
            // Ignorar si el archivo no existe
        }
    }

    return totalSize;
}

function calculateFolderSize(folderPath) {
    let size = 0;
    try {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                size += stats.size;
            } else if (stats.isDirectory()) {
                size += calculateFolderSize(filePath);
            }
        }
    } catch (err) {
        // Ignorar errores
    }
    return size;
}

function deleteItems(items) {
    let deleted = { folders: 0, files: 0, errors: [] };

    // Primero eliminar archivos
    for (const file of items.files) {
        const filePath = path.join(process.cwd(), file);
        try {
            fs.unlinkSync(filePath);
            deleted.files++;
        } catch (err) {
            deleted.errors.push({ path: file, error: err.message });
        }
    }

    // Luego eliminar carpetas
    for (const folder of items.folders) {
        const folderPath = path.join(process.cwd(), folder);
        try {
            fs.rmSync(folderPath, { recursive: true, force: true });
            deleted.folders++;
        } catch (err) {
            deleted.errors.push({ path: folder, error: err.message });
        }
    }

    return deleted;
}

// MAIN
const args = process.argv.slice(2);
const mode = args[0] || '--dry-run';

console.log('╔════════════════════════════════════════════════╗');
console.log('║   LIMPIEZA DE PROYECTO PARA DEPLOYMENT        ║');
console.log('╚════════════════════════════════════════════════╝\n');

console.log(`🔍 Escaneando archivos innecesarios...\n`);

const toDelete = scanDirectory(process.cwd());

console.log('📊 RESUMEN:\n');
console.log(`📁 Carpetas a eliminar: ${toDelete.folders.length}`);
console.log(`📄 Archivos a eliminar: ${toDelete.files.length}`);
console.log(`📦 Total items: ${toDelete.folders.length + toDelete.files.length}\n`);

// Calcular espacio
const foldersSize = calculateSize(toDelete.folders);
const filesSize = calculateSize(toDelete.files);
const totalSize = foldersSize + filesSize;

console.log(`💾 Espacio a liberar: ${formatBytes(totalSize)}`);
console.log(`   Carpetas: ${formatBytes(foldersSize)}`);
console.log(`   Archivos: ${formatBytes(filesSize)}\n`);

// Mostrar primeras 10 carpetas
if (toDelete.folders.length > 0) {
    console.log('📁 Carpetas a eliminar (primeras 10):');
    toDelete.folders.slice(0, 10).forEach(f => console.log(`   - ${f}`));
    if (toDelete.folders.length > 10) {
        console.log(`   ... y ${toDelete.folders.length - 10} más`);
    }
    console.log();
}

// Mostrar primeros 20 archivos
if (toDelete.files.length > 0) {
    console.log('📄 Archivos a eliminar (primeros 20):');
    toDelete.files.slice(0, 20).forEach(f => console.log(`   - ${f}`));
    if (toDelete.files.length > 20) {
        console.log(`   ... y ${toDelete.files.length - 20} más`);
    }
    console.log();
}

if (mode === '--clean') {
    console.log('⚠️  MODO LIMPIEZA ACTIVADO - Eliminando archivos...\n');

    const result = deleteItems(toDelete);

    console.log('✅ LIMPIEZA COMPLETADA\n');
    console.log(`✓ Carpetas eliminadas: ${result.folders}`);
    console.log(`✓ Archivos eliminados: ${result.files}`);

    if (result.errors.length > 0) {
        console.log(`\n⚠️  Errores encontrados: ${result.errors.length}`);
        result.errors.forEach(err => {
            console.log(`   - ${err.path}: ${err.error}`);
        });
    }

    console.log(`\n💾 Espacio liberado: ~${formatBytes(totalSize)}`);
} else {
    console.log('ℹ️  MODO DRY-RUN - No se eliminó nada\n');
    console.log('Para eliminar estos archivos, ejecuta:');
    console.log('   node cleanup_for_deploy.js --clean\n');
}

console.log('═══════════════════════════════════════════════\n');
