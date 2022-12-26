require('dotenv').config();
const express   = require('express');
const router    = express.Router();

const webapi    = require("../../controller/webapi");
const sensor    = require("../../controller/sensor");

router.post('/read',async function(req, res, next) {
    const response = {
        result: true,
        data:   null,
    }
    try {
        const webapidata = await sensor.sensor_read(req.body.SENSOR_ID);
        //webapidata = {SENSOR_ID,GPS_LATITUDE,GPS_LONGITUDE,SENSOR_PORT,SENSOR_IP}
        const res = await webapi.read(webapidata.SENSOR_IP,webapidata.SENSOR_PORT,webapidata.SENSOR_MEMORY,8);
        if(res.success){
            const buffer = res.mem[webapidata.SENSOR_MEMORY];
            const controle = await sensor.sensor_read(req.body.SENSOR_ID);
            response.data = {
                PM25:   buffer[0],
                H2S:    buffer[1],
                NH3:    buffer[2],
                CH2O:   buffer[3],
                TEMP:   buffer[4]/10,
                HUMI:   buffer[5]/10,
                VOCS:   buffer[6]/10,
                O3:     buffer[7]/1000,  
                CTL_S2H:controle.CTL_S2H,
                CTL_NH3:controle.CTL_NH3
            }
        }

    } catch (error) {
        response.result = false;
        next(error);
    }
    res.json(response);
});

router.post('/del',async function(req, res, next) {
    const response = {
        result: true,
        data:   null,
    }
    try {
        response.data = await sensor.del(req.body.SENSOR_ID);
        
    } catch (error) {
        response.result = false;
        next(error);
    }
    res.json(response);
});

router.post('/controle',async function(req, res, next) {
    const response = {
        result: true,
        data:   null,
    }
    try {
        await sensor.ctl_update(req.body.SENSOR_ID,req.body.TYPE,req.body.DATA);
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
        if(req.body.USER_EMAIL == undefined) req.body.USER_EMAIL = req.user.USER_EMAIL;
        console.log(req.body);
        response.data = await sensor.list(req.body.USER_EMAIL);
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
        const axios = require('axios');
        const URL = `http://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&address=${req.body.SENSOR_ADDR}&refine=false&simple=false&type=${req.body.ADDR_TYPE}&key=${process.env.GPS_KEY}`;	
        const GPS = {
            ADDR:   null,
            X:      null,
            Y:      null
        }
        if(req.body.USER_EMAIL == undefined) req.body.USER_EMAIL = req.user.USER_EMAIL;
        if(req.body.SENSOR_IP.length<7 || !isNaN(req.body.SENSOR_IP)){
            response.result  = false;
            response.data    = "IP가 올바르지 않습니다."
        }else if(isNaN(req.body.SENSOR_PORT)){
            response.result  = false;
            response.data    = "PORT가 올바르지 않습니다."
        }else{
            await axios({
                method: "get", 	// 요청 방식
                url: URL		// 요청 주소
            })
            .then(function(res){
            GPS.ADDR    = res.data.response.input.address;
            GPS.X       = res.data.response.result.point.x;
            GPS.Y       = res.data.response.result.point.y;
            });
            if(req.body.SENSOR_ADDR == GPS.ADDR)
            {
                const data  = {
                    SENSOR_ID:      req.body.SENSOR_ID,
                    USER_EMAIL: req.body.USER_EMAIL,
                    GPS_LATITUDE:   GPS.Y,
                    GPS_LONGITUDE:  GPS.X,
                    SENSOR_PORT:    req.body.SENSOR_PORT,
                    SENSOR_IP:      req.body.SENSOR_IP,
                    SENSOR_MEMORY:  req.body.SENSOR_MEMORY
                }                   
                response.data = await sensor.sensor_create(data);
            }else{
                response.data = GPS.ADDR;
            }
        }      
    } catch (error) {
        response.result = false;
        response.data   = "센서 장비이름이 중복되었습니다."
        next(error);
    }
    res.json(response);
});

module.exports = router;