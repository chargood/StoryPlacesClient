var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');

requirejs.config({
    baseUrl: 'script',
    nodeRequire: require,
    paths: {
        underscore: 'libs/underscore.min.amd',
        backbone: 'libs/backbone.min.amd',
        moment: 'libs/moment.min'        
    }
});

describe('TimeRangeCondition model', function(){
    'use strict';
        
    var Condition;
    var Moment;
    
    beforeEach(function(done) {
        requirejs(['moment', 'models/conditions/timeRangeCondition'], function(moment, condition) {
            Moment = moment;
            Condition = new condition();   
            done();    
        });
    });
    
    describe('when resolve is called', function(){
        
        var resolveConditionHelper = function(firstTime, lastTime, currentDateTimeIso, expectedResult) {
            
            // arrange
            Condition.set('first', firstTime);
            Condition.set('last', lastTime);
            var validMoment = Moment(currentDateTimeIso);
            
            // moment is a pig to mock, so lets just replace the function.
            Condition.currentMoment = function() { return validMoment; };
            
            // act 
            var result = Condition.resolveCondition();
            
            // assert
            expect(result).to.equal(expectedResult);
            
        };
        
        it('should return true when the current time is between the first and last times', sinon.test(function(){
            resolveConditionHelper("10:00", "11:00", "2016-01-01 10:05", true);
        }));
        
        it('should return false when the current time is before the first time', sinon.test(function(){
            resolveConditionHelper("10:00", "11:00", "2016-01-01 09:50", false);
        }));
        
        it('should return false when the current time is after the last time', sinon.test(function(){
            resolveConditionHelper("10:00", "11:00", "2016-01-01 11:50", false);
        }));
        
        it('should return true when the current time equals the first time', sinon.test(function(){
            resolveConditionHelper("10:00", "11:00", "2016-01-01 10:00", true);
        }));
        
        it('should return true when the current time equals the last time', sinon.test(function(){
            resolveConditionHelper("10:00", "11:00", "2016-01-01 11:00", true);
        }));
    });
});