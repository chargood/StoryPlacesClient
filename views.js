var StoryListView = Backbone.View.extend({
	el: $('#page'),
	events: {
		'click .updateList': 'updateList'
	},
	initialize: function(){
		//this.render();
    },
	render: function(){
		var that = this;
		var storylist = new StoryList();
		storylist.fetch({
			success: function(storylist){
				var template = _.template($('#storylisttemplate').html())
				that.$el.html(template({
					storylist:storylist.models
				}))
			}
		})
	}/*,
	updateList: function(){
		var that = this;
		var storylist = new StoryList();
		storylist.fetch({
			success: function(storylist){
				var localstorylist = new StoryList();
				localstorylist.save(storylist,{
					success: function(storylist){
						console.log("Story List Local Save")
					}
				})
			},
			ajaxSync: true
		})
	}*/
});

var StoryView = Backbone.View.extend({
	el: $('#page'),
	events: {
		'click .newReadingBtn': 'newReading',
		'click .newCustomReadingBtn': 'newCustomReading',
	},
	initialize: function(){
		
    },
	render: function(options){
		var that = this;
		
		if(options&&options.id){
			this.storyId=options.id
			var story = new Story({id: options.id});
			story.fetch({
				success: function(story){
					var readinglist = new StoryReadingList(that.storyId, localStorage.getItem("User-ID"));
					readinglist.fetch({
						success: function(readinglist){
							var template = _.template($('#storytemplate').html())
							that.$el.html(template({
								story:story,
								readinglist:readinglist.models
							}))
						}
					})
				}
			})
		}
		else{
			that.$el.html("ID MISSING")
		}
		
	},
	newReading: function(){
		var that = this;
		console.log("New Reading")
		var readingDetails = {story: this.storyId, user: localStorage.getItem("User-ID")};
		
		var readinglist = new ReadingList();
		readinglist.fetch({
			success: function(readinglist){
				console.log("got reading list")
				var readingcount = 1
				readinglist.each(function(reading){
					if(reading.get("story")==that.storyId){
						readingcount++
					}
				});
				readingDetails.name="Reading "+readingcount
				var reading = new Reading();
				reading.save(readingDetails,{
					success: function (reading){
						console.log("reading saved")						
						router.navigate('', {trigger:true});
					},
					error: function(model, response) {
						console.log("reading error")
						console.log(response);
					}
				});
			}
		})		
	},
	newCustomReading: function(){
		console.log("New Custom Reading")
		var readingDialog = new ReadingDialog()
		readingDialog.render({'id':this.storyId});
	}
});

var ReadingDialog = Backbone.View.extend({
	el: $('#page'),
	events: {
		
	},
	initialize: function(){
		
		this.on('createReading', this.createReading);
    },
	remove: function() {
		this.off("createReading", this.createReading);
	},  
	render: function(options){
		var that = this;
		this.storyId=options.id
		var template = _.template($('#readingdialog').html())
		this.$el.append(template())
		$( "#readingdialog" ).dialog({
			modal: true,
			title: "Add Reading",
			show: true,
			buttons: [{
				text: "Add Reading",
				click: function() {
					that.trigger('createReading')
					$( this ).dialog( "close" );
				}
			}]
		});
	},
	createReading: function(){
		
		console.log("Create Reading "+this.storyId)
	}
});

var ReadingView = Backbone.View.extend({
	el: $('#page'),
	events: {
		"click" : "event"
	},
	initialize: function(options){
		this.readingId = options.id;
    },
	render: function(options){
		this.renderDeck(options)
	},
	renderDeck(options){
		var that = this;
		
		var reading = new Reading({id: this.readingId});
		reading.fetch({
			success: function(reading){
				var storyId = reading.get("story")
				var story = new Story({id: storyId});
				story.fetch({
					success: function(story){
						var template = _.template($('#decktemplate').html())
						that.$el.html(template({
							story:story,
							reading:reading
						}))
					}		
				})								
			}		
		})		
	},
	renderCard(options){
		var that = this;
		var reading = new Reading({id: this.readingId});
		reading.fetch({
			success: function(reading){
				var storyId = reading.get("story")	
				var story = new Story({id: storyId});
				story.fetch({
					success: function(story){
						var card = story.getCard(options.card)
						var template = _.template($('#cardtemplate').html())
						that.$el.html(template({
							story:story,
							reading:reading,
							card:card
						}))
					}		
				})								
			}		
		})
	},
	event(e){
		if(e.target.attributes.eventCheck&&e.target.attributes.eventCheck.value=="true"){
			console.log("event "+e.target.attributes.eventCheck.value+" "+e.target.attributes.eventType.value)//+" "+e.target.attributes.eventData.value)
			if(e.target.attributes.eventType.value=="endcard"){
				router.navigate('/reading/'+this.readingId, {trigger:true});
			}			
			else if(e.target.attributes.eventType.value=="endstory"){
				router.navigate('', {trigger:true});
			}
			else{
				console.log("Unrecognised Event "+e.target.attributes.eventType.value)
			}
		}
	}
})