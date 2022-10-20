const express   = require('express');
const router    = express.Router();

const tcp       = require("../controller/tcp");
const devices   = require("../controller/devices");

router.post('/tcp', function(req, res) {
    let response;
        //response = tcp.TCP_send("localhost",8005,"00000000000601040001000C");
        //response = tcp.TCP_send("223.171.85.65",502,"00000000000601040001000C");
        res.send(response);
    });

router.post('/read',async function(req, res, next) {
    const response = {
        result: true,
        data:   null,
    }
    try {
        const tcpdata = await devices.plasma_read(req.body.PLSM_ID);
        await devices.plasma_update(req.body.PLSM_ID);
        const sendBinary = tcpdata.PRTC_ID + "0000000601040001000C";
        tcp.TCP_send(tcpdata.PLSM_IP,tcpdata.PLSM_PORT,sendBinary);
    } catch (error) {
        response.result = false;
        next(error);
    }
    res.json(response);
});

router.post('/modify',async function(req, res, next) {
    const response = {
        result: true,
        data:   null,
    }
    try {
        const tcpdata = await devices.plasma_read(req.body.PLSM_ID);
        await devices.plasma_update(req.body.PLSM_ID);
        /*
        {
            req.body.ADDR = 65
            req.body.DATA = Interval(02),  Timer + Interval(03),  Manual(04)        
        }
        */
        const commend = req.body.ADDR.toString();
        const request = req.body.DATA;
        let   hexData = "";
        
        switch (commend) {
            case "65":
                if(request == "Timer"){hexData = "0003"}
                else if(request == "Manual"){hexData = "0004"}
                else{hexData = "0002"}
                break;
            case "69":
                hexData = HexZero(TimeData(request,11));    //now time _ex)9:30:10
                break;
            case "6a":
                hexData = HexZero(TimeData(request,9));     //now day  _ex)22:10:20
                break;
            case "6b":
                hexData = HexZero(TimeData(request,11));    //start time _ex)9:30:10
                break;
            case "6c":
                hexData = HexZero(TimeData(request,11));    //end time _ex)18:30:10
                break;
            case "6d":
                hexData = HexZero((request*1).toString(16)); //on time
                break;
            case "6e":
                hexData = HexZero((request*1).toString(16)); //off time
                break;
            case "6f":
                hexData = HexZero((request*1).toString(16)); //pump time
                break;
            case "70":
                if(request == "On"){hexData = "0002"}
                else{hexData = "0001"}
                break;
        }

        const sendBinary = tcpdata.PRTC_ID + "00000006010600"+commend+hexData;
        tcp.TCP_send(tcpdata.PLSM_IP,tcpdata.PLSM_PORT,sendBinary);
    } catch (error) {
        response.result = false;
        next(error);
    }
    res.json(response);
});

router.post('/list',async function(req, res, next) {         
    const response = {
        result: true,
        data:   null,
    }
    try {
        response.data = await devices.list();
    } catch (error) {
        response.result = false;
        next(error);
    }
    res.json(response);
});

router.post('/regist',async function(req, res, next) {   
    const response = {
        result: true,
        data:   null,
    }
    try {
        const data = {
            PLSM_ID:    req.body.PLSM_ID,
            PLSM_PORT:  req.body.PLSM_PORT,
            PLSM_IP:    req.body.PLSM_IP    
        }   
        response.data = await devices.plasma_create(data);
    } catch (error) {
        response.result = false;
        next(error);
    }
    res.json(response);
});

module.exports = router;

function HexZero(data){
    let HexData = "";
    if(data.length<4){
      for (let index = 4; index > data.length; index--) {
        HexData += '0';              
      }
    }
    HexData += data;
    return HexData;
  }

function TimeData(DATA,firstN){
    const arry = DATA.split(":");
    let binaryData = 0;
    binaryData += arry[0]<<firstN;  
    binaryData += arry[1]<<5;

    if(firstN == 11) {binaryData += arry[2]>>1;}
    else {binaryData += arry[2]*1;}
    
    return binaryData.toString(16);
  }