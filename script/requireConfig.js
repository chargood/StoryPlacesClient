// provides configurations for require.js

require.config({
    paths: {
        jquery: 'libs/jquery.min.amd',
        underscore: 'libs/underscore.min.amd',
        backbone: 'libs/backbone.min.amd'
    }
});

require(['app',], function(App){
    App.initialize();
});