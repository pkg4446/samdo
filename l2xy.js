const { response } = require("express");

const NX = 149; /* X축 격자점 수 */
const NY = 253; /* Y축 격자점 수 */

const lamc_parameter = {
    Re: null,
    grid: null,
    slat1: null,
    slat2: null,
    olon: null,
    olat: null,
    xo: null,
    yo: null,
    first: null
}

function L2XY(lon ,lat) {
	// 단기예보 지도 정보
    const grid              = 5.0; // 격자간격 (km)

	lamc_parameter.Re       = 6371.00877; // 지도반경
	lamc_parameter.grid     = grid;
	lamc_parameter.slat1    = 30.0; // 표준위도 1
	lamc_parameter.slat2    = 60.0; // 표준위도 2
	lamc_parameter.olon     = 126.0; // 기준점 경도
	lamc_parameter.olat     = 38.0; // 기준점 위도
	lamc_parameter.xo       = 210/grid; // 기준점 X좌표
	lamc_parameter.yo       = 675/grid; // 기준점 Y좌표
	lamc_parameter.first    = 0;

	// 단기예보 // 경도(degree) = lon,  위도(degree) = lat
    const response = map_conv(lon, lat, map);
    console.log(response);

	return response;
}

//좌표변환
function map_conv(lon, lat, map ) {
	let lon1, lat1;

    lon1 = lon;
    lat1 = lat;
    const res = lamcproj(lon1, lat1, map);
    const response = {
        x: res.x + 1.5,
        y: res.y + 1.5,
    }   
    console.log("map_conv",response);	
	return response;
}

function lamcproj(lon, lat, map)
{
	let PI, DEGRAD, RADDEG;
	let re, olon, olat, sn, sf, ro;
	let slat1, slat2, ra, theta;

	if (map.first == 0) {
		PI = asin(1.0)*2.0;
		DEGRAD = PI/180.0;
		RADDEG = 180.0/PI;

		re = map.Re/map.grid;
		slat1 = map.slat1 * DEGRAD;
		slat2 = map.slat2 * DEGRAD;
		olon = map.olon * DEGRAD;
		olat = map.olat * DEGRAD;

		sn = tan(PI*0.25 + slat2*0.5)/tan(PI*0.25 + slat1*0.5);
		sn = log(cos(slat1)/cos(slat2))/log(sn);
		sf = tan(PI*0.25 + slat1*0.5);
		sf = pow(sf,sn)*cos(slat1)/sn;
		ro = tan(PI*0.25 + olat*0.5);
		ro = re*sf/pow(ro,sn);
		map.first = 1;
	}

    ra = tan(PI*0.25+lat*DEGRAD*0.5);
    ra = re*sf/pow(ra,sn);
    theta = lon*DEGRAD - olon;
    if (theta > PI) theta -= 2.0*PI;
    if (theta < -PI) theta += 2.0*PI;
    theta *= sn;

    const response = {
        x: (ra*sin(theta)) + map.xo,
        y: (ro - ra*cos(theta)) + map.yo
    }

    console.log("lamcproj",response);	
	return response;
}
