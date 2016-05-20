var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');

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

            expect(diffCollectionsOnAttributes(parsedData.deck, expectedCardCollection, 'content')).to.equal(true);
            expect(parsedData.id).to.equal("1");


        });

    });

});

function diffCollectionsOnAttributes(collectionA, collectionB, testAttribute) {
    if (collectionA.length != collectionB.length) {
        return false;
    }

    var tempCollectionA = collectionA.clone();
    var tempCollectionB = collectionB.clone();

    collectionA.each(function(item) {
        if (collectionB.findWhere({id: item.id})) {
            if (!testAttribute || tempCollectionA.get(item.id).get(testAttribute) == tempCollectionB.get(item.id).get(testAttribute)) {
                tempCollectionA.remove({id: item.id});
                tempCollectionB.remove({id: item.id});
            }
        }
    });

    return (tempCollectionA.length == 0 && tempCollectionB.length == 0)
}
