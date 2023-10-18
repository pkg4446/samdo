const net = require('net');

module.exports = {
	TCP_send: function(PLSM_ID,Host,Port,hexString){
	  try {
		const socket = net.connect({
			port: Port,
			host: Host
		});
		// setting encoding
		socket.setEncoding('utf8');
		const rawHex = Buffer.from(hexString, 'hex');
		console.log("보낸 데이터 : ",rawHex);

		socket.on('connect', function () {
			console.log('on connect');
			socket.write(rawHex);	
		});

		socket.on('data', function (data) {
			const response = Buffer.from(data, 'utf8');
			console.log("받은 데이터 : ",response);
			socket.destroy();
			if(response.length>16){
				const {io} = require('socket.io-client');
				const socketio = io("http://localhost:3003");

				socketio.emit("reply", {PLSM_ID:PLSM_ID,ID:"response",DATA:response});

				socketio.on('clientCut', (data) => {
					socketio.disconnect()
				});
			}else{
				console.log("update");
			}
		});

		socket.on('close', function () {
			console.log('close');
		});
		
		socket.on('error', function (err) {
			console.log('on error: ', err.code);
		});

		return true;
	  } catch (error) {	
		console.log(error);	
		return false;
	  }    
	},
}