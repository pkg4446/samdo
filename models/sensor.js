const Sequelize = require('sequelize');

module.exports = class Sensor extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            SENSOR_ID: {
                type: Sequelize.STRING(32),
                primaryKey: true,
                allowNull: false,
            },

            USER_EMAIL: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },

            GPS_LATITUDE: {
                type: Sequelize.DECIMAL(10,6),
                allowNull: false,
            },
            
            GPS_LONGITUDE: {
                type: Sequelize.DECIMAL(10,6),
                allowNull: false,
            },

            SENSOR_PORT: {
                type: Sequelize.STRING(4),
                allowNull: false,
            },

            SENSOR_IP:  {
                type: Sequelize.STRING(16),
                allowNull: false,
            },

            SENSOR_MEMORY:  {
                type: Sequelize.TINYINT.UNSIGNED,
                allowNull: false,
            },

            PRTC_ID:  {
                type: Sequelize.STRING(4),
                allowNull: false,
                defaultValue: "0000"
            },

            CTL_S2H: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

            CTL_NH3: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

            CTL_PLSM: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        },{
            sequelize,
            timestamps : false,
            underscored: false,
            modelName  : 'Sensor',
            tableName  : 'sensor',
            paranoid   : true,
            charset    : 'utf8',
            collate    : 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}