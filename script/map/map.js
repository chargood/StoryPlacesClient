/**
 * Created by kep1u13 on 05/05/2016.
 */

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
