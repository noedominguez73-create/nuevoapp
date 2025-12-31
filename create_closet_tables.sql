-- =====================================================
-- SISTEMA DE CLOSET IA - MULTI-TENANT DATABASE SCHEMA
-- =====================================================
-- Cada usuario tiene SU PROPIO inventario de ropa
-- María NO puede ver la ropa de Luisa, etc.
-- =====================================================

-- Tabla: INVENTARIO DE CLOSET IA
-- Almacena todas las prendas de ropa de cada usuario
-- Incluye la imagen Base64 con metadatos incrustados (esteganografía)
CREATE TABLE IF NOT EXISTS closet_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Dueño de esta prenda',
    categoria VARCHAR(100) NOT NULL COMMENT 'Blusa, Jeans, Vestido, Zapatos, etc',
    ocasion VARCHAR(50) COMMENT 'casual, formal, party, date, sport, gala',
    imagen_base64 LONGTEXT NOT NULL COMMENT 'Imagen en Base64 con metadatos IA incrustados',
    descripcion_ia TEXT COMMENT 'Descripción generada por Gemini Vision',
    
    -- Metadatos adicionales
    color_principal VARCHAR(50) COMMENT 'Detectado por IA',
    estilo VARCHAR(100) COMMENT 'Elegante, Casual, Deportivo, etc',
    temporada VARCHAR(20) COMMENT 'Verano, Invierno, Todo el año',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- SEPARACIÓN POR USUARIO: Solo este usuario puede ver sus prendas
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_categoria (categoria),
    INDEX idx_ocasion (ocasion),
    INDEX idx_user_categoria (user_id, categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Inventario de ropa - Cada usuario tiene su propio closet';

-- =====================================================
-- EJEMPLO DE SEPARACIÓN:
-- 
-- María (user_id = 5) tiene:
--   - 10 Blusas
--   - 5 Jeans
--   - 3 Vestidos
--
-- Luisa (user_id = 12) tiene:
--   - 8 Blusas
--   - 4 Shorts
--   - 2 Abrigos
--
-- Cuando María abre /closet, el backend ejecuta:
-- SELECT * FROM closet_items WHERE user_id = 5;
--
-- Cuando Luisa abre /closet, el backend ejecuta:
-- SELECT * FROM closet_items WHERE user_id = 12;
--
-- ✅ Datos completamente separados
-- =====================================================

-- Opcional: Tabla de OUTFITS (Combinaciones guardadas)
CREATE TABLE IF NOT EXISTS closet_outfits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Dueño de este outfit',
    nombre VARCHAR(255) NOT NULL COMMENT 'Nombre del outfit: "Look Oficina", "Cita Romántica"',
    ocasion VARCHAR(50) COMMENT 'Para qué ocasión es este outfit',
    items JSON NOT NULL COMMENT 'Array de IDs de closet_items: [1, 5, 9, 12]',
    imagen_preview LONGTEXT COMMENT 'Preview del outfit completo',
    favorito BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_favorito (favorito)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Outfits guardados - Combinaciones de prendas';
