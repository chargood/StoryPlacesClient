define([
    'backbone'
], function (Backbone) {
    var StoryCollection;

    StoryCollection = Backbone.Collection.extend({
        url: '/storyplaces/story',

    });

    return StoryCollection;
});

