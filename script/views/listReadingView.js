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

"use strict";

define([
    'backbone',
    'underscore',
    'cardView'
], function (Backbone, _, CardView) {
    var ListReadingView;

    ListReadingView = Backbone.View.extend({
        
        events: {
            'click #card': 'clickcard',            
        },

        reading: undefined,

        newReading: function (reading) {
            this.reading = reading;
            this.reading.cardStates.on(this.reading.cardStates.eventCardStatesUpdated, this.renderList, this);
            this.renderList();
        },

        tearDown: function () {
            this.reading.cardStates.off(this.reading.cardStates.eventCardStatesUpdated, this.renderList, this);
        },

        renderList: function () {
            var that = this;
            
            if(this.reading.storyObject){
                this.$el.html(this.template({
                    visibleCards: that.reading.cardStates.visibleCards(),
                    deck: that.reading.storyObject.deck(),
                    readingId: that.reading.id,
                    storyName: that.reading.storyObject.name,
                    sim: document.simmode
                }));
            }
            
            if(document.simmode){
                this.el.style.float="right"
                this.el.style.width="33%"
                this.el.style.height="auto"
                
            
            }
            
        },
        
        clickcard: function(e){
            
            //console.log("test",e.target.attributes.cardid,e)
            
            
            var cardView = new CardView({el: document.getElementById('cardComponent')})
            cardView.render(this.reading,e.target.attributes.cardid.value);        
            
            
            cardView.el.style.float="right"
            cardView.el.style.width="33%"
            
        },

        template: _.template(
            "<ul class='list-group'>"
            + "<% _.each(visibleCards, function(cardState) { %>"
            + "<% var card = deck.get(cardState.id) %>"
            + "<% if (cardState.isSuitable()) { %>"
                + "<% if (sim) { %>"
                    + "<a class='list-group-item list-group-item-success' id='card' cardid='<%=_.escape(card.id) %>'><%= _.escape(card.getLabel()) %></a>"
                + "<% } else{ %>"
                    + "<a class='list-group-item list-group-item-success' href='#/card/<%= _.escape(readingId) %>/<%=_.escape(card.id) %>'><%= _.escape(card.getLabel()) %></a>"
                + "<% } %>"
            + "<% } else{ %>"
            + "<ul class='list-group-item list-group-item-danger'><%= _.escape(card.getLabel()) %> - <i><%= _.escape(card.getHintDirection()) %></i></ul>"
            + "<% } %>"
            + "<%});%>"
            + "</ul>"
        )
        
        /*template: _.template(
            "<ul class='list-group'>"
            + "<% _.each(visibleCards, function(cardState) { %>"
            + "<% var card = deck.get(cardState.id) %>"
            + "<% if (cardState.isSuitable()) { %>"
            + "<a class='list-group-item list-group-item-success' href='#/card/<%= _.escape(readingId) %>/<%=_.escape(card.id) %>'><%= _.escape(card.getLabel()) %></a>"
            + "<% } else{ %>"
            + "<ul class='list-group-item list-group-item-danger'><%= _.escape(card.getLabel()) %> - <i><%= _.escape(card.getHintDirection()) %></i></ul>"
            + "<% } %>"
            + "<%});%>"
            + "</ul>"
        )*/

    });

    return ListReadingView;
});
