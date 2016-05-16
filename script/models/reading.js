define([
    'underscore',
    'backbone',
    'StoryRepository',
    'models/conditions/comparissonCondition',
    'models/conditions/locationCondition',
    'models/conditions/logicalCondition',
    'models/storyFunction'
], function (_, Backbone, StoryRepository, ComparissonCondition, LocationCondition, LogicalCondition, StoryFunction) {

    var Reading = Backbone.Model.extend({

        urlRoot: '/storyplaces/reading',
        storyObj: undefined,

        getStoryObj: function () {
            return this.storyObj;
        },

        setVariable: function (key, value) {
            var vars = this.get("variables");
            var update = false;

            this.get("variables").forEach(function (variable) {
                if (variable.key == key) {
                    variable.value = value;
                    update = true;
                }
            });

            if (!update) {
                vars.push({ key: key, value: value });
            }

            this.set("variables", vars);
            this.save();
        },

        getVariable: function (key) {
            var result;
            this.get("variables").forEach(function (variable) {
                if (variable.key == key) {
                    result = variable.value;
                }
            });
            return result;
        },

        getValue: function (val, type) {
            if (type == "String" || type == "Integer") {
                return val;
            }
            else if (type == "Variable") {
                return this.getVariable(val);
            }

        },

        checkCardConditions: function (cardId) {
            var that = this;
            var res = true;
            var story = this.getStoryObj();
            var card = story.getCard(cardId);
            var conditions = card.get('conditions');
            conditions.forEach(function (condition) {
                if (!that.checkCondition(condition)) {
                    res = false;
                }
            });
            return res;
        },

        checkCardNonLocConditions: function (cardId) {
            var that = this;
            var res = true;
            var conditions = this.getStoryObj().getCard(cardId).get('conditions');
            conditions.forEach(function (condition) {
                if (!that.checkCondition(condition) && that.getCondition(condition).get("type") != "location") {
                    res = false;
                }
            });
            return res;
        },

        checkCondition: function (conditionName) {
            return this.getCondition(conditionName).resolveCondition(this);
        },

        getCondition: function (conditionName) {
            console.log("getCondition ", conditionName);
            var res;
            var conditions = this.getStoryObj().get("conditions");
            conditions.forEach(function (condition) {

                if (condition.name == conditionName) {
                    res = condition;
                }
            });

            if (res.type == "comparisson") {
                return new ComparissonCondition(res);
            }
            else if (res.type == "logical") {
                return new LogicalCondition(res);
            }
            else if (res.type == "location") {
                return new LocationCondition(res);
            }
            else {
                return null;
            }
        },

        executeCardFunctions: function (cardId) {
            var that = this;
            var functions = this.getStoryObj().getCard(cardId).functions;
            functions.forEach(function (afunction) {
                that.executeFunction(afunction);
            });
        },

        executeFunction: function (functionName) {
            return this.getFunction(functionName).execute(this);
        },

        getFunction: function (functionName) {
            var res;
            var functions = this.getStoryObj().get("functions");
            functions.forEach(function (afunction) {
                if (afunction.name == functionName) {
                    res = afunction;
                }
            });

            return new StoryFunction(res);
        }
    });

    return Reading;

});
