define([
    'jquery',
    'underscore',
    'backbone',
    'StoryCollection'
], function ($, _, Backbone, StoryCollection) {

    var StoryListView = Backbone.View.extend({
        events: {},

        initialize: function () {
            //console.log("Create new story list view");
        },

        render: function (storyList) {
            var that = this;

            // storyList is now injected to enable testing, so hasn't been injected then create it.
            if (storyList === undefined) {
                storyList = new StoryCollection();
            }

            storyList.fetch({
                success: function (storyList) {
                    $('.view').hide();
                    that.$el.closest('.view').show();

                    that.$el.html(that.template({
                        storyList: storyList
                    }));

                    console.log("story list view rendered");
                }
            });
        },

        template: _.template(
            "<table class='table table-hover'>"
            + "<tbody>"
            + "<% storyList.each(function(story) { %>"
            + "<tr><td><a href='#/story/<%= story.id %>'><%=story.get('name') %></a></td></tr>"
            + "<%});%>"
            + "</tbody>"
            + "</table>"
        ),
    });

    return StoryListView;

});
