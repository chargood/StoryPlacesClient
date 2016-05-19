var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;


describe('Story model', function () {
    'use strict';
    
    var story;
    var cardCollection;
    beforeEach(function (done) {
        requirejs(['Story', 'CardCollection'], function (Story, CardCollection) {
            story = new Story();
            cardCollection = new CardCollection();
            done();
        });
    });

    describe('when getCard is called', function(){
        it('should return card from deck with matching id', function(){
            
            // arrange
            var deck = [ { _id: 1}, { _id: 2}];                
            story.set("deck", deck);
            
            // act
            var result = story.getCard(1);
            
            // assert
            expect(result._id).to.equal(1);
        });
        
        it('should return undefined when deck does not have card with matching id', function(){
            var deck = [ { _id: 1}, { _id: 2}];                
            story.set("deck", deck);
            
            // act
            var result = story.getCard(3);
            
            // assert
            expect(result).to.equal(undefined);
        });
        
        it('should return undefined when deck is empty', function() {
            // arrange
            story.set("deck", []);
            
            // act
            var result = story.getCard(1);
            
            // assert
            expect(result).to.equal(undefined);
        });
    });    

});
