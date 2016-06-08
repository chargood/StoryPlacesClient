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

        getReading: function (readingId, successCallback, failureCallback) {
            if (this.currentReading && this.currentReading.id === readingId) {
                successCallback(this.currentReading);
                return true;
            }

            var that = this;
            var newReading = new Reading({id: readingId});

            newReading.fetch({
                success: function() {
                    that.currentReading = newReading;
                    successCallback(that.currentReading);
                },
                error: function(err, response) {
                    that.currentReading = undefined;

                    console.log("####  Reading failed to load ####");
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

    return ReadingRepository;
});
