define([
    'jquery',
    'bootstrap',
    'underscore',
    'backbone'
], function ($, Bootstrap, _, Backbone) {
    var ErrorView;

    ErrorView = Backbone.View.extend({

        render: function (message, header) {

            if (!header) {
                header = "An error has occurred";
            }

            this.$el.find("[role='header']").first().html(this.headerTemplate({
                header: header
            }));

            this.$el.find("[role='body']").first().html(this.messageTemplate({
                message: message
            }));

            this.$el.find("[role='dialog']").first().modal('show');
        },

        messageTemplate: _.template(
            "<p><%= _.escape(message) %></p>"
        ),

        headerTemplate: _.template(
            "<h4 class='modal-title'><%= _.escape(header) %></h4>"
        )
    });


    return ErrorView;

});
