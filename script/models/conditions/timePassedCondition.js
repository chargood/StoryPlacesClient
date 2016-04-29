define([
    'underscore',
    'backbone',
    'moment'
], function (_, Backbone, Moment) {
    
    'use strict';
    var timePassedCondition = Backbone.Model.extend({
        
        currentMoment : function() {
            return Moment();
        },
        
        resolveCondition : function(context) {
            
            var now = this.currentMoment();            
            var minutesThatMustHaveElapsed = this.get('minutes');
            
            // get the timestamp
            var timestampString = context.getValue(this.get("tsVariableName"), "Variable");
            if (timestampString === undefined) {
                // this variable hasn't been set yet
                return false;
            }
            
            var timestampMoment = Moment(timestampString);
            var earliestAcceptableMoment = timestampMoment.add(minutesThatMustHaveElapsed, 'm');
            
            return earliestAcceptableMoment.isBefore(now);
        }
    });
    return timePassedCondition;
});