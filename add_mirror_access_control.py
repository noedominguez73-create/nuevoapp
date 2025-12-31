import os
import re

# Pages that need Mirror IA access control
pages_to_update = [
    'fotografia.html',
    'imagina_ia.html',
    'dashboard-profesional.html',
    'creditos.html',
    'control_pantalla.html',
    'mis_finanzas_facturas.html',
    'mis_finanzas_dashboard.html',
    'mis_finanzas.html',
    'mis_finanzas_ingresos.html',
    'index.html',
    'chatbot-config.html',
    'mis_finanzas_pagos.html',
    'mis_finanzas_reportes.html',
    'sidebar.html',
    'mis_finanzas_pendientes.html',
    'tienda.html',
    'avatar.html'
]

templates_dir = 'app/templates'
script_tag = '<script src="/static/js/mirror-access-control.js"></script>'

updated_count = 0
already_has_count = 0
errors = []

for page in pages_to_update:
    file_path = os.path.join(templates_dir, page)
    
    if not os.path.exists(file_path):
        errors.append(f"❌ {page} - File not found")
        continue
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has the script
        if 'mirror-access-control.js' in content:
            already_has_count += 1
            print(f"✓ {page} - Already has access control")
            continue
        
        # Add script before </body> tag
        if '</body>' in content:
            content = content.replace('</body>', f'    {script_tag}\n</body>')
        elif '</html>' in content:
            # If no </body>, add before </html>
            content = content.replace('</html>', f'    {script_tag}\n</html>')
        else:
            errors.append(f"⚠️  {page} - No </body> or </html> tag found")
            continue
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        updated_count += 1
        print(f"✅ {page} - Access control added")
        
    except Exception as e:
        errors.append(f"❌ {page} - {str(e)}")

print(f"\n{'='*60}")
print(f"📊 RESUMEN:")
print(f"   ✅ Actualizados: {updated_count}")
print(f"   ✓  Ya tenían script: {already_has_count}")
print(f"   ❌ Errores: {len(errors)}")
print(f"{'='*60}\n")

if errors:
    print("⚠️  ERRORES:")
    for error in errors:
        print(f"   {error}")
    print()

print("✅ Mirror IA ahora está oculto para usuarios no-salon en TODAS las páginas")
