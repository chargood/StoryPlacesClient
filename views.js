var StoryListView = Backbone.View.extend({
	el: $('#page'),
	initialize: function(){
		this.render();
    },
	render: function(){
		var that = this;
		var storyList = new StoryList();
		storyList.fetch({
			success: function(storyList){
				var template = _.template($('#storylisttemplate').html(), {storyList:storyList.models})
				that.$el.html(template)
			}
		})
	}
});