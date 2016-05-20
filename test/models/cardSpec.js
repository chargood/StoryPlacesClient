'use strict';

var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Card model', function () {
    
    var card;
    
    beforeEach(function (done) {
        requirejs(['Card'], function (Card) {
            card = new Card();
            done();
        });
    });
    
    describe('getLabel', function(){
        it('returns label value when label has a value', function(){
            var value = "corduroy";
            card.set('label', value);
            
            var result = card.getLabel();
            
            expect(result).to.equal(value);
        });
        
        it('returns empty string when label has no value', function(){
            var result = card.getLabel();            
            expect(result).to.equal("");
        });
    });
    
    describe('getTeaser', function(){
        it('returns teaser value when teaser has a value', function(){
            var value = "denim";
            card.set('teaser', value);
            
            var result = card.getTeaser();
            
            expect(result).to.equal(value);
        });
        
        it('returns empty string when teaser has no value', function(){
            var result = card.getTeaser();            
            expect(result).to.equal("");
        });
    });
    
    describe('getContent', function(){
        it('returns content value when content has a value', function(){
            var value = "denim";
            card.set('content', value);
            
            var result = card.getContent();
            
            expect(result).to.equal(value);
        });
        
        it('returns empty string when content has no value', function(){
            var result = card.getContent();            
            expect(result).to.equal("");
        });
    });
    
    describe('getHintDirection', function(){
        it('returns hint value when hint has a value', function(){
            var value = { direction : "plaid" };
            card.set('hint', value);
            
            var result = card.getHintDirection();
            
            expect(result).to.equal(value.direction);
        });
        
        it('returns empty string when hint has no value', function(){
            var result = card.getHintDirection();            
            expect(result).to.equal("");
        });
        
        it('returns empty string when hint direction has no value', function(){
            var value = {};
            card.set('hint', value);
            
            var result = card.getHintDirection();            
            expect(result).to.equal("");
        });
    });
    
});