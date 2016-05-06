define([
    'jquery',
    'underscore',
    'backbone',
    'iconFactory',
    'map',
], function ($, _, Backbone, iconFactory, map) {

    var ReadingView = Backbone.View.extend({
        el: $('#page'),
        events: {
            "click": "event",
            //"gpsupdate": "gpsChange"
        },

        initialize: function (options) {
            //this.readingId = options.id;
            this.deckCardCache = [];
            this.currentReading = null;
        },

        createReading: function(options) {
          // reading has circular dependencies so use factory here
          var readingType = require('models/reading');
          return new readingType(options);
        },

        createStory: function(options) {
            // story has circular dependencies so use factory here
            var storyType = require('models/story');
            return new storyType(options);
        },

        render: function (options) {
            this.renderDeck(options);
        },

        reRender: function () {
            if (this.renderMode == "deck") {
                this.renderDeck(this.renderOptions);
            } else if (this.renderMode == "card") {
                this.renderCard(this.renderOptions);
            }
        },

        makePin: function (card) {
            var newMarker = {
                id: card.id,
                state: "unsuitable",
                previousState: "unsuitable",
                label: card.label,
                marker: null,
                direction: ""
            }

            if (card.hint.direction) {
                newMarker['direction'] = card.hint.direction;
            }

            if (card.hint.location && card.hint.location.length != 0) {
                if (card.hint.location[0].type == "point") {
                    newMarker['lat'] = card.hint.location[0].lat;
                    newMarker['lon'] = card.hint.location[0].lon;
                }
            }

            if (newMarker.lat && newMarker.lon) {
                newMarker.marker = L.marker([newMarker.lat, newMarker.lon], {icon: iconFactory.redIcon});
            }

            return newMarker;
        },

        findOrCreateMarkerForCard: function (card) {
            var currentCardsMarker = _.findWhere(this.deckCardCache, {id: card.id});

            if (currentCardsMarker) {
                return currentCardsMarker;
            }

            var newMarker = this.makePin(card);
            this.deckCardCache.push(newMarker);

            return newMarker;
        },



        getMarkerStateFromCard: function (reading, card) {

            if (reading.checkCardConditions(card.id)) {
                return "suitable";
            }

            //TODO: Should this be filtered on hint/direction/teaser as well?
            if (reading.checkCardNonLocConditions(card.id)) {
                return "suitable-nolocation";
            }

            return "unsuitable";
        },



        renderMapTemplate: function (visibleMarkers, story, reading) {
            var template = _.template($('#deckMapTemplate').html());

            this.$el.html(template({
                visibleMarkers: visibleMarkers,
                readingId: reading.id,
                storyName: story.name
            }));
        },

        renderMapView: function (story, reading) {
            var that = this;

            var changedMarkers = [];
            var visibleMarkers = [];

            if (this.currentReading != null && this.currentReading != this.readingId) {
                this.deckCardCache = [];
            }

            _.each(story.get("deck"), function (card) {
                var currentCardsMarker = that.findOrCreateMarkerForCard(card);

                console.log("*******" + card.test);
                card.test="testing";

                currentCardsMarker.previousState = currentCardsMarker.state;
                currentCardsMarker.state = that.getMarkerStateFromCard(reading, card);
                console.log(currentCardsMarker);

                if (currentCardsMarker.previousState != currentCardsMarker.state) {
                    changedMarkers.push(currentCardsMarker);
                }

                if (currentCardsMarker.state != "unsuitable") {
                    visibleMarkers.push(currentCardsMarker);
                }
            });

            this.renderMapTemplate(visibleMarkers, story, reading);
            map.bindMapIntoDOM($('#mapDiv').get(0));

            for (var i = 0; i < changedMarkers.length; i++ ) {
                this.updateMarker(changedMarkers[i]);
            }
        },

        updateMarker: function (currentMarker) {
            if (currentMarker.marker) {
                if (currentMarker.state == "unsuitable") {
                    map.removeMarkerFromMap(currentMarker.marker);
                    return;
                }

                var icon = iconFactory.getIconFromMarkerState(currentMarker);
                map.updateMarkerIcon(currentMarker.marker, icon);

                if (currentMarker.previousState == "unsuitable") {
                    map.addMarkerToMap(currentMarker.marker);
                }
            }
        },

        renderDeck: function (options) {
            var that = this;
            this.readingId = options.id;
            this.renderOptions = options;
            this.renderMode = "deck";

            var reading = that.createReading({ id: options.id });
            reading.fetch({
                success: function (reading) {

                    that.readingObj = reading;

                    /*var template = _.template($('#decktemplate').html())
                    that.$el.html(template({
                        reading:reading
                    }))*/
                    var storyId = reading.get("story");
                    var story = that.createStory({ id: storyId });
                    story.fetch({
                        success: function (story) {
                            var deckViewMode = story.get("deckviewmode");
                            var template;

                            if (deckViewMode == "map") {
                                that.renderMapView(story, reading);
                                return;
                            }

                            switch (deckViewMode) {
                                case "2":
                                    template = _.template($('#decktemplate2').html());
                                    break;
                                case "3":
                                    template = _.template($('#decktemplate3').html());
                                    break;
                                default:
                                    template = _.template($('#decktemplate1').html());
                                    break;
                            }

                            that.$el.html(template({
                                story: story,
                                reading: reading
                            }));

                            //nasty hack to update deck view based on GPS - do this better
                            //setTimeout(function(){
                            //	window.location.reload(1);
                            //}, 5000);
                        }
                    });
                }
            });
        },

        renderCard: function (options) {
            var that = this;
            this.readingId = options.id;
            this.renderOptions = options;
            this.renderMode = "card";

            var reading = that.createReading({ id: options.id });
            reading.fetch({
                success: function (reading) {
                    that.readingObj = reading;

                    var storyId = reading.get("story");
                    var story = that.createStory({ id: storyId });
                    story.fetch({
                        success: function (story) {
                            var card = story.getCard(options.card);
                            var template = _.template($('#cardtemplate').html())
                            that.$el.html(template({
                                story: story,
                                reading: reading,
                                card: card
                            }));
                        }
                    });
                }
            });
        },
        event: function (e) {
            e.stopPropagation();
            if (e.target.attributes.eventCheck && e.target.attributes.eventCheck.value == "true") {
                console.log("event " + e.toString() + " " + e.target.attributes.eventCheck.value + " " + e.target.attributes.eventType.value); //+" "+e.target.attributes.eventData.value)
                if (e.target.attributes.eventType.value == "endcard") {
                    e.target.attributes.eventType.value = "repeat";
                    this.readingObj.executeCardFunctions(e.target.attributes.eventCardId.value);
                    //localStorage.setItem("GPSLat", "!");
                    Backbone.history.navigate('/reading/' + this.readingId, { trigger: true });
                }
                else if (e.target.attributes.eventType.value == "endstory") {
                    Backbone.history.navigate('', { trigger: true });
                }
                else if (e.target.attributes.eventType.value == "repeat") {
                    //the repeat event is a horrible work around for the backbone stacking events problem. Without it every view created, destroyed or not, will pick up the events. Hopefully so long as we only create 1 reading object this won't return.
                }
                else {
                    console.log("Unrecognised Event " + e.target.attributes.eventType.value);
                }
            }
            return true;
        },
        storageChange: function (e) {
            console.log("STORAGE CHANGE");
        }
    });

    return ReadingView;

});
