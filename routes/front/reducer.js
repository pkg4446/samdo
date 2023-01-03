const express   = require('express');
const router    = express.Router();
const reducer   = require("../../controller/reducer");

router.get('/list', async function(req, res) {
    const response = await reducer.list(req.user.USER_EMAIL);    
    res.render('pages/reducerList',{list:response});
    });

router.get('/add', async function(req, res) {
    res.render('pages/reducerAdd');
    });

router.get('/model/:REDUC_ID', async function(req, res) {
    res.render('pages/reducerDV',{REDUC_ID:req.params.REDUC_ID});
    });

module.exports = router;