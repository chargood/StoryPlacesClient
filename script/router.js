/* *****************************************************************************
 *
 * StoryPlaces
 *

This application was developed as part of the Leverhulme Trust funded 
StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk

Copyright (c) 2016
  University of Southampton
    Charlie Hargood, cah07r.ecs.soton.ac.uk
    Kevin Puplett, k.e.puplett.soton.ac.uk
	David Pepper, d.pepper.soton.ac.uk

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The name of the Universities of Southampton nor the name of its 
	  contributors may be used to endorse or promote products derived from 
	  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

***************************************************************************** */

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
                    readingView.render(reading,document.simmode);
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
