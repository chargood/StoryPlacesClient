define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    
    var StoryReadingList = Backbone.Collection.extend({
	urlRoot: '/storyplaces/story',
	url: '/storyplaces/story',

	initialize: function(story, user){
		this.urlRoot = '/storyplaces/story/'+story+'/readings/'+user
		this.url = '/storyplaces/story/'+story+'/readings/'+user
    }
});

return StoryReadingList;
    
});