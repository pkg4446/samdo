const express   = require('express');
const router    = express.Router();

const webapi    = require("../../controller/webapi");
const plasma    = require("../../controller/plasma");

router.post('/read',async function(req, res, next) {
    const response = {
        result: true,
        data:   null,
    }
    try {
        const webapidata = await plasma.plasma_read(req.body.PLSM_ID);
        const res = await webapi.read(webapidata.PLSM_IP,webapidata.PLSM_PORT,1,12);
        if(res.success){
            const buffer = res.mem[1];
            const time  = BinaryZero(buffer[4]);
            const day   = BinaryZero(buffer[5]);
            const tmOn  = BinaryZero(buffer[6]);
            const tmOff = BinaryZero(buffer[7]);
            response.data = {
                actMode:  buffer[0],
                actStat:  buffer[1],  
                error:    buffer[3],
                time:     BinaryParse(time,5),
                day:      BinaryParse(day,7),
                tmOn:     BinaryParse(tmOn,5),
                tmOff:    BinaryParse(tmOff,5),
                rpOn:     buffer[8],
                rpOff:    buffer[9],
                pump:     buffer[10],
                fan:      buffer[11]
            }
        }
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
        const webapidata = await plasma.plasma_read(req.body.PLSM_ID);
        const commend = req.body.ADDR.toString();
        const request = req.body.DATA;
        let   hexData = "";
        
        switch (commend) {
            case "101":
                if(request == "Timer"){hexData = 3}
                else if(request == "Manual"){hexData = 4}
                else{hexData = 2}
                break;
            case "105":
                hexData = TimeData(request,11);    //now time _ex)9:30:10
                break;
            case "106":
                hexData = TimeData(request,9);     //now day  _ex)22:10:20
                break;
            case "107":
                hexData = TimeData(request,11);    //start time _ex)9:30:10
                break;
            case "108":
                hexData = TimeData(request,11);    //end time _ex)18:30:10
                break;
            case "109":
                hexData = request*1; //on time
                break;
            case "110":
                hexData = request*1; //off time
                break;
            case "111":
                hexData = request*1; //pump time
                break;
            case "112":
                if(request == "On"){hexData = 2}
                else{hexData = 1}
                break;
        }
        response.data = await webapi.modify(webapidata.PLSM_IP,webapidata.PLSM_PORT,commend,hexData);
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
        response.data = await plasma.list();
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
        if(req.body.PLSM_IP.length<7 || !isNaN(req.body.PLSM_IP)){
            response.result  = false;
            response.data    = "IP가 올바르지 않습니다."
        }else if(isNaN(req.body.PLSM_PORT)){
            response.result  = false;
            response.data    = "PORT가 올바르지 않습니다."
        }else{
            const data  = {
                PLSM_ID:    req.body.PLSM_ID,
                PLSM_PORT:  req.body.PLSM_PORT,
                PLSM_IP:    req.body.PLSM_IP    
            }   
            response.data = await plasma.plasma_create(data);
        }        
    } catch (error) {
        response.result = false;
        response.data   = "플라즈마 장비이름이 중복되었습니다."
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
    
    return binaryData;
  }

  function BinaryZero(data){
    const HEX = data.toString(16);
    const buffer1 = parseInt(HEX.slice(0,2),16).toString(2);
    const buffer2 = parseInt(HEX.slice(2),16).toString(2);

    let BinaryData = "";
    if(buffer1.length<8){
      for (let index = 8; index > buffer1.length; index--) {
        BinaryData += '0';              
      }
    }
    BinaryData += buffer1;

    if(buffer2.length<8){
        for (let index = 8; index > buffer2.length; index--) {
          BinaryData += '0';              
        }
      }
      BinaryData += buffer2;

    return BinaryData;
  }

  function BinaryParse(data,slice){
    const response = (`${parseInt(data.substring(0, slice), 2)},${parseInt(data.substring(slice, 11), 2)},${parseInt(data.substring(11, 16), 2)}`).split(",");
    return response;
  }