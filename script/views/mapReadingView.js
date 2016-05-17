/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'backbone',
    'map',
    'iconFactory',
    'underscore',
    'jquery',
    'CardCollection'
], function (Backbone, map, iconFactory, _, $, CachedCardCollection) {
    var MapReadingView;

    MapReadingView = Backbone.View.extend({
        mapDivId: 'mapDiv',
        templateId: '#deckMapTemplate',
        currentReadingId: null,

        initialize: function () {
            this.$el.append("<div id='" + this.mapDivId + "' class='mapContainer'></div>");
        },

        render: function (reading) {
            map.bindMapIntoDOM($('#' + this.mapDivId).get(0))

            _.each(reading.storyObj.deck().changedCards(), function (cachedCard) {
                //cachedCard.updateMarkerOnMap();
            });
        },

        updateCardStates: function (reading) {
            reading.storyObj.get('deck').each(function (cachedCard) {
                cachedCard.updateStatus(reading);
            });
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

        createPointMarkerOnMap: function () {
            var lat = this.get('hint').location[0].lat;
            var long = this.get('hint').location[0].lon;

            if (!lat || !long) {
                this.set({marker: null});
                return;
            }

            this.set({marker: map.createMarkerWithPopUp(lat, long, iconFactory.getIconForCard(this), this.getPopUpText(), null)});
        },

        updatePointMarkerOnMap: function () {
            if (!this.get('visible')) {
                map.removeMarkerFromMap(this.get('marker'));
                return;
            }

            map.updateMarkerIcon(this.get('marker'), iconFactory.getIconForCard(this))

            if (!this.get('previousVisible')) {
                map.addMarkerToMap(this.get('marker'));
            }
        },


        getPopUpText: function () {
            return "<p><b>" + _.escape(this.getLabel()) + "</b></p>"
                + "<p>" + _.escape(this.getTeaser()) + "</p>"
                + "<p>" + _.escape(this.getHintDirection()) + "</p>";
        }

    });

    return MapReadingView;
});
