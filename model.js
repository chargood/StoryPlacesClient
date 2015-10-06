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
	urlRoot: '/storyplaces/story',
	url: '/storyplaces/story',

	initialize: function(story){
		this.urlRoot = '/storyplaces/story/'+story+'/readings'
		this.url = '/storyplaces/story/'+story+'/readings'
    }
})

var Reading = Backbone.Model.extend({
	urlRoot: '/storyplaces/reading',
	
	getVariable: function(key){
		
	}
})