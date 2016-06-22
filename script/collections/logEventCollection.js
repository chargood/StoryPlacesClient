define([
    'underscore',
    'backbone',
	'backbone_dual',
    'LogEvent',
], function (_, Backbone, BackbonedualStorage, LogEvent) {

    var LogEventCollection = Backbone.Collection.extend({
		urlRoot: '/storyplaces/logevent',
        url: '/storyplaces/logevent',

        model: LogEvent,		

        userId: undefined,

        initialize: function () {
			this.userId = localStorage.getItem("User-ID");
			
            this.urlRoot = '/storyplaces/logevent/user/' + this.userId;
            this.url = '/storyplaces/logevent/user/' + this.userId;            
        },

        newLogEvent: function (successCallback, failureCallback,type,data) {
            var that = this;
			
			var date = Date();
			
            var logEvent = new LogEvent();

            var values = {
                user: this.userId,
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
			
			this.syncDirtyAndDestroyed()

        }

    });

    return LogEventCollection;

});
