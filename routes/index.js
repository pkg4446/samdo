const express   = require('express');
const router    = express.Router();

const tcp       = require("../controller/tcp");

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

router.get('/tcp', function(req, res) {
    let response;
        response = tcp.TCP_send("localhost",8005,"00000000000601040001000C");
        //response = tcp.TCP_send("223.171.85.65",502,"00000000000601040001000C");
        res.send(response);
    });
module.exports  = router;