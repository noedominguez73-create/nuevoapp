const { User } = require('./User.js');
const { SalonConfig } = require('./SalonConfig.js');
const { MirrorItem } = require('./MirrorItem.js');
const { MirrorUsage } = require('./MirrorUsage.js');
const { ApiConfig } = require('./ApiConfig.js');

// Associations
User.hasOne(SalonConfig, { foreignKey: 'user_id', as: 'salonConfig' });
SalonConfig.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(MirrorUsage, { foreignKey: 'user_id' });
MirrorUsage.belongsTo(User, { foreignKey: 'user_id' });

MirrorItem.hasMany(MirrorUsage, { foreignKey: 'item_id' });
MirrorUsage.belongsTo(MirrorItem, { foreignKey: 'item_id' });

module.exports = {
    User,
    SalonConfig,
    MirrorItem,
    MirrorUsage,
    ApiConfig
};
