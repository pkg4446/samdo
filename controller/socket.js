//socket.js
const SocketIO = require('socket.io');

module.exports = (server) => {
  const io = SocketIO(server, { path: '/socket.io' }); 

  io.on('connection', (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //ip get
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip); // socket.id

    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on('error', (error) => {
      console.error(error);
    });
    socket.on('reply', (data) => {
      if(data.ID=="response"){
        /*for(let index of data.DATA){  
          response.push(index.toString(16));  
        }*/
        console.log(data.DATA.length);
        const time  = BinaryZero(data.DATA[17].toString(2))+BinaryZero(data.DATA[18].toString(2));
        const day   = BinaryZero(data.DATA[19].toString(2))+BinaryZero(data.DATA[20].toString(2));
        const tmOn  = BinaryZero(data.DATA[21].toString(2))+BinaryZero(data.DATA[22].toString(2));
        const tmOff = BinaryZero(data.DATA[23].toString(2))+BinaryZero(data.DATA[24].toString(2));
        const response = {
          actMode:  data.DATA[10].toString(16),
          actStat:  data.DATA[12].toString(16),  
          error:    data.DATA[16].toString(16),
          time:     BinaryParse(time,5),
          day:      BinaryParse(day,7),
          tmOn:     BinaryParse(tmOn,5),
          tmOff:    BinaryParse(tmOff,5),
        }
        if(data.DATA.length == 35){         
          response.rpOn = parseInt((data.DATA[27].toString(16) + data.DATA[28].toString(16)), 16);
          response.rpOff= parseInt((data.DATA[29].toString(16) + data.DATA[30].toString(16)), 16);
          response.pump = parseInt((data.DATA[31].toString(16) + data.DATA[32].toString(16)), 16);
          response.fan  = data.DATA[33].toString(16) + data.DATA[34].toString(16);
        }else if(data.DATA.length == 34){
          response.rpOn = parseInt((data.DATA[26].toString(16) + data.DATA[27].toString(16)), 16);
          response.rpOff= parseInt((data.DATA[28].toString(16) + data.DATA[29].toString(16)), 16);
          response.pump = parseInt((data.DATA[30].toString(16) + data.DATA[31].toString(16)), 16);
          response.fan  = data.DATA[32].toString(16) + data.DATA[33].toString(16);
        }else{
          response.rpOn = parseInt((data.DATA[25].toString(16) + data.DATA[27].toString(16)), 16);
          response.rpOff= parseInt((data.DATA[27].toString(16) + data.DATA[29].toString(16)), 16);
          response.pump = parseInt((data.DATA[28].toString(16) + data.DATA[31].toString(16)), 16);
          response.fan  = data.DATA[30].toString(16) + data.DATA[31].toString(16);
        }
        for(let key in response){
          console.log(key,response[key],typeof(response[key]));
        }
        
        io.emit('news',response);
        socket.emit('clientCut', true);  
      }      
    });
    /*
    socket.interval = setInterval(() => { 
      socket.emit('news', new Date());
    }, 3000);
    */
  });
};

function BinaryZero(data){
  let BinaryData = "";
  if(data.length<8){
    for (let index = 8; index > data.length; index--) {
      BinaryData += '0';              
    }
  }
  BinaryData += data;
  return BinaryData;
}

function BinaryParse(data,slice){
  const response = (`${parseInt(data.substring(0, slice), 2)},${parseInt(data.substring(5, 11), 2)},${parseInt(data.substring(11, 16), 2)}`).split(",");
  return response;
}