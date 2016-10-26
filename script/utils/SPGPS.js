/* *****************************************************************************
 *
 * StoryPlaces
 *

This application was developed as part of the Leverhulme Trust funded 
StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk

Copyright (c) 2016
  University of Southampton
    Charlie Hargood, cah07r.ecs.soton.ac.uk
    Kevin Puplett, k.e.puplett.soton.ac.uk
	David Pepper, d.pepper.soton.ac.uk

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The name of the Universities of Southampton nor the name of its 
	  contributors may be used to endorse or promote products derived from 
	  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

***************************************************************************** */

define(['jquery','geolocate'], function ($,geolocate) {

	var watcher;

    var gpsOptions = {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000};

    var onGeoSuccess = function (location) {
        var lat = location.coords.latitude;
        var lon = location.coords.longitude;
        var acc = location.coords.accuracy;

        hideGPSWarning();

        localStorage.setItem("GPSLat", lat);
        localStorage.setItem("GPSLon", lon);

        localStorage.setItem("GPSAcc", acc);

        console.log("GPS " + lat + " " + lon + " " + acc);
        var event = document.createEvent('Event');
        event.initEvent('gpsupdate', true, true);
        document.dispatchEvent(event);
    };

    var showGPSWarning = function () {
        $('#gpsErrorBar').show();
        $('body').css('padding-top', $('#gpsErrorBar').css('height'));
    };

    var hideGPSWarning = function () {
        $('#gpsErrorBar').hide();
        $('body').css('padding-top', 0);
    };

    var deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };

    var getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    };

    var testLocator = function (successCallback, errorCallback) {

        if (!navigator.geolocation) {
            errorCallback();
        }

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, gpsOptions);
    };
	
    var initiateLocator = function () {
        watcher=navigator.geolocation.watchPosition(onGeoSuccess, showGPSWarning, gpsOptions);
    };
	
	var fakerOn = function () {
		navigator.geolocation.clearWatch(watcher)
		geolocate.use()
		watcher=navigator.geolocation.watchPosition(onGeoSuccess, showGPSWarning, gpsOptions);
	}
	
	var fake = function (la,lo) {
		geolocate.change({lat: la, lng: lo});
	}
	
	var fakerOff = function () {
		navigator.geolocation.clearWatch(watcher)
		geolocate.restore()
		watcher=navigator.geolocation.watchPosition(onGeoSuccess, showGPSWarning, gpsOptions);
	}

    // return functions as an object
    return {
        getDistanceFromLatLonInKm: getDistanceFromLatLonInKm,
        initiateLocator: initiateLocator,
        testLocator: testLocator,
		fakerOn: fakerOn,
		fakerOff: fakerOff,
		fake: fake,
    };
});
