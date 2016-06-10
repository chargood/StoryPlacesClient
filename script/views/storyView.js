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
            this.errorView = new ErrorView({el: document.getElementById('errorView')});
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

                    that.$el.find("[role='title']").html(that.headingTemplate({
                        story: that.story
                    }));

                    that.$el.find("[role='list']").html(that.template({
                        story: that.story,
                        readingList: readingList
                    }));

                    that.$el.show();

                },

                function () {
                    console.error("Can not fetch readinglist");
                    window.history.back();
                    that.errorView.render("Unable to load story, please check your internet connection and try again.");
                }
            );
        },

        headingTemplate: _.template("<%= _.escape(story.get('name')) %>"),

        template: _.template(
            + "<table class='table table-hover'>"
            + "<% readingList.each(function(reading) { %>"
            + "<tr>"
            + "<td><a href='#/reading/<%= _.escape(reading.id) %>'><%= _.escape(reading.get('name')) %></a></td>"
            + "<% }); %>"
            + "</table>"
            + "<% if(readingList.size()==0) { %>"
            + "<p>No readings, please create one</p>"
            + "<% } %>"
        ),


        //TODO:  Move all the following to a reading collection

        newReading: function () {            
            if (!navigator.onLine) {
                this.errorView.render("Cannot create new reading whilst offline, please check your internet connection and try again.");
                return;
            }
            
            var that = this;
            StoryReadingCollectionRepository.getStoryReadingCollection(
                this.story.id,
                function (storyRC) {
                    storyRC.newReading(
                        function () {
                            that.redraw();
                        },
                        function () {
                            that.errorView.render("Unable to create reading, please check your internet connection and try again.");
                        }
                    );
                });
        },
        newCustomReading: function () {
            console.log("New Custom Reading");
            var readingDialog = new ReadingDialog();
            readingDialog.render({'id': this.storyId});
        }

    });

    return StoryView;
});
