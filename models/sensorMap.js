const Sequelize = require('sequelize');

module.exports = class SensorMap extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            SENSOR_IDX: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
            },

            MESURE_DT: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },

            ADDR: {
                type: Sequelize.STRING(48),
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

            ODOR: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

        },{
            sequelize,
            timestamps : false,
            underscored: false,
            modelName  : 'SensorMap',
            tableName  : 'sensormap',
            paranoid   : true,
            charset    : 'utf8',
            collate    : 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}