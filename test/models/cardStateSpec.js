'use strict';

var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('CardState model', function () {

    var cardState;

    beforeEach(function (done) {
        requirejs(['CardState'], function (CardState) {
            cardState = new CardState();
            done();
        });
    });
    
    describe("initialize", function(){
        
        it('sets previousSuitable to false', function(){
            cardState.initialize();
            expect(cardState.get('previousSuitable')).to.equal(false);
        });
        
        it('sets previousVisible to false', function(){
            cardState.initialize();
            expect(cardState.get('previousVisible')).to.equal(false);
        });
        
        it('sets modified to false', function(){
            cardState.initialize();
            expect(cardState.get('modified')).to.equal(false);
        });
        
        it('sets visible to false', function(){
            cardState.initialize();
            expect(cardState.get('visible')).to.equal(false);
        });
        
        it('sets suitable to false', function(){
            cardState.initialize();
            expect(cardState.get('suitable')).to.equal(false);
        });
    });
    
    describe('updateStatus', function(){
        
        var reading;
        
        beforeEach(function(){
            reading = {};
            reading.checkCardNonLocConditions = function(value) { return false;};
            reading.checkCardConditions = function(value) {return false;};
        });
        
        it('sets previousSuitable to the existing suitable value', sinon.test(function(){
            
            // arrange                        
            var existingSuitable = "one";                        
            cardState.set('suitable', existingSuitable);
            
            // act
            cardState.updateState(reading);
            
            // assert
            expect(cardState.get('previousSuitable')).to.equal(existingSuitable);
        }));
        
        it('sets previousVisible to the existing visible value', function(){
            
            // arrange
            var existingVisible = "one";                        
            cardState.set('visible', existingVisible);
            
            // act
            cardState.updateState(reading);
            
            // assert
            expect(cardState.get('previousVisible')).to.equal(existingVisible);
            
        });
        
        it('sets modified to false', function(){
            // arrange
            cardState.set("modified", true);
            
            // act
            cardState.updateState(reading);
            
            // assert
            expect(cardState.get("modified")).to.equal(false);
        });
        
        it('sets visible to false', function(){
            // arrange
            cardState.set("visible", true);
            
            // act
            cardState.updateState(reading);
            
            // assert
            expect(cardState.get("visible")).to.equal(false);
        });
        
        it('sets suitable to false', function(){
            // arrange
            cardState.set("suitable", true);
            
            // act
            cardState.updateState(reading);
            
            // assert
            expect(cardState.get("suitable")).to.equal(false);
        });
        
        it('sets visible to true when checkCardNonLocConditions returns true', function(){
            
            // arrange
            cardState.set('visible', false);
            reading.checkCardNonLocConditions = function(value) { return true;};
            
            // act
            cardState.updateState(reading);
            
            // assert
            expect(cardState.get("visible")).to.equal(true);
            
        });
        
        it('does not set visible to true when checkCardNonLocConditions returns false', function(){
            
            // arrange
            cardState.set('visible', false);
            reading.checkCardNonLocConditions = function(value) { return false;};
            
            // act
            cardState.updateState(reading);
            
            // assert
            expect(cardState.get("visible")).to.equal(false);
            
        });
        
        it('sets suitable to record.checkCardConditions when record.checkCardNonLocConditions returns true', function(){
            
            // arrange
            var knownConditions = {};
            cardState.set('suitable', false);
            reading.checkCardNonLocConditions = function(value) { return true;};
            reading.checkCardConditions = function(value) { return knownConditions; }; 
            
            // act
            cardState.updateState(reading);
            
            // assert
            expect(cardState.get("suitable")).to.equal(knownConditions);
            
        });
        
        it('does not set suitable to record.checkCardConditions when record.checkCardNonLocConditions returns false', function(){
            
            // arrange
            cardState.set('suitable', false);
            reading.checkCardNonLocConditions = function(value) { return true;};
            
            // act
            cardState.updateState(reading);
            
            // assert
            expect(cardState.get("suitable")).to.equal(false);
            
        });       
        
    });
    
    describe('isVisible', function(){
        it('returns visible value', function(){
            cardState.set('visible', true);
            expect(cardState.isVisible()).to.equal(true);
        });
    });
    
    describe('isSuitable', function(){
        it('returns suitable value', function(){
            cardState.set('suitable', true);
            expect(cardState.isSuitable()).to.equal(true);
        });
    });
    
    describe('hasChanged', function(){
        it('returns modified value', function(){
            cardState.set('modified', true);
            expect(cardState.hasChanged()).to.equal(true);
        });
    });
});