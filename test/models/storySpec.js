var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;

requirejs.config({
    baseUrl: 'script',
    nodeRequire: require,
    paths: {
        underscore: 'libs/underscore.min.amd',
        backbone: 'libs/backbone.min.amd'        
    }
});


describe('Story model', function () {
    'use strict';
    
    var Story;
    beforeEach(function (done) {
        requirejs(['models/story'], function (story) {
            Story = new story();
            done();
        });
    });

    
    describe('when no id is set', function(){
        it('should return the root url', function () {
            expect(Story.url()).to.equal('/storyplaces/story');
        });
    });
    
    describe('when id is set', function() {
        it('should return the root url and id', function(){
            Story.id = 123;
            expect(Story.url()).to.equal('/storyplaces/story/123');
        });
    });
    
    describe('when getCard is called', function(){
        it('should return card from deck with matching id', function(){
            
            // arrange
            var deck = [ { _id: 1}, { _id: 2}];                
            Story.set("deck", deck);
            
            // act
            var result = Story.getCard(1);
            
            // assert
            expect(result._id).to.equal(1);
        });
        
        it('shold return undefined when deck does not have card with matching id', function(){
            var deck = [ { _id: 1}, { _id: 2}];                
            Story.set("deck", deck);
            
            // act
            var result = Story.getCard(3);
            
            // assert
            expect(result).to.equal(undefined);
        });
        
        it('should return undefined when deck is empty', function() {
            // arrange
            Story.set("deck", []);
            
            // act
            var result = Story.getCard(1);
            
            // assert
            expect(result).to.equal(undefined);
        });
    });    

});
