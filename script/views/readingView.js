define([
    'jquery',
    'underscore',
    'backbone',
    'leaflet'
], function ($, _, Backbone, L) {

    var ReadingView = Backbone.View.extend({
        el: $('#page'),
        events: {
            "click": "event",
            //"gpsupdate": "gpsChange"
        },

        initialize: function (options) {
            //this.readingId = options.id;
            this.mapObject = null;
            this.markers = [];
            this.currentReading = null;

            this.greenIcon = null;
            this.redIcon = null;
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

        findOrCreateMarkerForCard: function (card) {
            var currentCardsMarker = _.findWhere(this.markers, {id: card.id});

            // Create the current card's pin if it doesn't exist
            if (currentCardsMarker == undefined) {
                currentCardsMarker = {
                    id: card.id,
                    state: "unsuitable",
                    previousState: "unsuitable",
                    label: card.label,
                    marker: null
                }

                if (card.hint.direction) {
                    currentCardsMarker['direction'] = card.hint.direction;
                }

                if (card.hint.location && card.hint.location.length != 0) {
                    if (card.hint.location[0].type == "point") {
                        currentCardsMarker['lat'] = card.hint.location[0].lat;
                        currentCardsMarker['lon'] = card.hint.location[0].lon;
                    }
                }

                this.markers.push(currentCardsMarker);
            }

            return currentCardsMarker;
        },

        markerIconFromMarkerState: function (currentCardsMarker) {
            if (this.greenIcon == null) {
                this.greenIcon = L.icon({
                    iconUrl: '../images/green/marker-icon.png',
                    iconRetinaUrl: '../images/green/marker-icon-2x.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                });
            }

            if (this.redIcon == null) {
                this.redIcon = L.icon({
                    iconUrl: '../images/red/marker-icon.png',
                    iconRetinaUrl: '../images/red/marker-icon-2x.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                });
            }

            if (currentCardsMarker.state == "suitable") {
                return this.greenIcon;
            }

            if (currentCardsMarker.state == "suitable-nolocation") {
                return this.redIcon;
            }

            return undefined;
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

        renderMapView: function (story, reading) {
            var that = this;
            var template;

            var changedMarkers = [];
            var visableMarkers = [];

            if (that.currentReading != null && that.currentReading != that.readingId) {
                that.markers = [];
            }

            _.each(story.get("deck"), function (card) {
                var currentCardsMarker = that.findOrCreateMarkerForCard(card);

                currentCardsMarker.previousState = currentCardsMarker.state;
                currentCardsMarker.state = that.getMarkerStateFromCard(reading, card);
                console.log(currentCardsMarker);

                if (currentCardsMarker.previousState != currentCardsMarker.state) {
                    changedMarkers.push(currentCardsMarker);
                }

                if (currentCardsMarker.state != "unsuitable") {
                    visableMarkers.push(currentCardsMarker);
                }
            });

            template = _.template($('#deckMapTemplate').html());

            that.$el.html(template({
                story: story,
                reading: reading,
            }));

            if (that.mapObject == null) {
                console.log("**  Initialising Map");
                that.mapObject = L.map('mapDiv', {zoomControl: false}).setView([50.935360, -1.396226], 16);

                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?', {
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                }).addTo(that.mapObject);

                that.mapObject.locate({setView: true, maxZoom: 16, watch: true, maximumAge: 10000});


            } else {
                console.log("** Reattaching Map");
                that.$el.find("#mapDiv").replaceWith(that.mapObject.getContainer());
            }

            _.each(changedMarkers, function (currentMarker) {

                if (currentMarker.state == "unsuitable") {
                    if (currentMarker.marker) {
                        that.mapObject.removeLayer(currentMarker.marker);
                    }
                } else if (currentMarker.previousState == "unsuitable") {
                    var icon = that.markerIconFromMarkerState(currentMarker);
                    if (currentMarker.lat && currentMarker.lon && icon) {
                        currentMarker.marker = L.marker([currentMarker.lat, currentMarker.lon], {icon: icon});
                        currentMarker.marker.addTo(that.mapObject);
                    }
                } else {
                    var icon = that.markerIconFromMarkerState(currentMarker);
                    if (currentMarker.marker) {
                        currentMarker.marker.setIcon(icon);
                    }
                }
            });

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
