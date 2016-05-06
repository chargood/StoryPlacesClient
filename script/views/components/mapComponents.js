/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'map',
    'iconFactory',
    'underscore',
    'jquery',
    'cachedCardWithMarker'
], function (map, iconFactory, _, $, CachedCardWithMarker) {
    return {
        mapDivId: '#mapDiv',
        visibleCards: [],

        cachedCards: null,
        currentReadingId: null,

        render: function(el, reading) {
            if(this.currentReadingId == null || this.currentReadingId != reading.id) {
                this.buildCachedCards(reading);
                this.currentReadingId = reading.id;
            }

            this.updateCardStates(reading);
            this.renderMap(el, reading);
        },

        renderMap: function (el, reading) {
            var template = _.template($('#deckMapTemplate').html());

            $('#page').html(template({
                visibleCards: this.visibleCards,
                readingId: reading.id,
                storyName: reading.getStoryObj().name
            }));

            map.bindMapIntoDOM($(this.mapDivId).get(0))

            _.each(this.visibleCards, function (cachedCard) {
                cachedCard.updateMarkerOnMap();
            });
        },

        buildCachedCards: function(reading) {
            var that = this;
            this.cachedCards = [];
            _.each(reading.getStoryObj().get("deck"), function (card) {
                var cachedCard = new CachedCardWithMarker(card);
                console.log(card, cachedCard);
                that.cachedCards.push(cachedCard);
            });
        },

        updateCardStates: function(reading) {
            var that = this;
            this.visibleCards = [];
            _.each(this.cachedCards, function (cachedCard) {
                cachedCard.updateStatus(reading);

                if (cachedCard.get('visible')) {
                    that.visibleCards.push(cachedCard);
                }
            });
        }
    }
});
