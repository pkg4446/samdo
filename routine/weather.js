require("dotenv").config({ path: "../.env" });
const {sequelize}   = require('../models');
const sensor        = require('../controller/sensor');
const weather       = require('../controller/weather');
const L2XY          = require('../predict/l2xy');
const TERM_INTERVAL = 1000*60*5;
const TERM_REFRESH  = 1000*60*60;

dataSave    = setInterval(async function() {
    try {
        const senseorList = await sensor.list_All();
        for (const iterator of senseorList) {       
            const XY = L2XY.convert(iterator.GPS_LONGITUDE,iterator.GPS_LATITUDE);
            const weather_data = await weather.read(XY);
            if(weather_data == null){
                const meteorological    = await weatherAPI(XY);
                meteorological.ADDR     = iterator.ADDR;
                await weather.create(meteorological);
            }else{
                weathe_time     = new Date(weather_data.TMSP).getTime();
                weathe_refresh  = new Date().getTime();
                if(weathe_refresh-weathe_time > TERM_REFRESH){
                    const meteorological    = await weatherAPI(XY);
                    await weather.update(meteorological);
                }
            }
        }
    } catch (err) {
        console.error(err);
        (err);
    }
}, TERM_INTERVAL);

//기상청 API 날씨 요청
function format(value){
    let response = value;
    if(value<10) response = `0${value}`
    return response;
  }

async function weatherAPI(XY){
    const axios = require('axios');
    const today = new Date();
    today.setMinutes(today.getMinutes()-41); //현재시간 -41분
    const now   = `${today.getFullYear()}${format(today.getMonth()+1)}${format(today.getDate())}`; 
    let time    = today.toTimeString().split(' ');  
    time        = time[0].split(':');
    time        = `${format(time[0])}${format(time[1])}`
    const data  = {
                  serviceKey: process.env.gokey,
                  numOfRows:  10,
                  pageNo:     1,
                  base_date:  now,
                  base_time:  time,
                  nx:         XY.x,
                  ny:         XY.y,
                  dataType:   "JSON"
    }
  
    const URL = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${data.serviceKey}&base_date=${data.base_date}&base_time=${data.base_time}&nx=${data.nx}&ny=${data.ny}&dataType=JSON`
  
    const weatherData = {
        X:    XY.x,
        Y:    XY.y,
        PTY:  null, //강수 형태
        REH:  null, //습도 %
        RN1:  null, //시간당 강수량 mm
        T1H:  null, //섭씨 기온
        UUU:  null, //동서바랑성분
        VEC:  null, //풍향
        VVV:  null, //남북바람성분
        WSD:  null  //풍속 m/s
    }
  
    await axios({
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: "get", // 요청 방식
      url: URL // 요청 주소
    })
    .then(function(res){
      const response = res.data.response.body.items.item;
      for(let item of response){
        switch (item.category) {
          case "PTY":
            weatherData.PTY=item.obsrValue;
            break;
          case "REH":
            weatherData.REH=item.obsrValue;      
            break;
          case "RN1":
            weatherData.RN1=item.obsrValue; 
            break;
          case "T1H":
            weatherData.T1H=item.obsrValue; 
            break;
          case "UUU":
            weatherData.UUU=item.obsrValue; 
            break;
          case "VEC":
            weatherData.VEC=item.obsrValue; 
            break;
          case "VVV":
            weatherData.VVV=item.obsrValue; 
            break;
          case "WSD":
            weatherData.WSD=item.obsrValue; 
            break;                                                
          default:
            break;
        }
      }          
    });

    return weatherData;
  }