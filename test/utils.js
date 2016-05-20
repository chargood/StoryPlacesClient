"use strict";

exports.diffCollectionsOnAttributes = diffCollectionsOnAttributes;

function diffCollectionsOnAttributes(collectionA, collectionB, testAttribute) {
    if (collectionA.length != collectionB.length) {
        return false;
    }

    var tempCollectionA = collectionA.clone();
    var tempCollectionB = collectionB.clone();

    collectionA.each(function (item) {
        if (collectionB.findWhere({id: item.id})) {
            if (!testAttribute || tempCollectionA.get(item.id).get(testAttribute) == tempCollectionB.get(item.id).get(testAttribute)) {
                tempCollectionA.remove({id: item.id});
                tempCollectionB.remove({id: item.id});
            }
        }
    });

    return (tempCollectionA.length == 0 && tempCollectionB.length == 0)
};