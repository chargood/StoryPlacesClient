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

        render: function (reading) {
            this.$el.html(this.template({
                visibleCards: reading.storyObj.deck().visibleCards(),
                readingId: reading.id,
                storyName: reading.storyObj.name
            }));
        },

        template: _.template(
            "<ul class='list-group'>"
            + "<% _.each(visibleCards, function(card) { %>"
            + "<% if (card.isSuitable()) { %>"
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
