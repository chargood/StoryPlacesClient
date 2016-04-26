define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';
    var Story = Backbone.Model.extend({
        urlRoot: '/storyplaces/story',

        initialize: function () {},

        //TODO: create a proper card object and return/use that rather then just returning raw json
        getCard: function (id) {
            var result;
            this.get("deck").forEach(function (card) {
                if (card._id == id) {
                    result = card;
                }
            });
            return result;
        }
    });

    return Story;

});
