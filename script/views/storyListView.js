define([
    'jquery',
    'underscore',
    'backbone',
    'StoryCollection'
    ], function($, _, Backbone, StoryCollection) {

    var StoryListView = Backbone.View.extend({
        el: $('#page'),

        events: {},

        initialize: function(){
            //console.log("Create new story list view");
        },

        render: function(storyList){
            var that = this;
            
            // storyList is now injected to enable testing, so hasn't been injected then create it.
            if (storyList === undefined) {
                storyList = new StoryCollection();
            }
            
            storyList.fetch({
                success: function(storyList){
                    var template = _.template($('#storylisttemplate').html());
                    that.$el.html(template({
                        storyList:storyList
                    }));
                }
            });
        }
    });
    
    return StoryListView;

});
