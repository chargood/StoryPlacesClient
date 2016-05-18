"use strict";

define([
    'underscore',
    'backbone',
    'CardCollection'
], function (_, Backbone, CardCollection) {
    var Story;

    Story = Backbone.Model.extend({
        urlRoot: '/storyplaces/story',

        parse: function (data) {
            if (!data.deck.models) {
                data.deck = new CardCollection(data.deck)
            }

            return data;
        },

        getCard: function (cardId) {
            return this.deck().get(cardId);
        },

        deck: function() {
            return this.get('deck');
        },

        save: function () {
            console.log("Preventing saving of a story");
        }
    });

    return Story;

});
