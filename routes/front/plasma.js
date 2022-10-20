const express   = require('express');
const router    = express.Router();
const devices   = require("../../controller/devices");

router.get('/list', async function(req, res) {
    const response = await devices.list();
    res.render('pages/plsmList',{list:response});
    });

router.get('/add', async function(req, res) {
    res.render('pages/plsmAdd');
    });

router.get('/model/:PLSM_ID', async function(req, res) {
    res.render('pages/plsmDV',{PLSM_ID:req.params.PLSM_ID});
    });

module.exports = router;