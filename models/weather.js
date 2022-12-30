const Sequelize = require('sequelize');

module.exports = class Weather extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            IDX: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            ADDR: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },

            X: {
                type: Sequelize.TINYINT.UNSIGNED,
                allowNull: false,
            },

            Y: {
                type: Sequelize.TINYINT.UNSIGNED,
                allowNull: false,
            },

            PTY: {
                type: Sequelize.TINYINT.UNSIGNED,
                allowNull: false,
            },

            REH: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },

            RN1: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },

            T1H: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },

            UUU: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },

            VEC: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },

            VVV: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },

            WSD: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },

            TMSP: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },

        },{
            sequelize,
            timestamps : false,
            underscored: false,
            modelName  : 'Weather',
            tableName  : 'weather',
            paranoid   : true,
            charset    : 'utf8',
            collate    : 'utf8_general_ci',
        });
    }
    static associate(db) {
    }
}