define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var ErrorView = Backbone.View.extend({

        render: function (subtype) {


            $('.view').hide();
            this.$el.show();

            this.$el.html(this.template({
                title: "Story Places requires GPS to work",
                message: "Please enable and return to the home page"
            }));

            console.log("story list view rendered");
        },

        template: _.template(
            "<h2><%= _.escape(title) %></h2>"
            + "<p><%= _.escape(message) %></p>"
        )
    });


    return ErrorView;

});
