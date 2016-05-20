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

    describe('when getCard is called', function () {
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

    describe('when a story is fetched', function () {

        it("the parse function should change a deck into a CardCollection", function() {
            var story = new Story()
            var data = {_id: "1", id: "1", "deck": [{"id": 1, "content": "card 1"}, {"id": 2, "content": "card 2"}]};

            var parsedData = story.parse(data);

            var expectedCardCollection = new CardCollection([{"id": 1, "content": "card 1"}, {"id": 2, "content": "card 2"}])

            expect(Utils.diffCollectionsOnAttributes(parsedData.deck, expectedCardCollection, 'content')).to.equal(true);
            expect(parsedData.id).to.equal("1");


        });

    });

});


