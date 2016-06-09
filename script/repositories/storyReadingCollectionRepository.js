/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'StoryReadingCollection'
], function (StoryReadingCollection) {
    var StoryReadingCollectionRepository;

    StoryReadingCollectionRepository = {
        currentStoryReadingCollection: null,
        storyId: null,

        getStoryReadingCollection: function (storyId, successCallback, failureCallback) {
            if (this.currentStoryReadingCollection && this.storyId === storyId) {
                successCallback(this.currentStoryReadingCollection);
                return true;
            }

            var that = this;
            var newSRC = new StoryReadingCollection(storyId, localStorage.getItem("User-ID"));

            newSRC.fetch({
                success: function() {
                    that.currentStoryReadingCollection = newSRC;
                    successCallback(that.currentStoryReadingCollection);
                },
                error: function(err, response) {
                    that.currentStoryReadingCollection = undefined;

                    console.log("####  Story Reading Collection failed to load ####");
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

    return StoryReadingCollectionRepository;
});
