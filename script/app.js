// the application entry point

define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'utils/SPGPS',
  'views/readingView'
], function($, _, Backbone, Router, GPS, ReadingView){
  
  var initialize = function() {
      var router = Router.initialize();
  };
  
  return {
      initialize: initialize
  };  
});