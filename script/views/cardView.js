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
    'MediaCacheRepository',
    'Card'
], function ($, _, Backbone, MediaCacheRepository, Card) {

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

            if(!document.simmode){
                $('.view').hide();
            }
            
            this.$el.show();

            if (this.reading.getStory()) {
                this.renderCard();
            }

            this.reading.on(this.reading.eventStoryLoaded, function () {
                that.renderCard();
            });
        },

        buildMediaSource: function (storyId, mediaId) {
            return "/storyplaces/story/" + storyId + "/media/" + mediaId;
        },

        replaceImageTags: function (templateText, storyId) {
            // find any image tags
            var wrappedTemplateText = $(templateText);
            var imageElements = wrappedTemplateText.find('img[data-media-id]');
            var that = this;
            _.each(imageElements, function (imageElement) {
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
                    source = that.buildMediaSource(storyId, mediaId);
                }

                $(imageElement).attr("src", source);
            });

            return wrappedTemplateText;
        },

        replaceAudioTags: function (templateText, storyId) {
            var wrappedTemplateText = $(templateText);
            var audioElements = wrappedTemplateText.find('audio[data-media-id]');
            var that = this;

            _.each(audioElements, function (audioElement) {
                // get the media id and build the source path
                var wrappedAudioElement = $(audioElement);
                var mediaId = wrappedAudioElement.data("media-id");
                var source = that.buildMediaSource(storyId, mediaId);

                wrappedAudioElement.attr("controls", "");
                var sourceElement = $('<source>').attr("src", source).attr("type", "audio/mpeg");
                wrappedAudioElement.append(sourceElement);
            });

            return wrappedTemplateText;
        },

        renderCard: function () {
            var story = this.reading.getStory();
            var card = new Card();
            if(this.cardId){
                card = story.getCard(this.cardId);
            }
            
            console.log("!!!",card,this.cardId)            

            var compiledTemplate = this.template({
                story: story,
                reading: this.reading,
                card: card
            });
            
            compiledTemplate = this.replaceImageTags(compiledTemplate, story.id);
            compiledTemplate = this.replaceAudioTags(compiledTemplate, story.id);
        

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
                    if(document.simmode){
                        this.$el.hide();                    
                    }
                    else{
                        Backbone.history.navigate('/reading/' + this.reading.id, { trigger: true });
                    }
                    
                    
                }
                else if (e.target.attributes.eventType.value == "endstory") {
                    if(document.simmode){
                        this.$el.hide();                    
                    }
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
        }
    });

    return CardView;

});
