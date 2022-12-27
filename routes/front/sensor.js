const express   = require('express');
const router    = express.Router();
const sensor    = require("../../controller/sensor");

router.get('/list', async function(req, res) {
    const response = await sensor.list(req.user.USER_EMAIL);
    res.render('pages/sensorList',{list:response});
    });

router.get('/add', async function(req, res) {
    res.render('pages/sensorAdd');
    });

router.get('/log', async function(req, res) {
    const response = await sensor.logAll();
    res.render('pages/sensorLog',{list:response});
    });

router.get('/map', async function(req, res) {
    const response = await sensor.map();
    console.log(response)
    res.render('pages/sensorMap',{list:response});
    });

router.get('/model/:sensor_IDX', async function(req, res) {
    res.render('pages/sensorDV',{SENSOR_IDX:req.params.sensor_IDX});
    });

module.exports = router;