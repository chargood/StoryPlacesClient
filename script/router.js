define([
	'jquery',
	'underscore',
	'backbone',
	'views/storyListView',
	'views/storyView',
	'readingView',
	'cardView',
	'views/debugView',
	'models/user',
	'utils/SPGPS',
	'StoryRepository',
	'ReadingRepository'
], function ($, _, Backbone, StoryListView, StoryView, ReadingView, CardView, DebugView, User, GPS, StoryRepository, ReadingRepository) {

	var Router = Backbone.Router.extend({
		routes: {
			'': 'home',
			'story/:storyId': 'viewStory',
			'reading/:readingId': 'playReading',
			//'deck/:id': 'playReadingDeck',
			'card/:readingId/:cardId': 'playReadingCard'
		}
	});


	var initialize = function () {

		var router = new Router();
		var debugView = DebugView.getDebug();
		var readingView = new ReadingView({el: document.getElementById('readingView')});
		var cardView = new CardView({el: document.getElementById('cardView')});
		var storyView = new StoryView({el: document.getElementById('storyView')});
		var storyListView = new StoryListView({el: document.getElementById('storyListView')});


		var that = this;

		// run once
		GPS.initiateLocator();
		//GPS.addGpsUpdateListener(readingView);

		// add handlers
		router.on('route:home', function () {
			console.log('Home Route');
			storyListView.render();
			debugView.render();
		});

		router.on('route:viewStory', function (storyId) {
			StoryRepository.getStory(storyId, function(story) {
				console.log('View Story Route');
				storyView.render(story);
			});

			debugView.render();
		});

		router.on('route:playReading', function (readingId) {
			ReadingRepository.getReading(readingId, function(reading) {
				console.log('Play Reading Route');
				readingView.render(reading);
			});

			debugView.render();
		});

		router.on('route:playReadingDeck', function (readingId) {
			//readingView = new ReadingView({id:id});
			console.log('Play Reading Deck Route');
			//readingView.renderDeck({ id: id });
			debugView.render();
		});

		router.on('route:playReadingCard', function (readingId, cardId) {
			ReadingRepository.getReading(readingId, function(reading) {
				cardView.render(reading, cardId);
			});

			//readingView = new ReadingView({id:id});
			console.log('Play Reading Card Route');
			//readingView.renderCard({ id: id, card: card });
			debugView.render();
		});

		if (localStorage.getItem("User-ID") == null) {
			var user = new User();
			user.save({}, {
				success: function (user) {
					localStorage.setItem("User-ID", user.id);
				}
			});
		}

		Backbone.history.start();
	};

	return {
		initialize: initialize
	};

});
