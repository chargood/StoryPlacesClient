var User = Backbone.Model.extend({
	urlRoot: '/storyplaces/user',
})

var StoryList = Backbone.Collection.extend({
	url: '/storyplaces/story'
})

var Story = Backbone.Model.extend({
	urlRoot: '/storyplaces/story',
	
	initialize: function(){
       //this.id=this.get("_id")
    },
	
	getCard: function(id){
		var result;
		this.get("deck").forEach(function(card){
			if(card._id==id){
				result = card
			}
		})
		return result
	}
})

var ReadingList = Backbone.Collection.extend({
	urlRoot: '/storyplaces/reading',
	url: '/storyplaces/reading'
})

var StoryReadingList = Backbone.Collection.extend({
	urlRoot: '/storyplaces/storyreading/',
	url: '/storyplaces/storyreading/',

	initialize: function(story){
		this.urlRoot = '/storyplaces/storyreading/'+story
		this.url = '/storyplaces/storyreading/'+story
    }
})

var Reading = Backbone.Model.extend({
	urlRoot: '/storyplaces/reading',
	
	getVariable: function(key){
		
	}
})