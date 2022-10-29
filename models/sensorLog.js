const Sequelize = require('sequelize');

module.exports = class SensorLog extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            IDX: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            SENSOR_ID: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
            //측정시간
            MESURE_DT: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            //측정값            
            //온도
            TEMP: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            //습도
            HUMI: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

            PM25: {  ////Carbon Dioxide
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

            H2S: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

            NH3: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

            CH2O: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

            VOCS: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

            O3: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

        },{
            sequelize,
            timestamps : false,
            underscored: false,
            modelName  : 'SensorLog',
            tableName  : 'sensorlog',
            paranoid   : true,
            charset    : 'utf8',
            collate    : 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}