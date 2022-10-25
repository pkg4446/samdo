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
            TMPR: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            //습도
            HMDT: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            //일산화탄소
            CD: {  ////Carbon Dioxide
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            //암모니아
            AMN: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            //황화수소
            HYD_SLF: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            //이산화탄소
            CO2: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            //메탄
            MTHN: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            //
            VOCS: {
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