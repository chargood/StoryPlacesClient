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
        mapDivId: 'mapDiv',
        templateId: '#deckMapTemplate',
        mapElement: undefined,

        reading: undefined,
        markers: undefined,

        initialize: function () {
            this.mapElement = this.$el.append("<div id='" + this.mapDivId + "' class='mapContainer'></div>");
            this.mapElement.on("click", this.mapclick.bind(this));
            //Extract the DOMElement from the JQuery object returned by append.
            map.bindMapIntoDOM(this.mapElement.get(0));
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
