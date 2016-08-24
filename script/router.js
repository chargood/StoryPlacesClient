define([
    'jquery',
    'underscore',
    'backbone',
    'storyListView',
    'storyView',
    'readingView',
    'cardView',
    'errorView',
    'debugView',
    'User',
    'StoryRepository',
	'ReadingRepository',
	'LogEventCollectionRepository'
], function ($, _, Backbone, StoryListView, StoryView, ReadingView, CardView, ErrorView, DebugView, User, StoryRepository, ReadingRepository,LogEventCollectionRepository) {

    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
			'storylist/:tag': 'taglist',
            'story/:storyId': 'viewStory',
            'reading/:readingId': 'playReading',
            'card/:readingId/:cardId': 'playReadingCard',
            'error/(:type)': 'error',
            'error/(:type)/(:subtype)': 'error'
        }
    });


    var initialize = function () {
        var router = new Router();
        var debugView = DebugView.getDebug();
        var readingView = new ReadingView({el: document.getElementById('readingView')});
        var cardView = new CardView({el: document.getElementById('cardView')});
        var storyView = new StoryView({el: document.getElementById('storyView')});
        var storyListView = new StoryListView({el: document.getElementById('storyListView')});
        var errorView = new ErrorView({el: document.getElementById('errorView')});

        // add handlers
        router.on('route:home', function () {
            console.log('Home Route');
			
			logEvent("viewstorylist",{})
			
            storyListView.render();
            debugView.render();
        });
		
		router.on('route:taglist', function (tag) {
            console.log('Tag List Route');
			
			logEvent("viewstorylist",{tag:tag})
			
            storyListView.render(undefined,tag);
            debugView.render();
        });

        router.on('route:viewStory', function (storyId) {
            StoryRepository.getStory(storyId,
                function (story) {
                    console.log('View Story Route');
                    storyView.render(story);
                },
                function () {
                    window.history.back();
                    errorView.render("Unable to load story, please check your internet connection and try again.");
                }
            );

			logEvent("viewstory",{storyId:storyId})
			
            debugView.render();			
        });

        router.on('route:playReading', function (readingId) {
            ReadingRepository.getReading(readingId,
                function (reading) {
                    console.log('Play Reading Route');
                    readingView.render(reading);
                },
                function () {
                    window.history.back();
                    errorView.render("Unable to load reading, please check your internet connection and try again.");
                }
            );
			
			logEvent("playreading",{readingId:readingId})

            debugView.render();
        });

        router.on('route:playReadingDeck', function (readingId) {
            //readingView = new ReadingView({id:id});
            console.log('Play Reading Deck Route');
            //readingView.renderDeck({ id: id });
			logEvent("playreadingdeck",{readingId:readingId})
            debugView.render();
        });

        router.on('route:playReadingCard', function (readingId, cardId) {
            ReadingRepository.getReading(readingId,
                function (reading) {
					
					var story = reading.getStory();
					var card = story.getCard(cardId);					
					logEvent("playreadingcard",{readingId:readingId,storyId:story.id,cardId:cardId,cardLabel:card.getLabel()})
					
                    cardView.render(reading, cardId);
                },
                function () {
                    window.history.back();
                    errorView.render("Unable to load card, please check your internet connection and try again.");
                }
            );

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
                },
                error: function () {
                    errorView.render("Unable to create user, please check your internet connection and try again.");
                }
            });
        }

        Backbone.history.start();

        return router;
    };
	
	var logEvent = function (type, data) {
	
		LogEventCollectionRepository.getLogEventCollection(
			function (logEventC) {
				logEventC.newLogEvent(
					function () {
						console.log("Event Logged.");
					},
					function () {
						console.log("LogEventError.");
					},
					type,
					data
				);
			}
		);
	
	}

    return {
        initialize: initialize
    };

});
