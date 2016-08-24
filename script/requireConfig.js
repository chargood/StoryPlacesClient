// provides configurations for require.js
'use strict';

require.config({
    paths: {
        jquery: 'libs/jquery-1.12.3.min',
        bootstrap: 'libs/bootstrap-3.3.6-dist/js/bootstrap',
        underscore: 'libs/underscore-1.8.3.min',
        backbone: 'libs/backbone-1.3.3.min',
        backbone_dual: 'libs/Backbone.dualStorage-1.4.0/backbone.dualstorage.amd',
        moment: 'libs/moment.min',
        leaflet: 'libs/leaflet',

        SPGPS: 'utils/SPGPS',
		
		geolocate: 'libs/geolocate',

        iconRepository: 'map/icons/iconRepository',
        iconFactory: 'map/icons/iconFactory',
        map: 'map/map',

        mapReadingView: 'views/mapReadingView',
        listReadingView: 'views/listReadingView',
        cardView: 'views/cardView',
        errorView: 'views/errorView',
        readingView: 'views/readingView',
        storyListView: 'views/storyListView',
        storyView: 'views/storyView',
        debugView: 'views/debugView',

        Card: 'models/card',
        CardState: 'models/cardState',
        Story: 'models/story',
        Reading: 'models/reading',
        Marker: 'models/marker',
        User: 'models/user',
		LogEvent: 'models/logEvent',

        comparisonCondition: 'models/conditions/comparisonCondition',
        locationCondition: 'models/conditions/locationCondition',
        logicalCondition: 'models/conditions/logicalCondition',
        timeRangeCondition: 'models/conditions/timeRangeCondition',
        timePassedCondition:'models/conditions/timePassedCondition',
        storyFunction: 'models/storyFunction',

        StoryRepository: 'repositories/storyRepository',
        ReadingRepository: 'repositories/readingRepository',
        StoryReadingCollectionRepository: 'repositories/storyReadingCollectionRepository',
        MediaCacheRepository: 'repositories/mediaCacheRepository',
		LogEventCollectionRepository: 'repositories/logEventCollectionRepository',

        CardCollection: 'collections/cardCollection',
        CardStateCollection: 'collections/cardStateCollection',
        StoryCollection: 'collections/storyCollection',
        MarkerCollection: 'collections/markerCollection',
        StoryReadingCollection: 'collections/storyReadingCollection',
		LogEventCollection: 'collections/logEventCollection',

        CacheManager: 'utils/localStorageCacheManager'        
    }
});

require(['app'], function(App){
    App.initialize();    
});