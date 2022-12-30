area();

function area(){
    const condition = {
      small:      5,
      day:        3,//sun(condition.day), strong, moderate, slight //cloud(night) >1/2>
      wind:       5,//<2,3,5,6<
      distance:   1000,
      distanceY:  0
    }
    let grade;
  
    if(condition.wind>6){
      if(condition.day==1){
        grade=2;
      }else{
        grade=3;
      }
    }else if(condition.wind>=5){
      if(condition.day==1||condition.day==2){
        grade=2;
      }else{
        grade=3;
      }
    }else if(condition.wind>=3){
      if(condition.day==1||condition.day==2){
        grade=1;
      }else if(condition.day==3||condition.day==4){
        grade=3;
      }else{
        grade=4;
      }
    }else if(condition.wind>=2){
      if(condition.day==1||condition.day==2){
        grade=1;
      }else if(condition.day==3){
        grade=2;
      }else{      
        grade=4;
      }
    }else {    
      grade=1;
    }
  
    let deviationY, deviationZ;
    switch (grade) {
      case 1:
        deviationY=deviation(0.32,condition.distance);
        deviationZ=0.24*condition.distance*Math.sqrt(1+(0.001*condition.distance));
        break;
      case 2:
        deviationY=deviation(0.22,condition.distance);
        deviationZ=0.20*condition.distance;
        break;
      case 3:
        deviationY=deviation(0.16,condition.distance);
        deviationZ=0.14*condition.distance*((1+(0.003*condition.distance))**(-1/2));
        break;
      case 4:
        deviationY=deviation(0.11,condition.distance);
        deviationZ=0.08*condition.distance*((1+(0.0015*condition.distance))**(-1/2));
        break;
      default:
        break;
    }
  
    let small = (condition.small/(Math.PI*deviationY*deviationZ*condition.wind))*Math.exp(-(Math.pow(-(condition.distanceY/deviationZ),2)/2));
  

    console.log(condition.small,deviationY,deviationZ,condition.wind);
    
    
    return small;
  }
  
  
  function deviation(value,distance){
    return value*distance*((1+(0.0004*distance))**(-1/2));
  }
  
  