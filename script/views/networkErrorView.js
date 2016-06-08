define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var NetworkErrorView = Backbone.View.extend({

        render: function (subtype) {
            var message;

            switch (subtype) {
                case "story":
                    message = "Unable to load story";
                    break;
                case "reading":
                    message = "Unable to load reading";
                    break;
                case "card":
                    message = "Unable to load card";
                    break;
                default:
                    message = "There has been a network error";
                    break;
            }


            $('.view').hide();
            this.$el.show();

            this.$el.html(this.template({
                message: message
            }));

            console.log("story list view rendered");
        },

        template: _.template(
            "<h2><%= _.escape(message) %></h2>"
            + "Please ensure you have a connection and press the back button to try again"
        )
    });


    return NetworkErrorView;

});
