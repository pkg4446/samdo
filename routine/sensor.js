require("dotenv").config({ path: "../.env" });
const {sequelize}   = require('../models');
const sensor        = require('../controller/sensor');
const webapi        = require('../controller/webapi');

dataSave    = setInterval(async function() {
    try {
        const senseorList = await sensor.list();
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
                if(buffer[2]>1){
                    await webapi.modify(iterator.SENSOR_IP,iterator.SENSOR_PORT,"101",2);
                }
            }            
        }
              
    } catch (err) {
        console.error(err);
        (err);
    }
}, 1000*60*5);