define([
    'jquery',
    'underscore',
    'backbone',
    'StoryCollection',
    'errorView'
], function ($, _, Backbone, StoryCollection, ErrorView) {

    var StoryListView = Backbone.View.extend({
        events: {},

        initialize: function () {
            this.errorView = new ErrorView({el: document.getElementById('errorView')});
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
                },
                error: function() {
                    that.errorView.render("Unable to load story list, please check your internet connection and try again.");
                }
            });
        },

		//console.log('story publish state')
		
        template: _.template(
            "<table class='table table-hover'>"
            + "<tbody>"
            + "<% storyList.each(function(story) { %>"
			+ "<% if(story.get('publishState')!='unpublished'){ %>"
            + "<tr><td><a href='#/story/<%= story.id %>'><%=story.get('name') %></a></td></tr>"
            + "<%}%>"
			+ "<%});%>"
            + "</tbody>"
            + "</table>"
        ),
    });

    return StoryListView;

});
