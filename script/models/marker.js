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

define([
    'backbone',
    'map',
    'iconFactory',
    'iconRepository'
], function (Backbone, map, iconFactory, iconRepository) {
    var Marker;

    Marker = Backbone.Model.extend({

        // This works as this object's ID is the same as that of the card it is representing

        parse: true,

        initialize: function () {
            this.set({
                marker: undefined,
                type: undefined
            });
        },

        buildMakerFromCard: function (card) {
            if (card.id != this.id) {
                return;
            }

            this.set({marker: this.createMarker(card)});
            this.set({type: this.getMarkerTypeFromCard(card)});
        },

        createMarker: function (card) {
            var type = this.getMarkerTypeFromCard(card);

            if (type == "point") {
                return this.createPointMarkerOnMap(card);
            }

            return undefined
        },

        getMarkerTypeFromCard: function (card) {
            if (!card.get('hint').location || card.get('hint').location.length == 0) {
                return undefined;
            }

            return card.get('hint').location[0].type;
        },

        createPointMarkerOnMap: function (card) {
            var lat = card.get('hint').location[0].lat;
            var long = card.get('hint').location[0].lon;

            if (!lat || !long) {
                return undefined;
            }

            return map.createMarkerWithPopUp(lat, long, iconRepository.redIcon, this.getPopUpTextFromCard(card), null);
        },

        getPopUpTextFromCard: function (card) {
            return "<p><b>" + _.escape(card.getLabel()) + "</b></p>"
                + "<p>" + _.escape(card.getTeaser()) + "</p>"
                + "<p>" + _.escape(card.getHintDirection()) + "</p>";
        },

        updateMarkerFromCardState: function (cardState) {
            if (this.id != cardState.id) {
                return;
            }

            if (!cardState.get('modified') || !this.get('marker')) {
                return;
            }

            if (this.get('type') == "point") {
                this.updatePointMarkerOnMap(cardState)
            }
        },

        updatePointMarkerOnMap: function (cardState) {
            if (!cardState) {
                return;
            }

            if (!cardState.get('visible')) {
                this.removeFromMap();
                return;
            }

            map.updateMarkerIcon(this.get('marker'), iconFactory.getIconForCardState(cardState))

            if (!cardState.get('previousVisible')) {
                map.addMarkerToMap(this.get('marker'));
            }
        },

        removeFromMap: function () {
            map.removeMarkerFromMap(this.get('marker'));
        },

        destroy: function() {
            this.removeFromMap();
            if (this.get('marker')) {
                this.get('marker').unbindPopup();
            }
            this.set({marker: undefined});
        }

    });

    return Marker;
});
