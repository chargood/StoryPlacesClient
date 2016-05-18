/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'backbone',
    'CardState',
], function (Backbone, CardState) {
    var cardStateCollection;

    cardStateCollection = Backbone.Collection.extend({
        model: CardState,

        eventCardStatesUpdated: 'cardStatesUpdated', // We have run a update sequence, cards may or may not have been modified
        eventCardStatesModified: 'cardStatesModified', // Cards were modified in the process.

        visibleCards: function () {
            return this.where({visible: true});
        },

        modifiedCards: function () {
            return this.where({modified: true});
        },

        updateCardStates: function (reading) {

            console.log("updating card states");

            this.each(function (cardState) {
                cardState.updateState(reading);
            });

            if (this.modifiedCards().length != 0) {
                console.log("***Firing cards modified event");
                this.trigger('cardStatesModified', this.modifiedCards());
            }

            console.log("***Firing cards updated event");
            this.trigger(this.eventCardStatesUpdated);
        }
    });

    return cardStateCollection;
});
