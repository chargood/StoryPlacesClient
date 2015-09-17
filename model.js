var User = Backbone.Model.extend({
	urlRoot: '/storyplaces/user',
	initialize: function(){
		//console.log("!!!"+JSON.stringify(this))
		//localStorage.setItem("User-ID", this.id);
    }
})

var StoryList = Backbone.Collection.extend({
	url: '/storyplaces/story'
})

var Story = Backbone.Model.extend({
	urlRoot: '/storyplaces/story',
	
	initialize: function(){
       this.id=this.get("_id")
    },
	
	getCard: function(id){
		this.deck.forEach(function(card){
			if(card._id==id)
				return card
		})
	}
})

var ReadingList = Backbone.Collection.extend({
	urlRoot: '/storyplaces/reading',
	url: '/storyplaces/reading'
})

var Reading = Backbone.Model.extend({
	urlRoot: '/storyplaces/reading',
	
	getVariable: function(key){
		
	}
})