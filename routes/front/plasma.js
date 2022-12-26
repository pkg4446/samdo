const express   = require('express');
const router    = express.Router();
const plasma    = require("../../controller/plasma");

router.get('/list', async function(req, res) {
    if(req.body.USER_EMAIL == undefined) req.body.USER_EMAIL = req.user.USER_EMAIL;
    const response = await plasma.list(req.body.USER_EMAIL);    
    res.render('pages/plsmList',{list:response});
    });

router.get('/add', async function(req, res) {
    res.render('pages/plsmAdd');
    });

router.get('/model/:PLSM_ID', async function(req, res) {
    res.render('pages/plsmDV',{PLSM_ID:req.params.PLSM_ID});
    });

module.exports = router;