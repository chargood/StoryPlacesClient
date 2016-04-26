var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;

requirejs.config({
    baseUrl: 'script',
    nodeRequire: require,
    paths: {
        underscore: 'libs/underscore.min.amd',
        backbone: 'libs/backbone.min.amd',
        debug: 'utils/debug',
        SPGPS: 'utils/SPGPS',
        scripts: 'utils/scripts',
        geolocator: 'libs/geolocator.amd'
    }
});


describe('Story', function () {

    var Story;
    before(function (done) {
        requirejs(['models/story'], function (story) {
            Story = new story();
            done();
        });
    });

    it('should have the expected path', function () {
        expect(Story.urlRoot).to.equal('/storyplaces/story');
    });

});
