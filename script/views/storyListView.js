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
                    that.$el.show();

                    that.$el.html(that.template({
                        storyList: storyList
                    }));

                    console.log("story list view rendered");
                }
            });
        },

        template: _.template(
            "<img src='images/logo/StoryPlaces_full_800x330.png' width='100%'><h2 class='text-center'><small>Please select from a story below</small></h2>"
            + "<table class='table table-hover'>"
            + "<tbody>"
            + "<% storyList.each(function(story) { %>"
            + "<tr><td><a href='#/story/<%= story.id %>'><%=story.get('name') %></a></td></tr>"
            + "<%});%>"
            + "</tbody>"
            + "</table>"
            + "<button type='button' class='btn btn-default'><span class='glyphicon glyphicon-refresh'></span> Update Story List</button>"
        ),
    });

    return StoryListView;

});
