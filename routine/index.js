const { Worker, isMainThread, parentPort } = require('worker_threads');

const dataSave  = new Worker('./routine/sensor.js');
const weather   = new Worker('./routine/weather.js');
