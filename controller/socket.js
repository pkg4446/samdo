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
        let response = "";
        for(let index of data.DATA){  
          response += `${index},`;  
        }   
        console.log(response);
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