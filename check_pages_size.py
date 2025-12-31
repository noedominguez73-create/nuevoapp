import os

# Páginas a revisar
pages_to_check = [
    'mis_finanzas_reportes.html',
    'cambio_de_imagen.html', 
    'closet.html'
]

print("🔍 Verificando tamaño de archivos...\n")

for page in pages_to_check:
    path = f'app/templates/{page}'
    
    if os.path.exists(path):
        size = os.path.getsize(path)
        
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.count('\n') + 1
            script_count = content.count('mirror-access-control.js')
            body_count = content.count('</body>')
        
        status = "✅" if size < 50000 and script_count <= 1 else "⚠️"
        
        print(f"{status} {page}:")
        print(f"   Tamaño: {size/1024:.1f} KB")
        print(f"   Líneas: {lines}")
        print(f"   Scripts mirror: {script_count}")
        print(f"   Tags </body>: {body_count}")
        
        if size > 50000:
            print(f"   ⚠️  ARCHIVO MUY GRANDE - Posible duplicación")
        if script_count > 1:
            print(f"   ⚠️  SCRIPTS DUPLICADOS")
        if body_count > 1:
            print(f"   ⚠️  MÚLTIPLES </body> - Código duplicado")
        
        print()
    else:
        print(f"❌ {page}: No encontrado\n")

print("="*60)
print("✅ = OK | ⚠️  = Requiere limpieza")
