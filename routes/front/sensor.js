const express   = require('express');
const router    = express.Router();
const sensor    = require("../../controller/sensor");

router.get('/list', async function(req, res) {
    const response = await sensor.list();
    res.render('pages/sensorList',{list:response});
    });

router.get('/add', async function(req, res) {
    res.render('pages/sensorAdd');
    });

router.get('/model/:sensor_ID', async function(req, res) {
    res.render('pages/sensorDV',{SENSOR_ID:req.params.sensor_ID});
    });

module.exports = router;