"use strict";

define([
    'underscore',
    'backbone',
    'CardCollection'
], function (_, Backbone, CardCollection) {
    var Story;

    Story = Backbone.Model.extend({

        urlRoot: '/storyplaces/story',

        //TODO: create a proper card object and return/use that rather then just returning raw json
        getCard: function (id) {
            return this.deck().get(id);
        },

        deck: function() {
            return this.get('deck');
        },

        parse: function (data) {
            if (!data.deck.models) {
                data.deck = new CardCollection(data.deck)
            }

            return data;
        },

        save: function () {
            console.log("Preventing saving of a story");
        }
    });

    return Story;

});
