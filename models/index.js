const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require('../config/config.js')[env];
const db        = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const user      = require('./user');
const weather   = require('./weather');
const plasma    = require('./plasma');
const sensor    = require('./sensor');
const sensorLog = require('./sensorLog');
const sensorMap = require('./sensorMap');

db.sequelize    = sequelize;
db.user         = user;
user.init(sequelize);
user.associate(db);

db.weather         = weather;
weather.init(sequelize);
weather.associate(db);

db.plasma       = plasma;
plasma.init(sequelize);
plasma.associate(db);

db.sensor       = sensor;
sensor.init(sequelize);
sensor.associate(db);

db.sensorLog    = sensorLog;
sensorLog.init(sequelize);
sensorLog.associate(db);

db.sensorLog    = sensorMap;
sensorMap.init(sequelize);
sensorMap.associate(db);

//모듈
module.exports = db;
