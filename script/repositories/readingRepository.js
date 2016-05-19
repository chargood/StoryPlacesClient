/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'Reading',
], function (Reading) {
    var ReadingRepository;

    ReadingRepository = {
        currentReading: undefined,
        currentStory: undefined,

        getReading: function (readingId, callback) {
            if (this.currentReading && this.currentReading.id === readingId) {
                callback(this.currentReading);
                return true;
            }

            var that = this;
            this.currentReading = new Reading({id: readingId});
            this.currentReading.fetch({
                success: function() {
                    callback(that.currentReading);
                }
            });
            return false;
        }
    };

    return ReadingRepository;
});
