const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require('../config/config.js')[env];
const db        = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const user      = require('./user');
const plasma    = require('./plasma');

db.sequelize    = sequelize;
db.user         = user;
user.init(sequelize);
user.associate(db);

db.plasma       = plasma;
plasma.init(sequelize);
plasma.associate(db);

//모듈
module.exports = db;
