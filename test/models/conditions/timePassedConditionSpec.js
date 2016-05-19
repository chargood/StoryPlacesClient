var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');


describe('TimePassedCondition model', function () {
    'use strict';

    var Condition;
    var Moment;

    beforeEach(function (done) {
        requirejs(['moment', 'models/conditions/timePassedCondition'], function (moment, condition) {
            Moment = moment;
            Condition = new condition();
            done();
        });
    });

    describe('when resolve is called', function () {
        
        var resolveConditionTestHelper = function(currentMomentIso, minutesPassed, timeStampIso, expectedResult) {
            
            // arrange
            Condition.currentMoment = function() { return Moment(currentMomentIso);}; // mock now
            Condition.set("minutes", minutesPassed); // mock minutes to have passed before condition is true
            var context = { getValue: function() { return timeStampIso; } }; // mock timestamp
            
            // act
            var result = Condition.resolveCondition(context);
            
            // assert
            expect(result).to.equal(expectedResult);
            
        };
        
        it('should return true when the timestamp variable plus minutes is before the current moment', sinon.test(function () {
            resolveConditionTestHelper("2016-01-01 10:00", 1, "2016-01-01 09:55", true);
        }));
        
        it('should return false when the timestamp variable has not been set', sinon.test(function () {
            resolveConditionTestHelper("2016-01-01 10:00", 1, undefined, false);
        }));
        
        it('should return false when the timestamp plus minutes is after the current moment', sinon.test(function () {
            resolveConditionTestHelper("2016-01-01 10:00", 10, "2016-01-01 09:55", false);
        }));
    });


});