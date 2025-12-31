-- =====================================================
-- SISTEMA DE FINANZAS - MULTI-TENANT DATABASE SCHEMA
-- =====================================================
-- Cada usuario tiene SUS PROPIOS datos completamente separados
-- María NO puede ver datos de Luisa, Luisa NO puede ver datos de Juan, etc.
-- =====================================================

-- Tabla 1: CUENTAS BANCARIAS
-- Ejemplo: María tiene "Banco Santander" y "Efectivo"
--          Luisa tiene "BBVA" y "Tarjeta Débito"
-- Los datos NO se mezclan porque cada cuenta tiene user_id diferente
CREATE TABLE IF NOT EXISTS finance_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'ID del usuario dueño de esta cuenta',
    name VARCHAR(255) NOT NULL COMMENT 'Nombre: "Banco Santander", "Efectivo", etc',
    type ENUM('cash', 'debit', 'savings', 'credit', 'other') DEFAULT 'cash',
    balance DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'Saldo actual de la cuenta',
    color VARCHAR(7) DEFAULT '#3B82F6' COMMENT 'Color para UI',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- SEPARACIÓN POR USUARIO: Solo este usuario puede ver/editar esta cuenta
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_user_type (user_id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Cuentas bancarias - Cada usuario tiene las suyas';

-- Tabla 2: TRANSACCIONES (Ingresos y Gastos)
-- Ejemplo: María registra "Gané $5000 de freelance" 
--          Luisa registra "Gasté $200 en supermercado"
-- Cada transacción pertenece SOLO a un usuario
CREATE TABLE IF NOT EXISTS finance_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Dueño de esta transacción',
    account_id INT NOT NULL COMMENT 'Cuenta bancaria asociada',
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(255) COMMENT 'Ej: Supermercado, Salario, Freelance',
    subcategory VARCHAR(255) COMMENT 'Ej: Frutas, Pago mensual',
    description VARCHAR(500) COMMENT 'Descripción de la transacción',
    amount DECIMAL(15, 2) NOT NULL COMMENT 'Monto de ingreso o gasto',
    date DATE NOT NULL COMMENT 'Fecha de la transacción',
    document_base64 LONGTEXT COMMENT 'Foto del comprobante en Base64',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- SEPARACIÓN: Solo el usuario dueño ve sus transacciones
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES finance_accounts(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_account_id (account_id),
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Ingresos y Gastos - Separados por usuario';

-- Tabla 3: FACTURAS / CUENTAS POR PAGAR
-- Ejemplo: María tiene factura de "CFE $450"
--          Luisa tiene factura de "Telmex $320"
CREATE TABLE IF NOT EXISTS finance_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Dueño de esta factura',
    name VARCHAR(255) NOT NULL COMMENT 'Nombre de la factura',
    category VARCHAR(255),
    subcategory VARCHAR(255),
    amount DECIMAL(15, 2) NOT NULL COMMENT 'Monto total de la factura',
    paid_amount DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'Cuánto se ha pagado',
    due_date DATE COMMENT 'Fecha de vencimiento',
    recurring BOOLEAN DEFAULT FALSE COMMENT 'Si se repite automáticamente',
    frequency ENUM('weekly', 'monthly') DEFAULT 'monthly',
    is_paid BOOLEAN DEFAULT FALSE COMMENT 'Si ya está completamente pagada',
    notes TEXT,
    receipt_base64 LONGTEXT COMMENT 'Foto del recibo/factura',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- SEPARACIÓN: Solo el usuario dueño ve sus facturas
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_due_date (due_date),
    INDEX idx_is_paid (is_paid),
    INDEX idx_user_paid (user_id, is_paid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Facturas por pagar - Separadas por usuario';

-- Tabla 4: CUENTAS POR COBRAR
-- Ejemplo: María le debe cobrar $2000 a "Cliente ABC"
--          Luisa le debe cobrar $1500 a "Cliente XYZ"
CREATE TABLE IF NOT EXISTS finance_receivables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Dueño de esta cuenta por cobrar',
    client_name VARCHAR(255) NOT NULL COMMENT 'Nombre del cliente que debe',
    description VARCHAR(500),
    amount DECIMAL(15, 2) NOT NULL COMMENT 'Monto total a cobrar',
    paid_amount DECIMAL(15, 2) DEFAULT 0.00 COMMENT 'Cuánto ha pagado el cliente',
    due_date DATE COMMENT 'Cuándo debe pagar',
    is_paid BOOLEAN DEFAULT FALSE COMMENT 'Si ya pagó todo',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- SEPARACIÓN: Solo el usuario dueño ve sus cuentas por cobrar
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_paid (is_paid),
    INDEX idx_user_paid (user_id, is_paid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cuentas por cobrar - Separadas por usuario';

-- Tabla 5: TAREAS FINANCIERAS (TODOS)
-- Ejemplo: María tiene tarea "Pagar CFE antes del viernes"
--          Luisa tiene tarea "Revisar tarjeta de crédito"
CREATE TABLE IF NOT EXISTS finance_todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Dueño de esta tarea',
    text VARCHAR(500) NOT NULL COMMENT 'Descripción de la tarea',
    completed BOOLEAN DEFAULT FALSE COMMENT 'Si ya está completada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- SEPARACIÓN: Solo el usuario dueño ve sus tareas
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tareas pendientes - Separadas por usuario';

-- Tabla 6: CATEGORÍAS PERSONALIZADAS
-- Ejemplo: María crea categoría "Gimnasio"
--          Luisa crea categoría "Mascotas"
-- Cada usuario puede tener categorías diferentes
CREATE TABLE IF NOT EXISTS finance_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Dueño de esta categoría',
    name VARCHAR(255) NOT NULL COMMENT 'Nombre de la categoría',
    icon VARCHAR(50) DEFAULT 'circle' COMMENT 'Icono para UI',
    color VARCHAR(7) DEFAULT '#6B7280' COMMENT 'Color hex',
    subcategories JSON COMMENT 'Array de subcategorías: ["Sub1", "Sub2"]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- SEPARACIÓN: Solo el usuario dueño ve sus categorías
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    UNIQUE KEY unique_user_category (user_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Categorías personalizadas - Separadas por usuario';

-- =====================================================
-- EJEMPLO DE CÓMO FUNCIONA LA SEPARACIÓN
-- =====================================================
-- 
-- Si tenemos 3 usuarios:
-- - María (user_id = 5)
-- - Luisa (user_id = 12)  
-- - Juan (user_id = 20)
--
-- Cuando María hace login y carga sus finanzas, el backend ejecuta:
-- SELECT * FROM finance_accounts WHERE user_id = 5;
-- SELECT * FROM finance_transactions WHERE user_id = 5;
-- etc...
--
-- María SOLO ve SUS datos (user_id = 5)
-- Luisa SOLO ve SUS datos (user_id = 12)
-- Juan SOLO ve SUS datos (user_id = 20)
--
-- Si María intenta ver datos de Luisa, el query automáticamente
-- filtra por user_id = 5, entonces NO verá nada de Luisa.
-- =====================================================

-- Insertar categorías por defecto para TODOS los usuarios nuevos
-- (Esto se hará desde el backend cuando un usuario se registre)
