# 🚀 Guía de Deployment - Hostinger

## ✅ Cambios Realizados

### 1. Configuración de Base de Datos (✅ COMPLETADO)
- ✅ Eliminadas credenciales hardcoded de `src/config/database.js`
- ✅ Ahora usa variables de entorno desde `.env`
- ✅ Validación automática de credenciales

### 2. Archivos de Entorno (✅ COMPLETADO)
- ✅ `.env` - Archivo local con credenciales de desarrollo
- ✅ `.env.example` - Template documentado con todas las variables
- ✅ `.env.production.template` - Template para Hostinger
- ✅ `setup_env.js` - Script para recrear .env si es necesario

---

## 📋 Pasos para Deploy en Hostinger

### ANTES DE SUBIR

#### 1. Limpiar Archivos Innecesarios

**NO subir estas carpetas:**
```bash
node_modules/         # Se reinstala en servidor
.venv/
venv_test/
__pycache__/
.pytest_cache/
respaldo*/
backups/
logs/
uploads/              # Archivos temporales de usuario
.git/                 # Opcional
```

**NO subir estos archivos:**
```bash
vertex-key.json       # NUNCA!
check_*.js
check_*.py
test_*.js
test_*.py
debug_*.js
debug_*.py
verify_*.js
verify_*.py
*.txt (logs)
*.log
```

**Total a eliminar:** ~250 archivos

---

#### 2. Crear Base de Datos en Hostinger

1. Panel Hostinger → Bases de Datos → Crear Nueva
2. Anotar:
   - Nombre: `u182581262_appnode` (o el que elijas)
   - Usuario: `u182581262_appnode`
   - Contraseña: (la que definas)
   - Host: `localhost` (casi siempre)

---

### EN HOSTINGER

#### 3. Subir Archivos

**Opción A: File Manager**
1. Panel → File Manager
2. Navegar a `/home/u182581262/public_html` (o tu directorio)
3. Subir archivos (excepto los listados arriba)

**Opción B: FTP/SFTP** (más rápido)
```
Host: ftp.tu-dominio.com
Usuario: u182581262
Puerto: 21 (FTP) o 22 (SFTP)
```

---

#### 4. Configurar .env en Servidor

**Crear archivo `.env` en el servidor con:**

```env
# Database - Hostinger MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u182581262_appnode
DB_USER=u182581262_appnode
DB_PASSWORD=TU_PASSWORD_REAL_AQUI

# JWT Secret
JWT_SECRET=8fba6877520b249d21d54ab635c2d99e5e18a13bbca

# Google Gemini
GOOGLE_GEMINI_API_KEY=TU_API_KEY_AQUI

# Application
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com
```

---

#### 5. Instalar Dependencias

**Via SSH:**
```bash
cd /home/u182581262/public_html
npm install --production
```

**Via Panel Hostinger:**
- Panel → Advanced → Setup Node.js App
- Click en "Run npm install"

---

#### 6. Ejecutar Migraciones

```bash
node scripts/migrate_new_modules.js
```

Esto creará las 19 nuevas tablas:
- 🎮 Juegos (3 tablas)
- 🎤 Entrenamiento IA (3 tablas)
- 📚 Audiolibros (4 tablas)
- 💪 Mirror Fitness (5 tablas)
- 💬 Pregunta al Experto (4 tablas)

---

#### 7. Configurar Node.js App en Hostinger

1. Panel → Advanced → Setup Node.js App
2. Configurar:
   - **Application mode:** Production
   - **Application root:** `/home/u182581262/public_html`
   - **Application URL:** `tu-dominio.com`
   - **Application startup file:** `server.js`
   - **Node.js version:** 18.x o superior
3. Click "CREATE"
4. Esperar a que se active
5. Click "RESTART"

---

#### 8. Permisos de Carpetas

```bash
chmod 755 app/static
chmod 755 app/static/uploads
chmod 755 logs
```

---

### VERIFICACIÓN POST-DEPLOY

#### Pruebas Básicas

1. **Verificar que el sitio carga:**
   ```
   https://tu-dominio.com
   ```

2. **Probar Login:**
   - Crear cuenta de prueba
   - Iniciar sesión
   - Verificar que genera JWT

3. **Probar Funcionalidades IA:**
   - Mirror IA
   - Closet IA
   - Cambio de Imagen

4. **Revisar Logs:**
   ```bash
   tail -f logs/error.log
   tail -f logs/combined.log
   ```

---

## 🚨 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
npm ls  # verificar dependencias
```

### Error: ECONNREFUSED (Base de datos)
1. Verificar credenciales en `.env`
2. Verificar que BD esté activa en panel
3. Probar `localhost` vs `127.0.0.1`

### Error 502/504 Gateway Timeout
1. Incrementar timeout en Hostinger
2. Optimizar queries de BD
3. Contactar soporte

### Archivos estáticos no cargan
1. Verificar ruta en `server.js`
2. Verificar permisos: `chmod 755 app/static`

---

## 📝 Archivos Clave del Proyecto

### Modificados para Production
- ✅ `src/config/database.js` - Ahora usa .env
- ✅ `.env.example` - Template completo
- ✅ `setup_env.js` - Script de configuración

### Archivos Esenciales
```
✅ package.json
✅ package-lock.json
✅ server.js
✅ src/
✅ app/templates/
✅ app/static/
✅ scripts/migrate_new_modules.js
```

---

## 🎯 Resumen Rápido

**3 Pasos Críticos:**
1. ✅ Limpiar ~250 archivos innecesarios
2. ✅ Configurar `.env` en servidor con credenciales reales
3. ✅ Ejecutar `npm install` y migraciones

**Tiempo estimado:** 30-60 minutos  
**Dificultad:** Baja-Media

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs: `error.log` y `combined.log`
2. Verificar credenciales en `.env`
3. Contactar soporte de Hostinger si el problema persiste

---

**Generado:** 2026-01-01  
**Versión:** 1.0.8  
**Estado:** ✅ Listo para Deploy
