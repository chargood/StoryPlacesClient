/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'Story'
], function (Story) {
    var StoryRepository;

    StoryRepository = {
        currentStory: null,

        getStory: function (storyId, successCallback, failureCallback) {
            if (this.currentStory && this.currentStory.id === storyId) {
                successCallback(this.currentStory);
                return true;
            }

            var that = this;
            var newStory = new Story({id: storyId});

            newStory.fetch({
                success: function() {
                    that.currentStory = newStory;
                    successCallback(that.currentStory);
                },
                error: function(err, response) {
                    that.currentStory = undefined;

                    console.log("####  Story failed to load ####");
                    console.log(err);

                    console.log(response);

                    if (failureCallback) {
                        failureCallback(err);
                    }
                }
            });

            return false;
        }
    };

    return StoryRepository;
});
