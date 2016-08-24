// the application entry point

define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'SPGPS',
    'backbone_dual',
	'geolocate'
], function ($, _, Backbone, Router, SPGPS, BackBone_Dual, geolocate) {

    var initialize = function () {
        SPGPS.testLocator(startup, noGPS);
    };

    function startup() {
        var self = this;
        this.router = Router.initialize();
        SPGPS.initiateLocator();
    }

    function noGPS(error) {
        console.log(error);
        window.location = 'nogps.html';
    }

    return {
        initialize: initialize
    };
});