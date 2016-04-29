define([
    'underscore',
    'backbone',
    'moment'
], function (_, Backbone, Moment) {
    
    'use strict';
    var timeRangeCondition = Backbone.Model.extend({
        
        currentMoment : function() {
            return Moment();
        },
        
        resolveCondition : function(context) {
            
            var now = this.currentMoment();
            
            var firstTime = this.get('first');
            var lastTime = this.get('last');
            
            var firstDate = Moment(now.format("YYYY-MM-DD") + ' ' + firstTime);
            var lastDate = Moment(now.format("YYYY-MM-DD") + ' ' + lastTime); 
            
            return now.diff(firstDate) >= 0 && now.diff(lastDate) <= 0;
                 
        }
    });
    return timeRangeCondition;
});