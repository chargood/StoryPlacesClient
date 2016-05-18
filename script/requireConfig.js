// provides configurations for require.js

require.config({
    paths: {
        jquery: 'libs/jquery-1.12.3.min',
        underscore: 'libs/underscore-1.8.3.min',
        backbone: 'libs/backbone-1.3.3.min',
        backbone_dual: 'libs/Backbone.dualStorage-1.4.0/backbone.dualstorage.amd',
        debug: 'utils/debug',
        SPGPS: 'utils/SPGPS',
        scripts: 'utils/scripts',
        geolocator: 'libs/geolocator.amd',
        leaflet: 'libs/leaflet',
        iconRepository: 'map/icons/iconRepository',
        iconFactory: 'map/icons/iconFactory',
        map: 'map/map',
        mapReadingView: 'views/mapReadingView',
        listReadingView: 'views/listReadingView',
        cardView: 'views/cardView',
        Card: 'models/card',
        CardState: 'models/cardState',
        Story: 'models/story',
        StoryRepository: 'repositories/storyRepository',
        Reading: 'models/reading',
        Marker: 'models/marker',
        ReadingRepository: 'repositories/readingRepository',
        CardCollection: 'collections/cardCollection',
        CardStateCollection: 'collections/cardStateCollection',
        StoryCollection: 'collections/StoryCollection',
        MarkerCollection: 'collections/MarkerCollection',
        newReadingView: 'views/newReadingView'
    }
});

require(['app'], function(App){
    App.initialize();    
});