/**
 * Created by kep1u13 on 05/05/2016.
 */

define([
    'backbone',
], function (Backbone) {
    var Card;

    Card = Backbone.Model.extend({
        getLabel: function () {
            return (this.get('label')) ? this.get('label') : "";
        },

        getTeaser: function () {
            return (this.get('teaser')) ? this.get('teaser') : "";
        },

        getContent: function () {
            return (this.get('content')) ? this.get('content') : "";
        },

        getHintDirection: function () {
            return (this.get('hint').direction) ? this.get('hint').direction : "";
        },

        isVisible: function () {
            return (this.get('visible')) ? this.get('visible') : false;
        },

        isSuitable: function () {
            return (this.get('suitable')) ? this.get('suitable') : false;
        },

        hasChanged: function () {
            return (this.get('changed')) ? this.get('changed') : false;
        },

        getMarker: function () {
            return this.marker;
        },

        setMarker: function(marker) {
            this.marker = marker;
        }
    });

    return Card;
});
