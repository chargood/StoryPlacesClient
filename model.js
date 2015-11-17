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

	initialize: function(story, user){
		this.urlRoot = '/storyplaces/story/'+story+'/readings/'+user
		this.url = '/storyplaces/story/'+story+'/readings/'+user
    }
})

var Reading = Backbone.Model.extend({
	urlRoot: '/storyplaces/reading',
	
	initialize: function(){
		var that = this;
		var storyId = this.get("story")
		var story = new Story({id: storyId});
		story.fetch({
			success: function(story){
				that.storyObj = story;
			}		
		})
	},
	
	getVariable: function(key){
		var result;
		this.get("variables").forEach(function(variable){
			if(variable.key==key){
				result = variable.value
			}
		})
		return result
	},
	
	getValue: function(val, type){
		if(type=="String"||type="Integer"){
			return val;
		}
		else if(type="Variable"){
			return this.getVariable(val)
		}
			
	},
	
	checkCardConditions: function(cardId){
		var res = true;
		var conditions = this.storyObj.getCard(cardId).conditions;
		conditions.forEach(function(condition){
			if(!that.checkCondition(condition)){
				res=false;
				break;
			}
		})
		return res;
	},
	
	checkCondition: function(conditionName){
		return this.getCondition(conditionName).resolveCondition(this)
	},
	
	getCondition: function(conditionName){
		var res;
		var conditions = this.storyObj.conditions;
		conditions.forEach(function(condition){
			if(condition.name==condition){
				res=condition;
				break;
			}
		})
		
		if(condition.type=="comparisson"){
			return new ComparissonCondition(res)
		}
		else if(condition.type=="logical"){
			return new LogicalCondition(res)
		}
		else{
			return null
		}
	}
	
	
})

var ComparissonCondition = Backbone.Model.extend({
	resolveCondition: function(context){
		var vara = context.getValue(this.a,this.aType)
		var varb = context.getValue(this.b,this.bType)
		//This is a bit nasty :/
		eval("return "+vara+" "+this.operand+" "+varb)		
	}
})

var LogicalCondition = Backbone.Model.extend({
	resolveCondition: function(context){
		
	}
})