// the application entry point

define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'SPGPS',
    'backbone_dual'
], function ($, _, Backbone, Router, SPGPS, BackBone_Dual) {

    var initialize = function () {
        SPGPS.testLocator(startup, noGPS);
    };

    function startup() {
        var self = this;
        this.router = Router.initialize();

        SPGPS.initiateLocator(function (error) {
            console.log(error);
            self.router.navigate('/error/gps', {trigger:true});
        });
    }

    function noGPS(error) {
        console.log(error);
        window.location = 'nogps.html';
    }

    return {
        initialize: initialize
    };
});