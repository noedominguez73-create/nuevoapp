import re

# Read the problematic file
with open('app/templates/mis_finanzas_pagos.html', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"📊 Tamaño original: {len(content)} bytes ({len(content)/1024:.1f} KB)")
print(f"📄 Total líneas: {content.count(chr(10)) + 1}")

# Count duplicate scripts
mirror_script_count = content.count('mirror-access-control.js')
print(f"\n🔍 Scripts de mirror-access-control: {mirror_script_count}")

# Find all </body> tags
body_tags = list(re.finditer(r'</body>', content, re.IGNORECASE))
print(f"🏷️  Tags </body> encontrados: {len(body_tags)}")

# Find the FIRST </body> tag
if body_tags:
    first_body_pos = body_tags[0].start()
    # Cut everything after the first </body>
    clean_content = content[:first_body_pos]
    
    # Add the mirror script ONCE before </body>
    clean_content += '\n    <script src="/static/js/mirror-access-control.js"></script>\n</body>\n</html>'
    
    print(f"\n✂️  Cortado en posición: {first_body_pos}")
    print(f"✅ Nuevo tamaño: {len(clean_content)} bytes ({len(clean_content)/1024:.1f} KB)")
    print(f"📄 Nuevas líneas: {clean_content.count(chr(10)) + 1}")
    
    # Save cleaned file
    with open('app/templates/mis_finanzas_pagos.html', 'w', encoding='utf-8') as f:
        f.write(clean_content)
    
    print("\n✅ Archivo limpiado y guardado!")
    print(f"💾 Reducción:{  (len(content) - len(clean_content))/1024:.1f} KB removidos")
    
else:
    print("❌ No se encontró </body>")
