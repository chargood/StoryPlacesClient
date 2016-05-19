/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'backbone',
    'underscore',
], function (Backbone, _) {
    var ListReadingView;

    ListReadingView = Backbone.View.extend({

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

            if (this.reading.storyObject) {
                this.$el.html(this.template({
                    visibleCards: that.reading.cardStates.visibleCards(),
                    deck: that.reading.storyObject.deck(),
                    readingId: that.reading.id,
                    storyName: that.reading.storyObject.name
                }));
            }
        },

        template: _.template(
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
        ),

    });

    return ListReadingView;
});
