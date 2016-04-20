window.onload = function () {
	var html5Options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 };
	geolocator.locate(onGeoSuccess, onGeoError, true, html5Options,null,true);
}

document.addEventListener('gpsupdate', function (e) {
	console.log("UPDATE!")	
	readingView.reRender();
}, false);

function onGeoSuccess(location) {
	var lat= location.coords.latitude
	var lon= location.coords.longitude
	var acc= location.coords.accuracy
	
	localStorage.setItem("GPSLat", lat)
	localStorage.setItem("GPSLon", lon)
	localStorage.setItem("GPSAcc", acc)
	
	console.log("GPS "+lat+" "+lon+" "+acc)
	//clearDebug()
	printDebug("GPS "+lat+" "+lon+" "+acc)
	//alert("GPS "+lat+" "+lon+" "+acc)
	
	var event = document.createEvent('Event')
	event.initEvent('gpsupdate', true, true)
	document.dispatchEvent(event);
	
	/*
	document.getElementById("console").innerHTML += getDistanceFromLatLonInKm(50.936195,-1.396707,lat,lon)+"km from interchange <br/>"
	document.getElementById("console").innerHTML += getDistanceFromLatLonInKm(50.897173,-1.404026,lat,lon)+"km from home <br/>"
	*/
}

//The callback function executed when the location could not be fetched.
function onGeoError(error) {
	console.log(error);
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2-lat1);  // deg2rad below
		var dLon = deg2rad(lon2-lon1); 
		var a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
			Math.sin(dLon/2) * Math.sin(dLon/2)
			; 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c; // Distance in km
		return d;
	}

	function deg2rad(deg) {
		return deg * (Math.PI/180)
	}