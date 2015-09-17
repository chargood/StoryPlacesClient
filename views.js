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
		//this.render();
    },
	render: function(options){
		var that = this;
		
		if(options&&options.id){
			this.storyId=options.id
			var story = new Story({id: options.id});
			story.fetch({
				success: function(story){
					/*var localstory = new Story();
					localstory.save(story,{
						success: function(story){
							console.log("Story Local Save")
						}
					})*/
					
					var readinglist = new ReadingList();
					readinglist.fetch({
						success: function(readinglist){
							var template = _.template($('#storytemplate').html())
							that.$el.html(template({
								story:story,
								readinglist:readinglist.models
							}))
						}
					})
				}/*,
				ajaxSync: true*/
			})
		}
		else{
			that.$el.html("ID MISSING")
		}
		
	},
	newReading: function(){
		var that = this;
		console.log("New Reading")
		var readingDetails = {story: this.storyId};
		
		var readinglist = new ReadingList();
		readinglist.fetch({
			success: function(readinglist){
				console.log("got reading list")
				var readingcount = 1
				console.log("readinglist models "+JSON.stringify(readinglist.models))
				readinglist.each(function(reading){
					console.log("each reading "+JSON.stringify(reading) + " "+ reading.get("story") +" "+that.storyId+" "+readingcount)
					if(reading.get("story")==that.storyId){
						readingcount++
					}
				});
				readingDetails.name="Reading "+readingcount
				console.log(readingDetails.name)
				var reading = new Reading();
				reading.save(readingDetails,{
					success: function (reading){
						console.log("reading saved")
						//
						/*reading.save(readingDetails,{
							success: function (reading){
								console.log("reading saved to server")
							},
							error: function(model, response) {
								console.log("reading server error")
								console.log(response);
							},
							ajaxSync: true
						});*/
						//
						router.navigate('', {trigger:true});
					},
					error: function(model, response) {
						console.log("reading error")
						console.log(response);
					}/*,
					ajaxSync: true*/
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
		//'createReading': 'createReading'
	},
	initialize: function(){
		//this.render();
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
		console.log("test")
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
	
	
})