// the application entry point

define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'backbone_dual'
], function ($, _, Backbone, Router, BackBone_Dual) {

    var initialize = function () {
        var router = Router.initialize();
    };

    return {
        initialize: initialize
    };
});