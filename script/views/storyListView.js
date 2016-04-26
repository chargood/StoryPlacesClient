define([
    'jquery',
    'underscore',
    'backbone',
    'models/storyList'
    ], function($, _, Backbone, StoryList) {

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
                storyList = new StoryList();    
            }
            
            storyList.fetch({
                success: function(storylist){
                    var template = _.template($('#storylisttemplate').html());
                    that.$el.html(template({
                        storylist:storylist.models
                    }));
                }
            });
        }        

    });
    
    return StoryListView;

});
