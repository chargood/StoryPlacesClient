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

"use strict";

define([
    'leaflet'
], function (L) {
    
    var tileLayer;
    
    var Map = {
        leafletMapObject: null,
        defaultLocation: [50.935360, -1.396226],
        defaultZoom: 16,
        trackGPSLocation: true,
        attributionText: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        tileUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png?',

        createMapObject: function (mapDomElement) {
            console.log("**  Initialising Map into ", mapDomElement);

            this.leafletMapObject = L.map(mapDomElement, {zoomControl: false}).setView(this.defaultLocation, this.defaultZoom);
            tileLayer = L.tileLayer(this.tileUrl, { attribution: this.attributionText });
            tileLayer.addTo(this.leafletMapObject);

            if (this.trackGPSLocation) {
                this.setupGPSTracking();
            }
			
			
			this.leafletMapObject.on('click', function(e){
				document.mclat = e.latlng.lat
				document.mclng = e.latlng.lng	
			});			
			
        },

        setupGPSTracking: function () {
            this.leafletMapObject.locate({setView: true, maxZoom: 16, watch: true, maximumAge: 10000});
        },

        reattachMapObject: function (mapDomElement) {
            console.log("** Reattaching Map into ", mapDomElement);
            mapDomElement.parentElement.replaceChild(this.leafletMapObject.getContainer(), mapDomElement);
        },

        bindMapIntoDOM: function (mapDomElement) {
            if (!this.leafletMapObject) {
                this.createMapObject(mapDomElement);
            } else {
                this.reattachMapObject(mapDomElement);
            }
        },

        addMarkerToMap: function (marker) {
            if (marker && this.leafletMapObject) {
                marker.addTo(this.leafletMapObject);
            }
        },

        removeMarkerFromMap: function (marker) {
            if (marker && this.leafletMapObject) {
                this.leafletMapObject.removeLayer(marker);
            }
        },

        updateMarkerIcon: function(marker, icon) {
            if (marker && icon) {
                marker.setIcon(icon);
            }
        },

		updateMarkerLatLon: function(marker, lat,lon) {
            if (marker && lat&&lon) {
                marker.setLatLng([lat,lon]);
            }
        },
		
        createMarker: function(lat, long, icon) {
            if (lat && long && icon) {
                return L.marker([lat, long], {icon: icon})
            }

            return undefined;
        },

        createMarkerWithPopUp: function(lat, long, icon, text, eventHandler) {
            var marker = this.createMarker(lat, long, icon);

            if (!marker) {
                return undefined;
            }

            marker.bindPopup(text, eventHandler);
            return marker;
        },
        
        refresh: function() {
            this.leafletMapObject.invalidateSize();
        }
    }

    return Map;
});
