// provides configurations for require.js

require.config({
    paths: {
        jquery: 'libs/jquery.min.amd',
        underscore: 'libs/underscore.min.amd',
        backbone: 'libs/backbone.min.amd',
        debug: 'utils/debug',
        SPGPS: 'utils/SPGPS',
        scripts: 'utils/scripts',
        geolocator: 'libs/geolocator.amd'
    }
});

require(['app'], function(App){
    App.initialize();    
});