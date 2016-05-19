/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'backbone',
    'Marker',
], function (Backbone, Marker) {
    var markerCollection

    markerCollection = Backbone.Collection.extend({
        model: Marker,

        destroy: function() {
            this.each(function(marker) {
                marker.destroy();
            })
        }

    });

    return markerCollection;
});
