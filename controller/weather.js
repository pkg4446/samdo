const weather   = require("../models/weather");

const Sequelize = require('./module');
const { Op }    = require("sequelize");

module.exports = {
  read : async function(data){
    try {
      const object = await weather.findOne({
        where: {X:data.x, Y:data.y},
        raw: true
      }); 
      return object;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  create : async function(data){
    try {
      const object = await weather.create({
        ADDR: data.ADDR,
        X:    data.X,
        Y:    data.Y,
        PTY:  data.PTY,
        REH:  data.REH,
        RN1:  data.RN1,
        T1H:  data.T1H,
        UUU:  data.UUU,
        VEC:  data.VEC,
        VVV:  data.VVV,
        WSD:  data.WSD
      });
      return object;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  update : async function(data){
    try {      
      const object =  await weather.update({
        PTY:  data.PTY,
        REH:  data.REH,
        RN1:  data.RN1,
        T1H:  data.T1H,
        UUU:  data.UUU,
        VEC:  data.VEC,
        VVV:  data.VVV,
        WSD:  data.WSD,
        TMSP: new Date()
      }, {
        where: { X:data.X, Y:data.Y },
      });
      return object;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

}