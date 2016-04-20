define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    var LogicalCondition = Backbone.Model.extend({
        resolveCondition: function (context) {
            var res = false;
            if (this.get("operand") == "AND") {
                res = true;
                var conditions = this.get("conditions");
                conditions.forEach(function (conditionName) {
                    if (!context.getCondition(conditionName).resolveCondition(context)) {
                        res = false;
                    }
                })
            }
            else if (this.get("operand") == "OR") {
                res = false;
                var conditions = this.get("conditions");
                conditions.forEach(function (conditionName) {
                    if (context.getCondition(conditionName).resolveCondition(context)) {
                        res = true;
                    }
                })
            }

            return res;
        }
    });

    return LogicalCondition;

});