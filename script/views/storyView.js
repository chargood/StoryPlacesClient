define([
    'jquery',
    'underscore',
    'backbone',
    'Story',
    'models/storyReadingList',
    'Reading'
], function ($,_, Backbone, Story, StoryReadingList, Reading) {
    var StoryView;

    StoryView = Backbone.View.extend({
        events: {
            'click .newReadingBtn': 'newReading',
            'click .newCustomReadingBtn': 'newCustomReading',
        },

        storyId: undefined,

        initialize: function () {

        },

        render: function (story) {
            var that = this;

            this.storyId = story.id;

            var readingList = new StoryReadingList(story.id, localStorage.getItem("User-ID"));
            readingList.fetch({
                success: function (readingList) {
                    var template = _.template($('#storytemplate').html());

                    $('.view').hide();

                    that.$el.html(template({
                        story: story,
                        readingList: readingList
                    })).show();;
                },

                failure: function() {
                    console.error("Can not fetch readinglist");
                }
            });
        },

        //TODO:  Move all the following to a reading collection

        newReading: function () {
            var that = this;
            console.log("New Reading");
            var readingDetails = {story: this.storyId, user: localStorage.getItem("User-ID")};

            //var readinglist = new ReadingList();
            var readinglist = new StoryReadingList(that.storyId, localStorage.getItem("User-ID"));

            readinglist.fetch({
                success: function (readinglist) {
                    console.log("got reading list");
                    /*var readingcount = 1
                     readinglist.each(function(reading){
                     if(reading.get("story")==that.storyId){
                     readingcount++
                     }
                     });*/
                    var readingcount = readinglist.length + 1;
                    readingDetails.name = "Reading " + readingcount;
                    var reading = new Reading();
                    reading.save(readingDetails, {
                        success: function (reading) {
                            console.log("reading saved");
                            Backbone.history.navigate('', {trigger: true});
                        },
                        error: function (model, response) {
                            console.log("reading error");
                            console.log(response);
                        }
                    });
                }
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
