# Habilitar Vertex AI API en Google Cloud

## 🎯 Problema Actual

El proyecto está configurado correctamente:
- ✅ Project ID: feisty-bindery-391106  
- ✅ Credentials: vertex-key.json
- ❌ Vertex AI API: **NO HABILITADA**

---

## 📋 Pasos para Habilitar Vertex AI API

### Opción 1: Desde Google Cloud Console (Web)

1. **Ir a:** https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=feisty-bindery-391106

2. **Verás una página que dice:** "Vertex AI API"

3. **Haz clic en el botón azul:** "ENABLE" (Habilitar)

4. **Esperar 30-60 segundos** a que se active

5. **Volver a ejecutar:** `node prueba_vertex.js`

---

### Opción 2: Desde la Terminal (Más Rápido)

Si tienes `gcloud` CLI instalado:

```bash
gcloud services enable aiplatform.googleapis.com --project=feisty-bindery-391106
```

---

## ✅ Verificar que Funcionó

Después de habilitar la API, ejecuta:

```bash
node prueba_vertex.js
```

**Deberías ver:**
```
✅ ÉXITO TOTAL: CONECTADO
🚀 Tu sistema Mirror IA ya está operando con infraestructura Enterprise.
```

---

## ⚠️ Nota Importante

- Esta API es **GRATIS para las primeras peticiones**
- Usa el mismo billing de tu Google AI Studio (Pay-as-you-go)
- Los precios son idénticos a Studio
- **NO hay cobros adicionales** por usar Vertex en lugar de Studio
