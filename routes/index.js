const express   = require('express');
const router    = express.Router();

const tcp       = require("../controller/samdo");

router.route('/')
    .get(function (req, res){
        const response = tcp.TCP_send("localhost",8005,"00000000000601040001000C");
        //tcp.TCP_send("223.171.85.65",502,"00000000000601040001000C");
        res.send(response);
    })
    .post(function (req, res) {
        console.log(req.body);
        console.log(req.params);
        console.log(req.query);
        res.send("Post Request ACK");
    });
module.exports  = router;