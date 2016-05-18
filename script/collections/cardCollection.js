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

    });

    return cardCollection;
});
