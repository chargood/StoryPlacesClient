define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    var ComparissonCondition = Backbone.Model.extend({
        resolveCondition: function (context) {
            var vara = context.getValue(this.get("a"), this.get("aType"));
            var varb = context.getValue(this.get("b"), this.get("bType"));
            console.log("Comparisson Cond ", this.get("operand"), vara, varb);
            if (this.get("operand") == "==") {
                if (vara == varb)
                    return true;
                else
                    return false;
            }
            else if (this.get("operand") == "!=") {
                if (vara != varb)
                    return true;
                else
                    return false;
            }
            else if (this.get("operand") == "<") {
                if (vara < varb)
                    return true;
                else
                    return false;
            }
            else if (this.get("operand") == ">") {
                if (vara > varb)
                    return true;
                else
                    return false;
            }
            else if (this.get("operand") == "<=") {
                if (vara <= varb)
                    return true;
                else
                    return false;
            }
            else if (this.get("operand") == ">=") {
                if (vara >= varb)
                    return true;
                else
                    return false;
            }
            else
                return false;
        }
    });

    return ComparissonCondition;

});
