define([
    'underscore',
    'backbone',
    'moment'
], function (_, Backbone, Moment) {

    var StoryFunction = Backbone.Model.extend({
        checkConditions: function (context) {
            var that = this;
            var res = true;
            var conditions = this.get("conditions");
            conditions.forEach(function (condition) {
                if (!context.checkCondition(condition)) {
                    res = false;
                }
            });

            return res;
        },

        execute: function (context) {
            if (this.checkConditions(context)) {
                var argumentsString = "context,";

                var args = this.get("arguments");
                args.forEach(function (argument) {
                    argumentsString += "'" + argument + "',";
                });
                argumentsString = argumentsString.substring(0, argumentsString.length - 1);
                eval("this." + this.get("type") + "function(" + argumentsString + ")");
            }
        },

        setfunction: function (context, key, value) {
            context.setVariable(key, value);
        },
        
        settimestampfunction: function(context, key) {
            var now = Moment().format();
            context.setVariable(key, now);
        },

        incrementfunction: function (context, key, value) {
            if (!isNaN(parseInt(context.getVariable(key))) && !isNaN(parseInt(value)))
                context.setVariable(key, (parseInt(context.getVariable(key)) + parseInt(value)));
        }

    });

    return StoryFunction;

});
