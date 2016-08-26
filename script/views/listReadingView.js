/**
 * Created by kep1u13 on 05/05/2016.
 */

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
				this.el.style.width="30%"

				
				//////
				/*var cardView = new CardView({el: document.getElementById('cardComponent')})
				cardView.render(this.reading);		
				cardView.el.style.float="right"
				cardView.el.style.width="30%"*/
				
			}
			
        },
		
		clickcard: function(e){
			
			//console.log("test",e.target.attributes.cardid,e)
			
			
			var cardView = new CardView({el: document.getElementById('cardComponent')})
			cardView.render(this.reading,e.target.attributes.cardid.value);		
			
			
			//cardView.el.style.float="right"
			//cardView.el.style.width="30%"
			
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
