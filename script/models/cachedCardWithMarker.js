/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'backbone',
    'map',
    'iconFactory',
    'cachedCard'
], function (Backbone, map, iconFactory, cachedCard) {
    var CachedCardWithMarker = cachedCard.extend({

        initialize: function() {

            this.createMarker();
        },

        createMarker: function () {
            if (!this.get('hint').location || this.get('hint').location.length == 0) {
                this.set({marker: null});
                return;
            }

            if (this.get('hint').location[0].type == "point") {
                this.createPointMarkerOnMap();
                return;
            }

            this.set({marker: null});
        },

        updateMarkerOnMap: function () {
            if (!this.get('changed') || !this.get('marker')) {
                return;
            }

            if (this.get('hint').location[0].type == "point") {
                this.updatePointMarkerOnMap()
            }
        },

        createPointMarkerOnMap: function() {
            var lat = this.get('hint').location[0].lat;
            var long = this.get('hint').location[0].lon;

            if (lat && long) {
                this.set({marker: map.createMarker(lat, long, iconFactory.getIconForCard(this))});
                return;
            }

            this.set({marker: null});
        },

        updatePointMarkerOnMap: function() {
            if (!this.get('visible')) {
                map.removeMarkerFromMap(this.get('marker'));
                return;
            }

            map.updateMarkerIcon(this.get('marker'), iconFactory.getIconForCard(this))

            if (!this.get('previousVisible')) {
                map.addMarkerToMap(this.get('marker'));
            }
        }
    });

    return CachedCardWithMarker;
});
