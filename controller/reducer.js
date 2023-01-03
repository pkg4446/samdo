const reducer   = require("../models/reducer");

const Sequelize = require('./module');
const { Op }    = require("sequelize");

module.exports = {
  reducer_read : async function(REDUC_ID){
    try {
      const object = await reducer.findByPk(REDUC_ID,{raw: true}); 
      return object;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  reducer_create : async function(data){
    try {
      const object = await reducer.create({
        REDUC_ID:   data.REDUC_ID,
        USER_EMAIL: data.USER_EMAIL,
        REDUC_PORT: data.REDUC_PORT,
        REDUC_IP:   data.REDUC_IP,
      });
      return object;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  reducer_update : async function(REDUC_ID){
    try {      
      const object =  await reducer.findByPk(REDUC_ID)
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
      return false;
    }
  },

  list : async function(USER_EMAIL){
    try {
      const object = await reducer.findAll({
        where:  {USER_EMAIL:USER_EMAIL},
        raw:    true,
      });
      return object;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  del : async function(REDUC_ID){
    try {
      const object = await reducer.destroy({
        where:  {REDUC_ID:REDUC_ID}
      });
      return object;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}