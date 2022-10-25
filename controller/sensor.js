const sensor    = require("../models/sensor");
const sensorLog = require("../models/sensorLog");

const Sequelize   = require('./module');
const { Op }    = require("sequelize");

module.exports = {
  sensor_read : async function(SENSOR_ID){
    try {
      const object = await sensor.findByPk(SENSOR_ID,{raw: true}); 
      return object;
    } catch (error) {
      console.error(error);
    }
  },

  sensor_create : async function(data){
    try {
      const object = await sensor.create({
        SENSOR_ID:      data.SENSOR_ID,
        GPS_LATITUDE:   data.GPS_LATITUDE,
        GPS_LONGITUDE:  data.GPS_LONGITUDE,
        SENSOR_PORT:    data.SENSOR_PORT,
        SENSOR_IP:      data.SENSOR_IP,
      });
      return object;
    } catch (error) {
      console.error(error);
    }
  },

  sensor_update : async function(SENSOR_ID){
    try {      
      const object =  await sensor.findByPk(SENSOR_ID)
      .then(function(response) {
        let PRTC_ID = response.PRTC_ID;

        const totalnumber = parseInt(PRTC_ID, 16);
        const number = parseInt(PRTC_ID.slice(2), 16);
        let hex = 0;     
        
        if(totalnumber >= 32639){
          PRTC_ID = "0000";
        }else{ 
          if(number >= 127){
            hex = (totalnumber+129).toString(16);          
          }else{
            hex = (totalnumber+1).toString(16); 
          }
          PRTC_ID = "";
          if(hex.length<4){            
            for (let index = 4; index > hex.length; index--) {
              PRTC_ID += '0';              
            }
          }
          PRTC_ID += hex; 
        }
        response.update({PRTC_ID: PRTC_ID})
      });
      return object;
    } catch (error) {
      console.error(error);
    }
  },

  list : async function(){
    try {
      const object = await sensor.findAll({
        raw:  true,
      });
      return object;
    } catch (error) {
      console.error(error);
    }
  },
}