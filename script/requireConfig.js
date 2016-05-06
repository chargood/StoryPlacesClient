// provides configurations for require.js

require.config({
    paths: {
        jquery: 'libs/jquery.min.amd',
        underscore: 'libs/underscore-1.8.3.min',
        backbone: 'libs/backbone.min.amd',
        backbone_dual: 'libs/Backbone.dualStorage-1.4.0/backbone.dualstorage.amd',
        debug: 'utils/debug',
        SPGPS: 'utils/SPGPS',
        scripts: 'utils/scripts',
        geolocator: 'libs/geolocator.amd',
        leaflet: 'libs/leaflet',
        iconRepository: 'map/icons/iconRepository',
        iconFactory: 'map/icons/iconFactory',
        map: 'map/map'
    }
});

require(['app'], function(App){
    App.initialize();    
});