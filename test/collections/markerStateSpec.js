var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var Utils = require('../utils');

requirejs(['underscore', 'Marker', 'MarkerCollection'], function (_, Marker, MarkerCollection) {
    describe('markerCollection', function () {
        'use strict';

        describe('calling destroy', function () {
            it('will call destroy on every marker', function () {

                var markerCollection = new MarkerCollection();

                var numberOfMarkers = 3;
                var stubs = [];

                for (var i = 1; i <= numberOfMarkers; i++) {
                    var marker = new Marker;
                    var stub = sinon.stub(marker, 'destroy', function () {return false});

                    stubs.push(stub);
                    markerCollection.add(marker);
                }

                // act
                markerCollection.destroy();

                //assert

                _.each(stubs, function (stub) {
                    sinon.assert.calledWithExactly(stub);
                    sinon.assert.calledOnce(stub);
                })

            });
        });
    });
});


