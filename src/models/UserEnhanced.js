const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

/**
 * Enhanced User Model - Cliente/Usuario Principal
 * 
 * Este modelo maneja TODOS los tipos de usuarios:
 * - Clientes finales (usuarios de la app)
 * - Salones/Organizaciones (B2B)
 * - Administradores
 * - Profesionales (estilistas, expertos, entrenadores)
 */

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // ========================================
    // AUTENTICACIÓN
    // ========================================
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Si el email ha sido verificado'
    },
    email_verification_token: {
        type: DataTypes.STRING(100),
        comment: 'Token para verificar email'
    },
    password_reset_token: {
        type: DataTypes.STRING(100),
        comment: 'Token para resetear password'
    },
    password_reset_expires: {
        type: DataTypes.DATE,
        comment: 'Expiración del token de reset'
    },

    // ========================================
    // INFORMACIÓN PERSONAL
    // ========================================
    full_name: {
        type: DataTypes.STRING(100),
        comment: 'Nombre completo del usuario'
    },
    first_name: {
        type: DataTypes.STRING(50),
        comment: 'Nombre'
    },
    last_name: {
        type: DataTypes.STRING(50),
        comment: 'Apellido'
    },
    phone: {
        type: DataTypes.STRING(20),
        comment: 'Teléfono principal'
    },
    phone_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        comment: 'Fecha de nacimiento'
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
        comment: 'Género del usuario'
    },
    profile_image_url: {
        type: DataTypes.STRING(500),
        comment: 'URL de foto de perfil'
    },

    // ========================================
    // DIRECCIÓN Y UBICACIÓN
    // ========================================
    address_line1: {
        type: DataTypes.STRING(255),
        comment: 'Dirección línea 1'
    },
    address_line2: {
        type: DataTypes.STRING(255),
        comment: 'Dirección línea 2 (opcional)'
    },
    city: {
        type: DataTypes.STRING(100),
        comment: 'Ciudad'
    },
    state: {
        type: DataTypes.STRING(100),
        comment: 'Estado/Provincia'
    },
    postal_code: {
        type: DataTypes.STRING(20),
        comment: 'Código postal'
    },
    country: {
        type: DataTypes.STRING(2),
        defaultValue: 'MX',
        comment: 'Código de país ISO 3166-1 alpha-2'
    },
    timezone: {
        type: DataTypes.STRING(50),
        defaultValue: 'America/Mexico_City',
        comment: 'Zona horaria del usuario'
    },
    locale: {
        type: DataTypes.STRING(10),
        defaultValue: 'es-MX',
        comment: 'Idioma y región preferida'
    },

    // ========================================
    // ROLES Y PERMISOS
    // ========================================
    role: {
        type: DataTypes.ENUM('user', 'salon', 'admin', 'super_admin', 'professional', 'expert'),
        defaultValue: 'user',
        comment: 'Rol principal del usuario'
    },
    permissions: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Permisos adicionales específicos'
    },

    // ========================================
    // MULTI-TENANCY Y ORGANIZACIÓN
    // ========================================
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID de organización (para multi-tenancy)',
        references: {
            model: 'organizations',
            key: 'id'
        }
    },
    is_organization_owner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Si es dueño de la organización'
    },

    // ========================================
    // SUSCRIPCIÓN Y BILLING
    // ========================================
    subscription_status: {
        type: DataTypes.ENUM('inactive', 'active', 'trial', 'cancelled', 'past_due'),
        defaultValue: 'inactive',
        comment: 'Estado de suscripción'
    },
    subscription_plan: {
        type: DataTypes.STRING(50),
        defaultValue: 'free',
        comment: 'Plan de suscripción: free, basic, premium, enterprise'
    },
    subscription_start_date: {
        type: DataTypes.DATE,
        comment: 'Fecha de inicio de suscripción'
    },
    subscription_end_date: {
        type: DataTypes.DATE,
        comment: 'Fecha de fin de suscripción'
    },
    trial_ends_at: {
        type: DataTypes.DATE,
        comment: 'Fecha de expiración de trial'
    },

    // ========================================
    // CRÉDITOS Y TOKENS (IA)
    // ========================================
    monthly_token_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        comment: 'Límite de tokens IA por mes'
    },
    current_month_tokens: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Tokens IA consumidos este mes'
    },
    total_tokens_used: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Total de tokens usados históricamente'
    },
    credit_balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        comment: 'Balance de créditos en cuenta'
    },

    // ========================================
    // PREFERENCIAS Y CONFIGURACIÓN
    // ========================================
    preferences: {
        type: DataTypes.JSON,
        defaultValue: {},
        comment: 'Preferencias del usuario (notificaciones, temas, etc)'
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
        comment: 'Metadata adicional flexible'
    },

    // ========================================
    // SEGURIDAD Y AUTENTICACIÓN
    // ========================================
    two_factor_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Si tiene 2FA habilitado'
    },
    two_factor_secret: {
        type: DataTypes.STRING(255),
        comment: 'Secret para TOTP (2FA)'
    },
    last_login_at: {
        type: DataTypes.DATE,
        comment: 'Última vez que inició sesión'
    },
    last_login_ip: {
        type: DataTypes.STRING(45),
        comment: 'IP del último login'
    },
    login_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Número de veces que ha iniciado sesión'
    },
    failed_login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Intentos fallidos de login'
    },
    locked_until: {
        type: DataTypes.DATE,
        comment: 'Cuenta bloqueada hasta esta fecha'
    },

    // ========================================
    // MARKETING Y REFERIDOS
    // ========================================
    referral_code: {
        type: DataTypes.STRING(20),
        unique: true,
        comment: 'Código de referido único del usuario'
    },
    referred_by_user_id: {
        type: DataTypes.INTEGER,
        comment: 'ID del usuario que lo refirió',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    utm_source: {
        type: DataTypes.STRING(100),
        comment: 'Fuente de adquisición (marketing)'
    },
    utm_medium: {
        type: DataTypes.STRING(100),
        comment: 'Medio de adquisición'
    },
    utm_campaign: {
        type: DataTypes.STRING(100),
        comment: 'Campaña de adquisición'
    },

    // ========================================
    // PROFESIONALES (Expertos, Estilistas)
    // ========================================
    is_professional: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Si es un profesional verificado'
    },
    professional_specialty: {
        type: DataTypes.STRING(100),
        comment: 'Especialidad profesional'
    },
    professional_bio: {
        type: DataTypes.TEXT,
        comment: 'Biografía del profesional'
    },
    professional_certifications: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Certificaciones del profesional'
    },
    professional_rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00,
        comment: 'Calificación promedio (0-5)'
    },
    professional_hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        comment: 'Tarifa por hora'
    },

    // ========================================
    // ESTATUS Y ACTIVIDAD
    // ========================================
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended', 'deleted'),
        defaultValue: 'active',
        comment: 'Estado del usuario'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Si la cuenta está activa'
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Si el usuario está verificado (KYC)'
    },
    verified_at: {
        type: DataTypes.DATE,
        comment: 'Fecha de verificación'
    },
    last_activity_at: {
        type: DataTypes.DATE,
        comment: 'Última actividad en la plataforma'
    },
    deleted_at: {
        type: DataTypes.DATE,
        comment: 'Soft delete timestamp'
    },

    // ========================================
    // COMPLIANCE Y LEGAL
    // ========================================
    terms_accepted_at: {
        type: DataTypes.DATE,
        comment: 'Fecha de aceptación de términos'
    },
    privacy_accepted_at: {
        type: DataTypes.DATE,
        comment: 'Fecha de aceptación de política de privacidad'
    },
    marketing_consent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Consentimiento para marketing'
    },
    data_processing_consent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Consentimiento para procesamiento de datos'
    },

    // ========================================
    // NOTAS Y TAGS (Admin)
    // ========================================
    admin_notes: {
        type: DataTypes.TEXT,
        comment: 'Notas internas del admin'
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Tags para segmentación'
    },

}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // Soft deletes
    deletedAt: 'deleted_at',

    indexes: [
        {
            fields: ['email']
        },
        {
            fields: ['organization_id']
        },
        {
            fields: ['role']
        },
        {
            fields: ['subscription_status']
        },
        {
            fields: ['referral_code']
        },
        {
            fields: ['phone']
        },
        {
            fields: ['status']
        },
        {
            fields: ['last_activity_at']
        },
        {
            fields: ['email_verified', 'is_active']
        }
    ]
});

module.exports = { User };
