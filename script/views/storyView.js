define([
    'jquery',
    'underscore',
    'backbone',
    'models/story',
    'models/storyReadingList',
    'models/reading'
], function ($,_, Backbone, Story, StoryReadingList, Reading) {

    var StoryView = Backbone.View.extend({
        el: $('#page'),
        events: {
            'click .newReadingBtn': 'newReading',
            'click .newCustomReadingBtn': 'newCustomReading',
        },
        initialize: function () {

        },
        render: function (options) {
            var that = this;

            if (options && options.id) {
                this.storyId = options.id
                var story = new Story({ id: options.id });
                story.fetch({
                    success: function (story) {
                        var readinglist = new StoryReadingList(that.storyId, localStorage.getItem("User-ID"));
                        readinglist.fetch({
                            success: function (readinglist) {
                                var template = _.template($('#storytemplate').html())
                                that.$el.html(template({
                                    story: story,
                                    readinglist: readinglist.models
                                }))
                            }
                        })
                    }
                })
            }
            else {
                that.$el.html("ID MISSING")
            }

        },
        newReading: function () {
            var that = this;
            console.log("New Reading")
            var readingDetails = { story: this.storyId, user: localStorage.getItem("User-ID") };

            //var readinglist = new ReadingList();
            var readinglist = new StoryReadingList(that.storyId, localStorage.getItem("User-ID"));

            readinglist.fetch({
                success: function (readinglist) {
                    console.log("got reading list")
                    /*var readingcount = 1
                    readinglist.each(function(reading){
                        if(reading.get("story")==that.storyId){
                            readingcount++
                        }
                    });*/
                    var readingcount = readinglist.length + 1
                    readingDetails.name = "Reading " + readingcount
                    var reading = new Reading();
                    reading.save(readingDetails, {
                        success: function (reading) {
                            console.log("reading saved")
                            Backbone.history.navigate('', { trigger: true });                            
                        },
                        error: function (model, response) {
                            console.log("reading error")
                            console.log(response);
                        }
                    });
                }
            })
        },
        newCustomReading: function () {
            console.log("New Custom Reading")
            var readingDialog = new ReadingDialog()
            readingDialog.render({ 'id': this.storyId });
        }
    });

    return StoryView;
});

