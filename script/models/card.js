/**
 * Created by kep1u13 on 05/05/2016.
 */

"use strict";

define([
    'backbone'
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
            return (this.get('hint') && this.get('hint').direction) ? this.get('hint').direction : "";
        }
    });

    return Card;
});
