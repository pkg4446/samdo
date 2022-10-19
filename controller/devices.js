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
        if(PRTC_ID == "ffff"){
          PRTC_ID = "0000";
        }else{
          const number = parseInt(PRTC_ID, 16);
          const hex = (number+1).toString(16);          
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
      const object = await moduleList.findAll({
        raw:  true,
      });
      return object;
    } catch (error) {
      console.error(error);
    }
  },
}