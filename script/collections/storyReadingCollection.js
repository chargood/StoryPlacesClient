define([
    'underscore',
    'backbone',
    'Reading',
], function (_, Backbone, Reading) {

    var StoryReadingCollection = Backbone.Collection.extend({
        urlRoot: '/storyplaces/story',
        url: '/storyplaces/story',

        storyId: undefined,
        userId: undefined,

        model: Reading,

        initialize: function (storyId, userId) {
            this.urlRoot = '/storyplaces/story/' + storyId + '/readings/' + userId;
            this.url = '/storyplaces/story/' + storyId + '/readings/' + userId;

            this.storyId = storyId;
            this.userId = userId;
        },

        newReading: function (successCallback, failureCallback) {
            var that = this;

            var reading = new Reading();

            var values = {
                story: this.storyId,
                user: this.userId,
                name: "Reading " + (this.length + 1)
            };
            reading.save(
                values,
                {
                    success: function (reading) {
                        that.add(reading);
                        successCallback();
                    },
                    error: failureCallback,
                })

        }

    });

    return StoryReadingCollection;

});
