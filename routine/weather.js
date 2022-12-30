require("dotenv").config({ path: "../.env" });
const {sequelize}   = require('../models');
const sensor        = require('../controller/sensor');
const weather       = require('../controller/weather');
const TERM_INTERVAL = 1000*60*10;
const TERM_REFRESH  = 1000*60*60;

dataSave    = setInterval(async function() {
    try {
        const senseorList = await sensor.list_All();
        for (const iterator of senseorList) {       
            const XY = L2XY(iterator.GPS_LONGITUDE,iterator.GPS_LATITUDE);            
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

//기상청 API 위경도 -> XY좌표 변환 함수
function L2XY(lon ,lat) {
	// 경도(degree) = lon,  위도(degree) = lat
	// 단기예보 지도 정보
    const grid              = 5.0; // 격자간격 (km)

	const lamc_parameter = {
		Re: null,
		grid: null,
		slat1: null,
		slat2: null,
		olon: null,
		olat: null,
		xo: null,
		yo: null,
		first: null
	}

	lamc_parameter.Re       = 6371.00877; // 지도반경
	lamc_parameter.grid     = grid;
	lamc_parameter.slat1    = 30.0; // 표준위도 1
	lamc_parameter.slat2    = 60.0; // 표준위도 2
	lamc_parameter.olon     = 126.0; // 기준점 경도
	lamc_parameter.olat     = 38.0; // 기준점 위도
	lamc_parameter.xo       = 210/grid; // 기준점 X좌표
	lamc_parameter.yo       = 675/grid; // 기준점 Y좌표
	lamc_parameter.first    = 0;

	// 단기예보 
    const response = map_conv(lon, lat, lamc_parameter);
	return response;
}

//좌표변환
function map_conv(lon, lat, map ) {
	let lon1, lat1;

    lon1 = lon;
    lat1 = lat;
    const res = lamcproj(lon1, lat1, map);
    const response = {
        x: Math.floor(res.x + 1.5),
        y: Math.floor(res.y + 1.5),
    }   
	return response;
}

function lamcproj(lon, lat, map)
{
	let PI, DEGRAD, RADDEG;
	let re, olon, olat, sn, sf, ro;
	let slat1, slat2, ra, theta;

	if (map.first == 0) {
		PI = Math.asin(1.0)*2.0;
		DEGRAD = PI/180.0;
		RADDEG = 180.0/PI;

		re = map.Re/map.grid;
		slat1 = map.slat1 * DEGRAD;
		slat2 = map.slat2 * DEGRAD;
		olon = map.olon * DEGRAD;
		olat = map.olat * DEGRAD;

		sn = Math.tan(PI*0.25 + slat2*0.5)/Math.tan(PI*0.25 + slat1*0.5);
		sn = Math.log(Math.cos(slat1)/Math.cos(slat2))/Math.log(sn);
		sf = Math.tan(PI*0.25 + slat1*0.5);
		sf = Math.pow(sf,sn)*Math.cos(slat1)/sn;
		ro = Math.tan(PI*0.25 + olat*0.5);
		ro = re*sf/Math.pow(ro,sn);
		map.first = 1;
	}

    ra = Math.tan(PI*0.25+lat*DEGRAD*0.5);
    ra = re*sf/Math.pow(ra,sn);
    theta = lon*DEGRAD - olon;
    if (theta > PI) theta -= 2.0*PI;
    if (theta < -PI) theta += 2.0*PI;
    theta *= sn;

    const response = {
        x: (ra*Math.sin(theta)) + map.xo,
        y: (ro - ra*Math.cos(theta)) + map.yo
    }
	return response;
}
