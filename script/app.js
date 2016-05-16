// the application entry point

define([
  'jquery',
  'underscore',
  'backbone',
  'router',

], function($, _, Backbone, Router){
  
  var initialize = function() {
      var router = Router.initialize();
  };
  
  return {
      initialize: initialize
  };  
});