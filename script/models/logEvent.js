define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    var LogEvent = Backbone.Model.extend({
        urlRoot: '/storyplaces/logevent',
    });

    return LogEvent;

});