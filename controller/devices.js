const plasma      = require("../models/plasma");

const Sequelize   = require('./module');
const { Op }    = require("sequelize");

module.exports = {
  plasma_read : async function(PLSM_ID){
    try {
      const object = await plasma.findByPk(PLSM_ID,{raw: true}); 
      return object;
    } catch (error) {
      console.error(error);
    }
  },

  plasma_create : async function(data){
    try {
      const object = await plasma.create({
        PLSM_ID:  data.PLSM_ID,
        PLSM_PORT:  data.PLSM_PORT,
        PLSM_IP:  data.PLSM_IP,
      });
      return object;
    } catch (error) {
      console.error(error);
    }
  },

  plasma_update : async function(PLSM_ID){
    try {      
      const object =  await plasma.findByPk(PLSM_ID)
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
      const object = await plasma.findAll({
        raw:  true,
      });
      return object;
    } catch (error) {
      console.error(error);
    }
  },
}