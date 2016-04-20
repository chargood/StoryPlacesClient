define([
	'jquery',
	'underscore',
	'backbone',
	'views/storyListView',
	'views/storyView'
], function ($, _, Backbone, StoryListView, StoryView) {

	var Router = Backbone.Router.extend({

		routes: {
			'': 'home',
			'story/:id': 'viewStory',
			'reading/:id': 'playReading',
			'deck/:id': 'playReadingDeck',
			'card/:id/:card': 'playReadingCard'
		}
	});

	var initialize = function () {

		var router = new Router();

		// add handlers
		router.on('route:home', function () {
			console.log('Home Route');
			var storyListView = new StoryListView();
			storyListView.render();
		});

		router.on('route:viewStory', function (id) {
			console.log('View Story Route');
			var storyView = new StoryView();
			storyView.render({ id: id });
		});

		router.on('route:playReading', function (id) {
			console.log('Play Reading Route');
			var readingView = new ReadingView();
			readingView.render({ id: id });
		});

		router.on('route:playReadingDeck', function (id) {
			//readingView = new ReadingView({id:id});
			console.log('Play Reading Deck Route');
			var readingView = new ReadingView();
			readingView.renderDeck({ id: id });
		});

		router.on('route:playReadingCard', function (id, card) {
			//readingView = new ReadingView({id:id});
			console.log('Play Reading Card Route');
			var readingView = new ReadingView();
			readingView.renderCard({ id: id, card: card });
		});


		if (localStorage.getItem("User-ID") == null) {
			var user = new User();
			user.save({}, {
				success: function (user) {
					localStorage.setItem("User-ID", user.id);
				}
			})
		}

		Backbone.history.start();
	};

	return {
		initialize: initialize
	};

});