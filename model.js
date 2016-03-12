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
	
	//TODO: create a proper card object and return/use that rather then just returning raw json
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
	
	getStoryObj: function(){
		if(this.storyObj){
			return this.storyObj			
		}
		else{
			var storyId = this.get("story")
			var story = new Story({id: storyId});
			story.fetch({
				success: function(story){
					return story
				}
			})			
		}
	},
	
	setVariable: function(key, value){
		var vars = this.get("variables");
		var update = false;
		
		this.get("variables").forEach(function(variable){
			if(variable.key==key){
				variable.value = value;
				update=true
			}
		})
		
		if(!update){
			vars.push({key:key,value:value});			
		}
		
		this.set("variables", vars);
		this.save();
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
		var conditions = this.getStoryObj().getCard(cardId).conditions;
		conditions.forEach(function(condition){
			if(!that.checkCondition(condition)){
				res=false;
			}
		})
		return res;
	},
	
	checkCardNonLocConditions: function(cardId){
		var that = this;
		var res = true;
		var conditions = this.getStoryObj().getCard(cardId).conditions;
		conditions.forEach(function(condition){
			if(!that.checkCondition(condition)&&that.getCondition(condition).get("type")!="location"){
				res=false;
			}
		})
		return res;
	},
		
	checkCondition: function(conditionName){
		return this.getCondition(conditionName).resolveCondition(this)
	},
	
	getCondition: function(conditionName){
		console.log("getCondition ",conditionName)
		var res;
		var conditions = this.getStoryObj().get("conditions");
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
		else if(res.type=="location"){
			return new LocationCondition(res)
		}
		else{
			return null
		}
	},
	
	executeCardFunctions: function(cardId){
		var that = this;
		var functions = this.getStoryObj().getCard(cardId).functions;
		functions.forEach(function(afunction){
			that.executeFunction(afunction)
		})
	},
	
	executeFunction: function(functionName){
		return this.getFunction(functionName).execute(this)
	},
	
	getFunction: function(functionName){
		var res;
		var functions = this.getStoryObj().get("functions");
		functions.forEach(function(afunction){
			if(afunction.name==functionName){
				res=afunction;				
			}
		})
		
		return new StoryFunction(res)		
	}
})

var ComparissonCondition = Backbone.Model.extend({
	resolveCondition: function(context){
		var vara = context.getValue(this.get("a"),this.get("aType"))
		var varb = context.getValue(this.get("b"),this.get("bType"))
		console.log("Comparisson Cond ",this.get("operand"),vara,varb)
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

var LocationCondition = Backbone.Model.extend({
	resolveCondition: function(context){
		if(this.get("locationType")=="circle"){
			return this.resolveCircle(context);
		}		
	},
	
	resolveCircle: function(context){
		var dis = getDistanceFromLatLonInKm(localStorage.getItem("GPSLat"),localStorage.getItem("GPSLon"),this.get("locationData").lat,this.get("locationData").lon)
		console.log("circle check",dis,this.get("locationData").radius,localStorage.getItem("GPSLat"),localStorage.getItem("GPSLon"),this.get("locationData").lat,this.get("locationData").lon)
		printDebug("circle check "+this.get("name")+" distance:"+dis+" radius:"+this.get("locationData").radius+" ulat:"+localStorage.getItem("GPSLat")+" ulon:"+localStorage.getItem("GPSLon")+" tlat:"+this.get("locationData").lat+" tlon:"+this.get("locationData").lon)
		return (this.get("bool")&&dis<this.get("locationData").radius)
	}
	
})

var StoryFunction = Backbone.Model.extend({
	checkConditions: function(context){
		var that = this;
		var res = true;
		var conditions = this.get("conditions");
		conditions.forEach(function(condition){
			if(!context.checkCondition(condition)){
				res=false;
			}
		})
		//console.log("cond res "+res)
		return res;
	},
	
	execute: function(context){
		if(this.checkConditions(context)){
			var argumentsString="context,";
			
			var arguments = this.get("arguments");
			arguments.forEach(function(argument){
				argumentsString+="'"+argument+"',"
			})
			argumentsString=argumentsString.substring(0,argumentsString.length-1)
			
			//console.log("this."+this.get("type")+"function("+argumentsString+")")
			eval("this."+this.get("type")+"function("+argumentsString+")")
		}
	},
	
	setfunction: function(context,key,value){
		context.setVariable(key,value)
	},
	
	incrementfunction: function(context,key,value){
		if(!isNaN(parseInt(context.getVariable(key)))&&!isNaN(parseInt(value)))
			context.setVariable(key,(parseInt(context.getVariable(key))+parseInt(value)))
	}
	
})