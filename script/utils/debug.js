define([], function(){
	
	var initialize = function() {
		
		debugOn()

		addDebugLocButton(50.93679,-1.396202,"32north");
		addDebugLocButton(50.937385,-1.397039,"gower");
		addDebugLocButton(50.936195,-1.396707,"interchange");
		addDebugLocButton(50.936181,-1.397393,"nuffnorth");
		addDebugLocButton(50.935971,-1.397544,"nuffsouth");
		addDebugLocButton(50.936066,-1.396074,"32south");
		addDebugLocButton(50.935106,-1.395923,"library");
		addDebugLocButton(50.934558,-1.397104,"susu");
		addDebugLocButton(50.934707,-1.398295,"garden");
		addDebugLocButton(50.935633,-1.399089,"health");		
	};
	
	var debugOn = function debugOn(){
		document.getElementById("debug").style.display = "block"	
	};

	var debugOff = function (){
		document.getElementById("debug").style.display = "none"	
	};

	var printDebug = function (msg){
		document.getElementById("debug").innerHTML+="<p>"+msg+"</p>"	
	};

	var clearDebug = function (){
		document.getElementById("debug").innerHTML=""
	};

	var addDebugLocButton = function (lat,lon,label){
		document.getElementById("debug").innerHTML+="<button onclick='clickDebugLocButton("+lat+","+lon+")'>"+label+"</button>"	
	};

	var clickDebugLocButton = function (lat,lon){
		localStorage.setItem("GPSLat", lat)
		localStorage.setItem("GPSLon", lon)
		
		var event = document.createEvent('Event')
		event.initEvent('gpsupdate', true, true)
		document.getElementById("page").dispatchEvent(event);		
	};
	
	// return functions as object
	return {
		initialize : initialize,
		debugOn : debugOn,
		debugOff : debugOff,
		printDebug : printDebug,
		clearDebug : clearDebug,
		addDebugLocButton : addDebugLocButton,
		clickDebugLocButton : clickDebugLocButton		
	};
	
});



