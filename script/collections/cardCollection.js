/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'backbone',
    'Card',
], function (Backbone, Card) {
    var cardCollection;

    cardCollection = Backbone.Collection.extend({
        model: Card,

        changedCards: function () {
            return this.where({changed: true});
        },

        visibleCards: function () {
            return this.where({visible: true});
        }
    });

    return cardCollection;
});
