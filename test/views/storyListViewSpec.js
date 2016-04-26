var requirejs = require('requirejs');
var chai = require('chai');
var expect = require('chai').expect;
var jsdom = require('node-jsdom');
var sinon = require('sinon');

// define require.js stuff
requirejs.config({
    baseUrl: 'script',
    nodeRequire: require,
    paths: {
        underscore: 'libs/underscore.min.amd',
    }
});

describe('Story List View', function () {
    'use strict';

    // create a dom
    jsdom.env({
        html: '',
        done: function (errors, window) {
            global.window = window;
        }
    });

    var _;
    var storyListView;
    var storyList;
    
    // setup
    beforeEach(function (done) {
        requirejs(['underscore', 'views/storyListView', 'models/storyList'], function (Underscore, StoryListView, StoryList) {

            // setup objects required by the tests
            _ = Underscore;
            storyListView = new StoryListView();
            storyList = new StoryList();
           
            done();
        });
    });

    afterEach(function () {
        // clean up after each test here
    });

    // tests
    it('should use the expected element selector', function () {
        expect(storyListView.$el.selector).to.equal('#page');
    });

    describe('when render is called', function () {
        
        // note: the sinon.test ensures that the spies etc are correctly cleaned up after the test.
        it('should call fetch on the storyList', sinon.test(function () {
            var storyListFetchSpy = sinon.spy(storyList, "fetch");
            storyListView.render(storyList);
            sinon.assert.calledOnce(storyListFetchSpy);
        }));

        it('should populate the selector element', sinon.test(function () {
            
            // arrange
            var stub = sinon.stub(storyList, "fetch");
            stub.yieldsTo('success', []);
            
            var underscoreTemplateMock = sinon.stub(_, "template");
            underscoreTemplateMock.returns(function(){});
            
            var elementHtmlSpy = sinon.spy(storyListView.$el, "html");
            
            // act
            storyListView.render(storyList);
            
            // assert
            sinon.assert.calledOnce(elementHtmlSpy);                     
        }));
    });

});