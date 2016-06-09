define([
    'jquery',
    'underscore',
    'backbone',
    'Story',
    'StoryReadingCollectionRepository',
    'Reading'
], function ($, _, Backbone, Story, StoryReadingCollectionRepository, Reading) {
    var StoryView;

    StoryView = Backbone.View.extend({
        events: {
            'click #newReadingBtn': 'newReading',
            'click #newCustomReadingBtn': 'newCustomReading',
            'click #refreshReadingsBtn': 'redraw'
        },

        story: undefined,

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
                }
            );
        },

        template: _.template(
            "<h2><%= _.escape(story.get('name')) %></h2>"
            + "<input id='newReadingBtn' type='button' class='btn btn-default' value='Start a new reading'/>"
            + "<input id='refreshReadingsBtn' type='button' class='btn btn-default' value='Refresh readings'/>"
            + "<h3>Readings</h3>"
            + "<table class='table table-hover'>"
            + "<% readingList.each(function(reading) { %>"
            + "<tr>"
            + "<td><%= _.escape(reading.get('name')) %></td>"
            + "<td><a href='#/reading/<%= _.escape(reading.id) %>'><input class='openReadingBtn' type='button' class='btn btn-default' value='Open'/></a></td>"
            + "<% }); %>"
            + "</table>"
            + "<% if(readingList.size()==0) { %>"
            + "<p>no readings</p>"
            + "<% } %>"
        ),


        //TODO:  Move all the following to a reading collection

        newReading: function () {
            var that = this;

            StoryReadingCollectionRepository.getStoryReadingCollection(
                this.story.id,
                function(storyRC) {
                    storyRC.newReading(
                        function() {
                            that.redraw()
                        },
                        function() {
                            // Failure function
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
