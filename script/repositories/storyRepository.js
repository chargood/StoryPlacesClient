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

        getStory: function (storyId, callback) {
            if (this.currentStory && this.currentStory.id === storyId) {
                callback(this.currentStory);
                return true;
            }

            var that = this;
            this.currentStory = new Story({id: storyId});
            this.currentStory.fetch({
                success: function() {
                    callback(that.currentStory);
                }
            });
            return false;
        }
    };

    return StoryRepository;
});
