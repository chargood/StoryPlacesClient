// provides configurations for require.js

require.config({
    paths: {
        jquery: 'libs/jquery.min.amd',
        underscore: 'libs/underscore.min.amd',
        backbone: 'libs/backbone.min.amd',
        backbone_dual: 'libs/Backbone.dualStorage-1.4.0/backbone.dualstorage.amd',
        debug: 'utils/debug',
        SPGPS: 'utils/SPGPS',
        scripts: 'utils/scripts',
        geolocator: 'libs/geolocator.amd',
        moment: 'libs/moment.min'
    }
});

require(['app'], function(App){
    App.initialize();    
});