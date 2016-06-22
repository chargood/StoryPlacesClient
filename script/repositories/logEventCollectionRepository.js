
"use strict";

define([
    'LogEventCollection'
], function (LogEventCollection) {
    var LogEventCollectionRepository;

    LogEventCollectionRepository = {
		currentLogEventCollection: null,
        storyId: null,
		
        getLogEventCollection: function (successCallback, failureCallback) {
            
            var that = this;
            var newLEC = new LogEventCollection();
						
            newLEC.fetch({
                success: function() {
                    that.currentLogEventCollection = newLEC;
                    successCallback(that.currentLogEventCollection);
                },
                error: function(err, response) {
                    that.currentLogEventCollection = undefined;

                    console.log("####  LogEvent Collection failed to load ####");
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

    return LogEventCollectionRepository;
});
