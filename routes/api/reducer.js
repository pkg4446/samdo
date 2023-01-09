const express   = require('express');
const router    = express.Router();

const webapi    = require("../../controller/webapi");
const reducer   = require("../../controller/reducer");

router.post('/read',async function(req, res, next) {
    const response = {
        result: true,
        data:   true,
    }
    try {
        const webapidata = await reducer.reducer_read(req.body.REDUC_ID);
        const res = await webapi.read(webapidata.REDUC_IP,webapidata.REDUC_PORT,0,40);
        console.log(res);
        if(res.success){
            const buffer = res.mem["0"];
            console.log(buffer);
            response.data = {
                actMode:    buffer[0],
                G_rpOn:     buffer[4],
                G_rpOff:    buffer[5],
                F_rpOn:     buffer[6],
                F_rpOff:    buffer[7],
                G_pump:     buffer[8],
                F_pump:     buffer[9],
                M_pump:     buffer[10],
                S_pump:     buffer[11],
                i_fan:      buffer[12],
                I_fan:      buffer[13],
                O_fan:      buffer[14],
                fanStat:    buffer[15],
                i_fan_v:    buffer[22],
                I_fan_v:    buffer[23]
            }
        }
    } catch (error) {
        response.result = false;
        next(error);
    }
    console.log(response);
    res.json(response);
});

router.post('/del',async function(req, res, next) {
    const response = {
        result: true,
        data:   true,
    }
    try {
        response.data = await reducer.del(req.body.REDUC_ID);
        
    } catch (error) {
        response.result = false;
        next(error);
    }
    res.json(response);
});

router.post('/modify',async function(req, res, next) {
    const response = {
        result: true,
        data:   true,
    }
    try {
        const webapidata = await reducer.reducer_read(req.body.REDUC_ID);
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
        response.data = await webapi.modify(webapidata.REDUC_IP,webapidata.REDUC_PORT,commend,hexData);
    } catch (error) {
        response.result = false;
        next(error);
    }
    res.json(response);
});

router.post('/list',async function(req, res, next) {         
    const response = {
        result: true,
        data:   true,
    }
    try {        
        if(req.body.USER_EMAIL == undefined) req.body.USER_EMAIL = req.user.USER_EMAIL;
        response.data = await reducer.list(req.body.USER_EMAIL);
    } catch (error) {
        response.result = false;
        next(error);
    }
    res.json(response);
});

router.post('/regist',async function(req, res, next) {
    const response = {
        result: true,
        data:   true,
    }
    try {
        
        if(req.body.USER_EMAIL == undefined) req.body.USER_EMAIL = req.user.USER_EMAIL;
        if(req.body.REDUC_IP.length<7 || !isNaN(req.body.REDUC_IP)){
            response.result  = false;
            response.data    = "IP가 올바르지 않습니다."
        }else if(isNaN(req.body.REDUC_PORT)){
            response.result  = false;
            response.data    = "PORT가 올바르지 않습니다."
        }else{
            const data  = {
                REDUC_ID:   req.body.REDUC_ID,
                USER_EMAIL: req.body.USER_EMAIL,
                REDUC_PORT: req.body.REDUC_PORT,
                REDUC_IP:   req.body.REDUC_IP    
            }   
            response.data = await reducer.reducer_create(data);
            if(!response.data) response.result = false;
        }        
    } catch (error) {
        response.result = false;
        response.data   = "악취저감 장비이름이 중복되었습니다."
        next(error);
    }
    res.json(response);
});

module.exports = router;