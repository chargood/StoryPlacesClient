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
            "<h2>Story List</h2>"
            + "<table class='table table-hover'>"
            + "<thead>"
            + "<tr>"
            + "<th>Story</th>"
            + "<th></th>"
            + "</tr>"
            + "</thead>"
            + "<tbody>"
            + "<% storyList.each(function(story) { %>"
            + "<tr>"
            + "<td><%=story.get('name') %></td>"
            + "<td><a href='#/story/<%= story.id %>'> load </a></td>"
            + "</tr>"
            + "<%});%>"
            + "</tbody>"
            + "</table>"
            + "<input class='updateList' type='button' class='btn btn-default' value='Update Story List'/>"
        ),
    });

    return StoryListView;

});
