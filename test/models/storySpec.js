var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var Utils = require('../utils');

describe('Story model', function () {
    'use strict';

    var Story;
    var CardCollection;

    before(function (done) {
        requirejs(['Story', 'CardCollection'], function (StoryModel, CardCollectionModel) {
            Story = StoryModel;
            CardCollection = CardCollectionModel;
            done();
        });
    });

    describe('calling getCard', function () {
        it('should call get() once on the deck collection with the passed ID', function () {

            var story = new Story();
            var cardCollection = new CardCollection();

            // arrange
            story.set("deck", cardCollection);
            var spyOnGet = sinon.spy(cardCollection, 'get');

            // act
            story.getCard(2);

            //assert
            sinon.assert.calledWith(spyOnGet, 2);
            sinon.assert.calledOnce(spyOnGet);
        });
    });

    describe('when a story is fetched the parse function', function () {
        function parseAndTestStoryBasedOnDeck(deck) {
            var story = new Story()
            var sourceData = {_id: "1", id: "1"};

            if (deck) {
                sourceData.deck = deck;
            }

            var parsedData = story.parse(sourceData);
            var twiceParsedData = story.parse(parsedData);

            var expectedCardCollection = new CardCollection()

            if (deck) {
                if (expectedCardCollection.isArray) {
                    expectedCardCollection.each(function(card) {
                        expectedCardCollection.add(card);
                    })
                } else {
                    expectedCardCollection.add(deck);
                }
            }

            expect(Utils.collectionsAreEqualBasedOnIdsAndAttributes(twiceParsedData.deck, expectedCardCollection, 'content')).to.equal(true);
            expect(twiceParsedData.id).to.equal("1");
        }

        it("should change a valid deck into a CardCollection", function() {
            parseAndTestStoryBasedOnDeck([{"id": 1, "content": "card 1"}, {"id": 2, "content": "card 2"}]);
        });

        it("should change an empty deck into an empty CardCollection", function() {
            parseAndTestStoryBasedOnDeck([]);
        });

        it("should change a single card into a CardCollection with one item", function() {
            parseAndTestStoryBasedOnDeck({"id": 1, "content": "card 1"});
        });

        it("should create an empty CardCollection when no deck is passed", function() {
            parseAndTestStoryBasedOnDeck();

        });

    });

});


