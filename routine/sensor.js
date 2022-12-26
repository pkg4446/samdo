require("dotenv").config({ path: "../.env" });
const {sequelize}   = require('../models');
const sensor        = require('../controller/sensor');
const webapi        = require('../controller/webapi');

dataSave    = setInterval(async function() {
    try {
        const senseorList = await sensor.list_All();
        for (const iterator of senseorList) {
            const sensorData = await webapi.read(iterator.SENSOR_IP,iterator.SENSOR_PORT,iterator.SENSOR_MEMORY,8);

            if(sensorData.success){
                const buffer = sensorData.mem[iterator.SENSOR_MEMORY];
                const logData = {
                    SENSOR_ID: iterator.SENSOR_ID,
                    TEMP:   buffer[4],
                    HUMI:   buffer[5],
                    PM25:   buffer[0],
                    H2S:    buffer[1],
                    NH3:    buffer[2],
                    CH2O:   buffer[3],                    
                    VOCS:   buffer[6],
                    O3:     buffer[7],                
                }
                await sensor.loging(logData);
                if(iterator.CTL_S2H > 0 || iterator.CTL_NH3 > 0){
                    if(!iterator.CTL_PLSM&&((buffer[1] > iterator.CTL_S2H)||(buffer[2] > iterator.CTL_NH3))){
                        await webapi.modify(iterator.SENSOR_IP,iterator.SENSOR_PORT,"101",2);
                        await sensor.ctl_plsm(iterator.SENSOR_IP,true);
                    }else if(iterator.CTL_PLSM&&(iterator.CTL_S2H <= 0 || buffer[1] <= iterator.CTL_S2H*0.9)&&(iterator.CTL_S2H <= 0 ||buffer[2] <= iterator.CTL_NH3*0.9)){
                        await webapi.modify(iterator.SENSOR_IP,iterator.SENSOR_PORT,"101",4);
                        await sensor.ctl_plsm(iterator.SENSOR_IP,false);
                    }
                }
            }            
        }
              
    } catch (err) {
        console.error(err);
        (err);
    }
}, 1000*60*5);