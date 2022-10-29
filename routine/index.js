const { Worker, isMainThread, parentPort } = require('worker_threads');

const dataSave  = new Worker('./routine/sensor.js');
