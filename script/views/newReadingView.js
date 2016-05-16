define([
    'jquery',
    'underscore',
    'backbone',
    'mapReadingView',
    'Story'
], function ($, _, Backbone, MapReadingView, Story) {

    var ReadingView = Backbone.View.extend({
        el: $('#page'),
        events: {
            "click": "event",
            //"gpsupdate": "gpsChange"
        },


        renderDeck: function (reading) {
            var mapReadingView = new MapReadingView;
            mapReadingView.renderView(null, reading);
        },

        renderCard: function (reading) {
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
