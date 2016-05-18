define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    var CardView;

    CardView = Backbone.View.extend({

        events: {
            "click": "event",
        },

        reading: undefined,

        render: function (reading, cardId) {
            this.reading = reading;

            var story = reading.getStory();
            var card = story.getCard(cardId);

            $('.view').hide();

            this.$el.html(this.template({
                story: story,
                reading: reading,
                card: card
            }));

            this.$el.show();
        },

        template: _.template(
            '<h3><%=story.get("title")%></h3><div><%=card.get("content") %> </div><%if(!card.get("footerButtonMode")||card.get("footerButtonMode")=="next"){%>'
            + '<input class="nextCard" type="button" class="btn btn-default" value="Next" eventCheck="true" eventType="endcard" eventCardId="<%=card.id%>"/>'
            + '<%}%>'
            + '<%if(card.get("footerButtonMode")=="end"){%>'
            + '<input class="nextCard" type="button" class="btn btn-default" value="Finish Story" eventCheck="true" eventType="endstory"/>'
            + '<%}%>'
            + '<%if(card.get("footerButtonMode")=="none"){%>'
            + '<%}%>'
        ),

        event: function (e) {
            e.stopPropagation();
            if (e.target.attributes.eventCheck && e.target.attributes.eventCheck.value == "true") {
                console.log("event " + e.toString() + " " + e.target.attributes.eventCheck.value + " " + e.target.attributes.eventType.value); //+" "+e.target.attributes.eventData.value)
                if (e.target.attributes.eventType.value == "endcard") {
                    e.target.attributes.eventType.value = "repeat";
                    this.reading.executeCardFunctions(e.target.attributes.eventCardId.value);
                    //localStorage.setItem("GPSLat", "!");
                    Backbone.history.navigate('/reading/' + this.reading.id, {trigger: true});
                }
                else if (e.target.attributes.eventType.value == "endstory") {
                    Backbone.history.navigate('', {trigger: true});
                }
                else if (e.target.attributes.eventType.value == "repeat") {
                    //the repeat event is a horrible work around for the backbone stacking events problem. Without it every view created, destroyed or not, will pick up the events. Hopefully so long as we only create 1 reading object this won't return.
                }
                else {
                    console.log("Unrecognised Event " + e.target.attributes.eventType.value);
                }
            }
            return true;
        }
    });

    return CardView;

});
