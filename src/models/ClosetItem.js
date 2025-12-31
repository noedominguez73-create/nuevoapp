const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ClosetItem = sequelize.define('ClosetItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Dueño de esta prenda'
    },
    categoria: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Blusa, Jeans, Vestido, etc'
    },
    ocasion: {
        type: DataTypes.STRING(50),
        comment: 'casual, formal, party, date, sport, gala'
    },
    imagen_base64: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: 'Imagen con metadatos IA incrustados'
    },
    descripcion_ia: {
        type: DataTypes.TEXT,
        comment: 'Descripción generada por Gemini Vision'
    },
    color_principal: {
        type: DataTypes.STRING(50)
    },
    estilo: {
        type: DataTypes.STRING(100)
    },
    temporada: {
        type: DataTypes.STRING(20)
    }
}, {
    tableName: 'closet_items',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['categoria'] },
        { fields: ['ocasion'] },
        { fields: ['user_id', 'categoria'] }
    ]
});

module.exports = ClosetItem;
