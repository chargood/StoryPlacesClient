var Router = Backbone.Router.extend({
	
	routes:{
		'':'home',
		'story/:id':'viewStory',
		'reading/play/:id':'playReading'
	}	
});

var router = new Router();

var storyListView = new StoryListView();
var storyView = new StoryView();
var readingView = new ReadingView();

router.on('route:home', function(){
	console.log('Home Route');
	storyListView.render();
});

router.on('route:viewStory', function(id){
	console.log('View Story Route');
	storyView.render({id:id});
});

router.on('route:playReading', function(id){
	console.log('Play Reading Route');
	readingView.render({id:id});
});


if(localStorage.getItem("User-ID")==null){
	var user = new User();
	user.save({},{
		success: function(user){
			localStorage.setItem("User-ID", user.id);
		}
	})			
}



Backbone.history.start();