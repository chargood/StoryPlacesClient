"use strict";

define([
    'underscore',
    'backbone',
    'CardCollection',
    'MediaCacheRepository'
], function (_, Backbone, CardCollection, MediaCache) {
    var Story;

    Story = Backbone.Model.extend({
        urlRoot: '/storyplaces/story',

        parse: function (data) {

            if (!data.deck) {
                data.deck = new CardCollection();
                return data;
            }

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
        },

        cacheMedia: function() {
            // attempts to cache media related to this story
            var storyId = this.get("id");
            var mediaIds = this.get("cachedMediaIds");

            MediaCache.populate(storyId, mediaIds);
        }
    });

    return Story;

});
