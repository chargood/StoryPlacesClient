// the application entry point

define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'utils/SPGPS'
], function($, _, Backbone, Router, GPS){
  
  var initialize = function() {
      Router.initialize();  
      
      // run once
      GPS.locate();   
      GPS.addGpsUpdateListener(); 
  };
  
  return {
      initialize: initialize
  };  
});