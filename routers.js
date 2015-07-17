var Router = Backbone.Router.extend({
	
	routes:{
		'':'home'
	}	
});

var router = new Router();

var storyListView = new StoryListView();

router.on('route:home', function(){
	console.log('Home Route');
	storyListView.render();
	console.log('Home Route2');
});

Backbone.history.start();