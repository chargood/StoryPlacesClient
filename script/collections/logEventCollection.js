define([
    'underscore',
    'backbone',
    'LogEvent',
], function (_, Backbone, LogEvent) {

    var LogEventCollection = Backbone.Collection.extend({
        urlRoot: '/storyplaces/logevent',
        url: '/storyplaces/logevent',

        model: LogEvent,

        initialize: function () {
            
        },

        newLogEvent: function (successCallback, failureCallback,type,data) {
            var that = this;
			
			var date = Date();
			var userId = localStorage.getItem("User-ID")

            var logEvent = new LogEvent();

            var values = {
                user: userId,
				date: date,
                type: type,
				data: data
            };
            logEvent.save(
                values,
                {
                    success: function (logEvent) {
                        that.add(logEvent);
                        successCallback();
                    },
                    error: function () {
                        failureCallback();
                    },
                })

        }

    });

    return LogEventCollection;

});
