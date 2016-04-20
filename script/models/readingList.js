define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    var ReadingList = Backbone.Collection.extend({
        urlRoot: '/storyplaces/reading',
        url: '/storyplaces/reading'
    });

    return ReadingList;

});