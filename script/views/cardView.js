define([
    'jquery',
    'underscore',
    'backbone',
    'MediaCacheRepository'
], function ($, _, Backbone, MediaCacheRepository) {

    var CardView;

    CardView = Backbone.View.extend({

        events: {
            "click": "event",
        },

        reading: undefined,
        cardId: undefined,

        render: function (reading, cardId) {
            this.reading = reading;
            this.cardId = cardId;

            var that = this;

            $('.view').hide();
            this.$el.show();

            if (this.reading.getStory()) {
                this.renderCard();
            }

            this.reading.on(this.reading.eventStoryLoaded, function() {
                that.renderCard();
            });
        },
        
        replaceImageTags: function(templateText, storyId) {
            // find any image tags
            var wrappedTemplateText = $(templateText);
            var imageElements = wrappedTemplateText.find('img');
            _.each(imageElements, function(imageElement){
                // get the media id
                var mediaId = $(imageElement).data("media-id");
                var mediaData = MediaCacheRepository.getItem(storyId, mediaId);
                var source;
                
                if (mediaData != undefined) {
                    // media is available in cache - build source based on cache content
                    var mediaObject = JSON.parse(mediaData);
                    source = "data:" + mediaObject.contentType + ";base64," + mediaObject.content;
                } else {
                    // media is not available in cache - build source to download image
                    source = "/storyplaces/story/" + storyId + "/media/" + mediaId;
                }
                
                $(imageElement).attr("src", source);
            });
            
            return wrappedTemplateText;
        },

        renderCard: function() {
            var story = this.reading.getStory();
            var card = story.getCard(this.cardId);

            var compiledTemplate = this.template({
                story: story,
                reading: this.reading,
                card: card
            });
            
            compiledTemplate = this.replaceImageTags(compiledTemplate, story.id);

            this.$el.html(compiledTemplate).find();
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
