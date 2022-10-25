const Sequelize = require('sequelize');

module.exports = class Plasma extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            
            PLSM_ID: {
                type: Sequelize.STRING(32),
                primaryKey: true,
                allowNull: false,
            },

            PLSM_PORT: {
                type: Sequelize.STRING(4),
                allowNull: false,
            },

            PLSM_IP:  {
                type: Sequelize.STRING(16),
                allowNull: false,
            },

            PRTC_ID:  {
                type: Sequelize.STRING(4),
                allowNull: false,
                defaultValue: "0000"
            },

        },{
            sequelize,
            timestamps : false,
            underscored: false,
            modelName  : 'Plasma',
            tableName  : 'plasma',
            paranoid   : true,
            charset    : 'utf8',
            collate    : 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}