define([
    'jquery',
    'underscore',
    'backbone',
    'mapComponents'
], function ($, _, Backbone, mapComponents) {

    var ReadingView = Backbone.View.extend({
        el: $('#page'),
        events: {
            "click": "event",
            //"gpsupdate": "gpsChange"
        },

        initialize: function (options) {
            //this.readingId = options.id;
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
                                mapComponents.render(this.$el, reading);
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
