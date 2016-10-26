/* *****************************************************************************
 *
 * StoryPlaces
 *

This application was developed as part of the Leverhulme Trust funded 
StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk

Copyright (c) 2016
  University of Southampton
    Charlie Hargood, cah07r.ecs.soton.ac.uk
    Kevin Puplett, k.e.puplett.soton.ac.uk
	David Pepper, d.pepper.soton.ac.uk

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The name of the Universities of Southampton nor the name of its 
	  contributors may be used to endorse or promote products derived from 
	  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

***************************************************************************** */

define([
    'underscore',
    'backbone',
    'StoryRepository',
    'CardStateCollection',
    'comparisonCondition',
    'locationCondition',
    'logicalCondition',
    'timeRangeCondition',
    'timePassedCondition',
    'storyFunction'
], function (_,
             Backbone,
             StoryRepository,
             CardStateCollection,
             ComparisonCondition,
             LocationCondition,
             LogicalCondition,
             TimeRangeCondition,
             TimePassedCondition,
             StoryFunction) {

    var Reading = Backbone.Model.extend({

        // These are stored here as then they are not real properties of
        // the reading so we shouldn't end up passing them back up to the server

        urlRoot: '/storyplaces/reading',
        storyObject: undefined,
        cardStates: undefined,

        eventStoryLoaded: 'readingEventStoryLoaded',

        initialize: function () {
            var that = this;
            this.cardStates = new CardStateCollection;

            this.set({variables: []});

            this.on('cardFunctionsExecuted', this.updateCardStates, this);
            this.on('change:story', this.afterStoryIdUpdateEvent, this);

            document.addEventListener('gpsupdate', function () {
                that.updateCardStates()
            });
        },

        afterStoryIdUpdateEvent: function () {
            var that = this;

            StoryRepository.getStory(this.get('story'), function (story) {
                that.attachSubModels(story);
                that.cardStates.updateCardStates(that);
                that.trigger(that.eventStoryLoaded);
            });
        },

        attachSubModels: function (story) {
            var that = this;

            this.storyObject = story;
            this.storyObject.deck().each(function (card) {
                that.cardStates.add({id: card.id});
            });
        },

        getCardFromStory: function (cardId) {
            return this.getStory().getCard(cardId);
        },

        getCardState: function (cardId) {
            return this.cardStates.get(cardId);
        },

        updateCardStates: function () {
            this.cardStates.updateCardStates(this);
        },

        getStory: function () {
            return this.storyObject;
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
                vars.push({key: key, value: value});
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
            var card = this.getCardFromStory(cardId);
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
            var conditions = this.getCardFromStory(cardId).get('conditions');
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
            var conditions = this.getStory().get("conditions");
            conditions.forEach(function (condition) {

                if (condition.name == conditionName) {
                    res = condition;
                }
            });

            if (res.type == "comparisson") {
                return new ComparisonCondition(res);
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
            else if (res.type == "timepassed") {
                return new TimePassedCondition(res);
            }
            else {
                return null;
            }
        },

        executeCardFunctions: function (cardId) {
            var that = this;
            var functions = this.getCardFromStory(cardId).get('functions');
            functions.forEach(function (afunction) {
                that.executeFunction(afunction);
            });

            this.trigger('cardFunctionsExecuted');
        },

        executeFunction: function (functionName) {
            return this.getFunction(functionName).execute(this);
        },

        getFunction: function (functionName) {
            var res;
            var functions = this.getStory().get("functions");
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
