console.log("testPage");

let PRTC_ID = "0f02";
if(PRTC_ID == "ffff"){
    PRTC_ID = "0000";
}else{    
    const number = parseInt(PRTC_ID, 16);
    const hex = (number+1).toString(16);
    console.log(number,hex);
    PRTC_ID = "";
    if(hex.length<4){            
    for (let index = 4; index > hex.length; index--) {
        PRTC_ID += '0';              
    }
    }
    PRTC_ID += hex; 
}

console.log(PRTC_ID);