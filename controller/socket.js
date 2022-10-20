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
        let buffer = [];
        if(data.DATA.length != 33)
        {
          for (let index = 0; index < data.DATA.length; index++) {
            if(data.DATA[index] == 239 && data.DATA[index+1] == 191 && data.DATA[index+2] == 189){
              index +=2;
              buffer.push(0);
            }else{
              buffer.push(data.DATA[index]);
            }
          }
        }else{
          for (let index = 0; index < 33; index++) {
            buffer.push(data.DATA[index]);
          }
        }
        console.log(data.DATA.length,buffer.length);

        const time  = BinaryZero(buffer[17].toString(2))+BinaryZero(buffer[18].toString(2));
        const day   = BinaryZero(buffer[19].toString(2))+BinaryZero(buffer[20].toString(2));
        const tmOn  = BinaryZero(buffer[21].toString(2))+BinaryZero(buffer[22].toString(2));
        const tmOff = BinaryZero(buffer[23].toString(2))+BinaryZero(buffer[24].toString(2));
        const response = {
          tmErr:    Math.round((data.DATA.length-33)/2),
          actMode:  buffer[10],
          actStat:  buffer[12],  
          error:      buffer[16],
          time:     BinaryParse(time,5),
          day:      BinaryParse(day,7),
          tmOn:     BinaryParse(tmOn,5),
          tmOff:    BinaryParse(tmOff,5),
          rpOn:     buffer[25]+buffer[26],
          rpOff:    buffer[27]+buffer[28],
          pump:     buffer[29]+buffer[30],
          fan:      data.DATA[31].toString(16) + data.DATA[32].toString(16)
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