/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'Reading',
    'StoryRepository'
], function (Reading, StoryRepository) {
    var ReadingRepository;

    ReadingRepository = {
        currentReading: null,

        getReading: function (readingId, callback) {
            if (this.currentReading && this.currentReading.id === readingId) {
                callback(this.currentReading);
                return true;
            }

            var that = this;
            this.currentReading = new Reading({id: readingId});
            this.currentReading.fetch({
                success: function() {
                    StoryRepository.getStory(that.currentReading.get('story'), function (story) {
                        that.currentReading.storyObj = story;
                        callback(that.currentReading);
                    });
                }
            });
            return false;
        }
    };

    return ReadingRepository;
});
