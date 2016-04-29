define([
    'underscore',
    'backbone',
    'models/story',
    'models/conditions/comparissonCondition',
    'models/conditions/locationCondition',
    'models/conditions/logicalCondition',
    'models/conditions/timeRangeCondition',
    'models/storyFunction'
], function (_, Backbone, Story, ComparissonCondition, LocationCondition, LogicalCondition, TimeRangeCondition, StoryFunction) {

    var Reading = Backbone.Model.extend({

        urlRoot: '/storyplaces/reading',

        initialize: function () {
            var that = this;
            this.on("change", function () {
                if (this.hasChanged("story")) {
                    var storyId = that.get("story");
                    var story = new Story({ id: storyId });
                    story.fetch({
                        success: function (story) {
                            that.storyObj = story;
                        }
                    });
                }
            });
        },

        getStoryObj: function () {
            if (this.storyObj) {
                return this.storyObj;
            }
            else {
                var storyId = this.get("story");
                var story = new Story({ id: storyId });
                story.fetch({
                    success: function (story) {
                        return story;
                    }
                });
            }
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
            var conditions = card.conditions;
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
            var conditions = this.getStoryObj().getCard(cardId).conditions;
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
            else if (res.type == "timerange") {
                return new TimeRangeCondition(res);
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
