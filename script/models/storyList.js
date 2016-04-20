define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var StoryList = Backbone.Collection.extend({
        url: '/storyplaces/story'
    });

    return StoryList;
});

