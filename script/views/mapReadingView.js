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
    'MarkerCollection',
	'iconRepository',
	'SPGPS'
], function (Backbone, map, iconFactory, _, $, MarkerCollection,iconRepository,SPGPS) {
    var MapReadingView;

    MapReadingView = Backbone.View.extend({
        
		events: {
			'click #mapDiv': 'mapclick',			
		},
		
		mapDivId: 'mapDiv',
        templateId: '#deckMapTemplate',

        reading: undefined,
        markers: undefined,

        initialize: function () {
			this.$el.append("<div id='" + this.mapDivId + "' class='mapContainer'></div>");
            map.bindMapIntoDOM($('#' + this.mapDivId).get(0));
        },

        newReading: function (reading) {
            this.markers = new MarkerCollection();
            this.reading = reading;
			this.reading.cardStates.on(this.reading.cardStates.eventCardStatesModified, this.cardStatesModifiedEvent, this);
            this.renderAllMarkers();
        },
		
		tearDown: function () {
            this.reading.cardStates.off(this.reading.cardStates.eventCardStatesModified, this.renderAllMarkers, this);
            this.markers.destroy();
        },

        renderAllMarkers: function () {
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

        getMarkerFromCardState: function (cardState) {
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

        updateMarkerFromCardState: function (cardState) {
            var marker = this.getMarkerFromCardState(cardState);

            if (marker) {
                marker.updateMarkerFromCardState(cardState);
            }
        }, 
        
        refresh: function() {
            map.refresh();
        },
		
		mapclick: function(e){
			if(this.sim){
				SPGPS.fake(document.mclat,document.mclng)
			}
		},
		
		render: function (sim) {
			this.sim = sim
			if(sim){
				this.el.style.float="left"
				this.el.style.width="65%"
				this.el.style.height="100%"
			}
		}


    });

    return MapReadingView;
});
