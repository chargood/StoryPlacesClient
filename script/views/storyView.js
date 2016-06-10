define([
    'jquery',
    'underscore',
    'backbone',
    'Story',
    'StoryReadingCollectionRepository',
    'Reading',
    'errorView'
], function ($, _, Backbone, Story, StoryReadingCollectionRepository, Reading, ErrorView) {
    var StoryView;

    StoryView = Backbone.View.extend({
        events: {
            'click #newReadingBtn': 'newReading',
            'click #newCustomReadingBtn': 'newCustomReading',
            'click #refreshReadingsBtn': 'redraw'
        },

        story: undefined,

        initialize: function () {
            this.ErrorView = ErrorView;
        },

        redraw: function () {
            if (this.story) {
                this.render(this.story);
            }
        },

        render: function (story) {
            var that = this;

            this.story = story;


            StoryReadingCollectionRepository.getStoryReadingCollection(
                this.story.id,
                function (readingList) {
                    $('.view').hide();

                    that.$el.html(that.template({
                        story: that.story,
                        readingList: readingList
                    })).show();

                },

                function () {
                    console.error("Can not fetch readinglist");
                    ErrorView.render("Unable to load story, please check your internet connection and try again.");
                }
            );
        },

        template: _.template(
            "<h2><%= _.escape(story.get('name')) %></h2>"
                + "<div class='storyReadingList'>"
            + "<table class='table table-hover'>"
            + "<% readingList.each(function(reading) { %>"
            + "<tr>"
            + "<td><a href='#/reading/<%= _.escape(reading.id) %>'><%= _.escape(reading.get('name')) %></a></td>"
            + "<% }); %>"
            + "</table>"
            + "<% if(readingList.size()==0) { %>"
            + "<p>No readings, please create one</p>"
            + "<% } %>"
                +"</div>"
+"<div class='storyReadingButtons'>"
            + "<input id='newReadingBtn' type='button' class='btn btn-default' value='Start a new reading'/>"
            + "<input id='refreshReadingsBtn' type='button' class='btn btn-default' value='Refresh readings'/>"
    +"</div>"
        ),


        //TODO:  Move all the following to a reading collection

        newReading: function () {
            var that = this;

            StoryReadingCollectionRepository.getStoryReadingCollection(
                this.story.id,
                function (storyRC) {
                    storyRC.newReading(
                        function () {
                            that.redraw();
                        },
                        function () {
                            that.ErrorView.render("Unable to create reading, please check your internet connection and try again.");
                        }
                    );
                })
        },
        newCustomReading: function () {
            console.log("New Custom Reading");
            var readingDialog = new ReadingDialog();
            readingDialog.render({'id': this.storyId});
        }

    });

    return StoryView;
});
