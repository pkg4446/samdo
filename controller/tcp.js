const net = require('net');

module.exports = {
	TCP_send: function(Host,Port,hexString){
	  try {
		const socket = net.connect({
			port: Port,
			host: Host
		});
		// setting encoding
		socket.setEncoding('utf8');
		const rawHex = Buffer.from(hexString, 'hex');		
		console.log(rawHex);

		socket.on('connect', function () {
			console.log('on connect');					
			socket.write(rawHex);	
		});

		socket.on('data', function (data) {
			const response = Buffer.from(data, 'utf8');
			console.log("recive",typeof(response),response);
			socket.destroy();

			const {io} = require('socket.io-client');
			const socketio = io("http://localhost:3003");

			socketio.emit("reply", {ID:"response",DATA:response});

			socketio.on('clientCut', (data) => {
				socketio.disconnect()
			});
		});

		socket.on('close', function () {
			console.log('close');
		});
		
		socket.on('error', function (err) {
			console.log('on error: ', err.code);
		});

		return true;
	  } catch (error) {		
		return false;
	  }    
	},
}

function recive(){
	socket.on('data', function (data) {
		const response = Buffer.from(data, 'utf8');
		console.log("recive",response);
		socket.destroy();
	});
}