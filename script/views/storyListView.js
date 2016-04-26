define([
    'jquery',
    'underscore',
    'backbone',
    'models/storyList',
    'text!templates/storyListTemplate.html'
    ], function($, _, Backbone, StoryList, StoryListTemplate) {

    var StoryListView = Backbone.View.extend({
        el: $('#page'),

        events: {},

        initialize: function(){
            console.log("Create new story list view");
        },

        render: function(){
            var that = this;
            var storylist = new StoryList();
            storylist.fetch({
                success: function(storylist){
                    var template = _.template(StoryListTemplate);
                    that.$el.html(template({
                        storylist:storylist.models
                    }));
                }
            });
        }

    });
    
    return StoryListView;

});
