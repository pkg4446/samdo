const Sequelize = require('sequelize');

module.exports = class Reducer extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            
            REDUC_ID: {
                type: Sequelize.STRING(32),
                primaryKey: true,
                allowNull: false,
            },

            USER_EMAIL: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },

            REDUC_PORT: {
                type: Sequelize.STRING(4),
                allowNull: false,
            },

            REDUC_IP:  {
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
            modelName  : 'Reducer',
            tableName  : 'reducer',
            paranoid   : true,
            charset    : 'utf8',
            collate    : 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}