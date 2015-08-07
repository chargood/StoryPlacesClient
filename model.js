var StoryList = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("Story"),
	url: '/storyplaces/story'
})

var Story = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("Story"),
	urlRoot: '/storyplaces/story',
	
	getCard: function(id){
		this.deck.forEach(function(card){
			if(card._id==id)
				return card
		})
	}
})

var ReadingList = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("Reading"),
	urlRoot: '/storyplaces/reading'
})

var Reading = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("Reading"),
	urlRoot: '/storyplaces/reading',
	
	getVariable: function(key){
		
	}
})