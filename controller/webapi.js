const axios = require('axios');

module.exports = {
	read: async function(Host,Port,NumS,NumE){
	try {	
		const URL = `http://${Host}:${Port}/script/0000/mem_to_json(${NumS},${NumE})`;	
		let response = null;
		await axios({
			method: "get", 	// 요청 방식
			url: URL		// 요청 주소
		  })
		  .then(function(res){
			response = res.data;
		  });
		return response;
	  } catch (error) {	
		console.log(error);	
		return false;
	  }    
	},

	modify: async function(Host,Port,addr,data){
	try {	
		const URL = `http://${Host}:${Port}/script/0000/set_mem(${addr},${data})`;	
		let response = null;
		await axios({
			method: "get", 	// 요청 방식
			url: URL		// 요청 주소
			})
			.then(function(res){
			response = res.data;
			});
		return response;
		} catch (error) {	
		console.log(error);	
		return false;
		}    
	},
}