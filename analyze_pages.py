import os
import re

pages = {
    'Reportes': 'app/templates/mis_finanzas_reportes.html',
    'Closet': 'app/templates/closet.html',
    'Cambio de Imagen': 'app/templates/cambio_de_imagen.html'
}

print("\n🔍 ANÁLISIS DE PÁGINAS\n")
print("="*70)
print()
needs_cleaning = []

for name, path in pages.items():
    if not os.path.exists(path):
        print(f"❌ {name}: No encontrado")
        continue
    
    with open(path, 'r',encoding='utf-8') as f:
        content = f.read()
    
    size_kb = len(content) / 1024
    lines = content.count('\n') + 1
    body_tags = len(re.findall(r'</body>', content, re.IGNORECASE))
    mirror_scripts = content.count('mirror-access-control.js')
    
    print(f"📄 {name}")
    print(f"   Tamaño: {size_kb:.1f} KB ({len(content):,} bytes)")
    print(f"   Líneas: {lines:,}")
    print(f"   Tags </body>: {body_tags}")
    print(f"   Scripts mirror: {mirror_scripts}")
    
    issues = []
    if body_tags > 1:
        issues.append(f"⚠️  {body_tags} tags </body> (debería ser 1)")
        needs_cleaning.append((name, path, 'body_tags'))
    
    if mirror_scripts > 2:
        issues.append(f"⚠️  {mirror_scripts} scripts duplicados")
        if (name, path, 'body_tags') not in needs_cleaning:
            needs_cleaning.append((name, path, 'scripts'))
    
    if size_kb > 80:
        issues.append(f"⚠️  Archivo muy grande")
    
    if issues:
        for issue in issues:
            print(f"   {issue}")
        print(f"   🔧 REQUIERE LIMPIEZA")
    else:
        print(f"   ✅ OK")
    
    print()

print("="*70)

if needs_cleaning:
    print(f"\n🔧 PÁGINAS QUE REQUIEREN LIMPIEZA: {len(needs_cleaning)}")
    for name, path, issue in needs_cleaning:
        print(f"   - {name} ({issue})")
else:
    print("\n✅ TODAS LAS PÁGINAS ESTÁN BIEN")

print()
