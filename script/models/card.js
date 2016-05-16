/**
 * Created by kep1u13 on 05/05/2016.
 */

define([
    'backbone',
], function (Backbone) {
    var Card;

    Card = Backbone.Model.extend({

        marker: undefined,

        initialize: function () {
            this.set({
                previousSuitable: false,
                previousVisible: false
            });
        },

        updateStatus: function (reading) {
            this.set({
                previousSuitable: this.get('suitable'),
                previousVisible: this.get('visible'),
                changed: false,
                visible: false,
                suitable: false
            });

            var nonLocationConditions = reading.checkCardNonLocConditions(this.id);

            if (nonLocationConditions) {
                this.set({
                    visible: true,
                    suitable: reading.checkCardConditions(this.id)
                });
            }

            if (this.get('visible') != this.get('previousVisible') || this.get('suitable') != this.get('previousSuitable')) {
                this.set({changed: true});
            }
        },

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
