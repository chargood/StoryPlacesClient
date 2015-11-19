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
		this.on("change", function() {
			if (this.hasChanged("story")) {
				var storyId = that.get("story")
				var story = new Story({id: storyId});
				story.fetch({
					success: function(story){
						that.storyObj = story;						
					}
				})
			}
		})		 		
	},
	
	//NOT FINISHED - NEEDS proper value replacing and object saving
	setVariable: function(key, value){
		var vars = this.get("variables");
		vars.push({key:key,value:value});
		this.set("variables", vars); 
	},
		
	getVariable: function(key){
		var result;
		this.get("variables").forEach(function(variable){
			console.log("test5 "+variable)
			if(variable.key==key){
				result = variable.value
			}
		})
		return result
	},
	
	getValue: function(val, type){
		if(type=="String"||type=="Integer"){
			return val;
		}
		else if(type="Variable"){
			return this.getVariable(val)
		}
			
	},
	
	checkCardConditions: function(cardId){
		var that = this;
		var res = true;
		var conditions = this.storyObj.getCard(cardId).conditions;
		conditions.forEach(function(condition){
			if(!that.checkCondition(condition)){
				res=false;
			}
		})
		return res;
	},
	
	checkCondition: function(conditionName){
		return this.getCondition(conditionName).resolveCondition(this)
	},
	
	getCondition: function(conditionName){
		var res;
		var conditions = this.storyObj.get("conditions");
		conditions.forEach(function(condition){
			if(condition.name==conditionName){
				res=condition;				
			}
		})
		
		if(res.type=="comparisson"){
			return new ComparissonCondition(res)
		}
		else if(res.type=="logical"){
			return new LogicalCondition(res)
		}
		else{
			return null
		}
	}
})

var ComparissonCondition = Backbone.Model.extend({
	resolveCondition: function(context){
		var vara = context.getValue(this.get("a"),this.get("aType"))
		var varb = context.getValue(this.get("b"),this.get("bType"))
		if(this.get("operand")=="=="){
			if(vara==varb)
				return true;
			else
				return false;
		}
		else if(this.get("operand")=="!="){
			if(vara!=varb)
				return true;
			else
				return false;
		}
		else if(this.get("operand")=="<"){
			if(vara<varb)
				return true;
			else
				return false;
		}
		else if(this.get("operand")==">"){
			if(vara>varb)
				return true;
			else
				return false;
		}
		else if(this.get("operand")=="<="){
			if(vara<=varb)
				return true;
			else
				return false;
		}
		else if(this.get("operand")==">="){
			if(vara>=varb)
				return true;
			else
				return false;
		}
		else
			return false
	}
})

var LogicalCondition = Backbone.Model.extend({
	resolveCondition: function(context){
		var res = false;
		if(this.get("operand")=="AND"){
			res = true;
			var conditions = this.get("conditions");
			conditions.forEach(function(conditionName){
				if(!context.getCondition(conditionName).resolveCondition(context)){
					res = false;
				}
			})
		}
		else if(this.get("operand")=="OR"){
			res = false;
			var conditions = this.get("conditions");
			conditions.forEach(function(conditionName){
				if(context.getCondition(conditionName).resolveCondition(context)){
					res = true;
				}
			})
		}

		return res;
	}
})