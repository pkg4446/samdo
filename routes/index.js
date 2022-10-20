const express   = require('express');
const router    = express.Router();

//const test      = require("./test");
const api       = require("./api");
const front     = require("./front");

router.route('/')
    .get(function (req, res){
        res.render('index');        
    })
    .post(function (req, res) {
        console.log(req.body);
        console.log(req.params);
        console.log(req.query);
        res.send("Post Request ACK");
    });
    
router.use('/api',  api);
router.use('/web',front);
module.exports  = router;