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
    'MarkerCollection'
], function (Backbone, map, iconFactory, _, $, MarkerCollection) {
    var MapReadingView;

    MapReadingView = Backbone.View.extend({
        mapDivId: 'mapDiv',
        templateId: '#deckMapTemplate',

        reading: undefined,
        markers: undefined,

        initialize: function () {
            this.$el.append("<div id='" + this.mapDivId + "' class='mapContainer'></div>");
            map.bindMapIntoDOM($('#' + this.mapDivId).get(0))
        },

        setup: function (reading) {
            if (!this.reading || this.reading.id != reading.id) {
                if (this.reading) {
                    this.reading.cardStates.off(this.reading.cardStates.eventCardStatesModified, this.render, this);
                    this.markers.destroy();
                }

                this.markers = new MarkerCollection;
                this.reading = reading;
                this.reading.cardStates.on(this.reading.cardStates.eventCardStatesModified, this.cardStatesModifiedEvent, this);
            }
            this.render();
        },

        render: function () {
            var that = this;
            this.reading.cardStates.each(function (cardState) {
                that.updateMarkerFromCardState(cardState);
            });
        },

        cardStatesModifiedEvent: function (modifiedCardStates) {
            var that = this;
            _.each(modifiedCardStates, function (cardState) {
                that.updateMarkerFromCardState(cardState);
            });
        },

        getMarkerFromCardState: function(cardState) {
            var marker = this.markers.get(cardState.id);

            if (marker !== undefined) {
                return marker;
            }

            return this.createMarkerFromCardState(cardState);
        },

        createMarkerFromCardState: function (cardState) {
            var card = this.reading.getStory().deck().get(cardState.id);
            var marker = this.markers.add({id: card.id});
            marker.buildMakerFromCard(card);

            return marker;

        },

        updateMarkerFromCardState: function(cardState) {
            var marker = this.getMarkerFromCardState(cardState);

            if (marker) {
                marker.updateMarkerFromCardState(cardState);
            }
        }



    });

    return MapReadingView;
});
