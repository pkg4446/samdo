const express   = require('express');
const router    = express.Router();

//const test      = require("./test");
const plasma       = require("./plasma");


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
    
router.use('/plasma',plasma);
module.exports  = router;