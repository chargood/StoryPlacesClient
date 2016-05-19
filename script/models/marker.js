/**
 * Created by kep1u13 on 05/05/2016.
 */

define([
    'backbone',
    'map',
    'iconFactory',
    'iconRepository'
], function (Backbone, map, iconFactory, iconRepository) {
    var Marker;

    Marker = Backbone.Model.extend({

        // This works as this object's ID is the same as that of the card it is representing

        parse: true,

        initialize: function () {
            this.set({
                marker: undefined,
                type: undefined
            });
        },

        buildMakerFromCard: function (card) {
            if (card.id != this.id) {
                return;
            }

            this.set({marker: this.createMarker(card)});
            this.set({type: this.getMarkerTypeFromCard(card)});
        },

        createMarker: function (card) {
            var type = this.getMarkerTypeFromCard(card);

            if (type == "point") {
                return this.createPointMarkerOnMap(card);
            }

            return undefined
        },

        getMarkerTypeFromCard: function (card) {
            if (!card.get('hint').location || card.get('hint').location.length == 0) {
                return undefined;
            }

            return card.get('hint').location[0].type;
        },

        createPointMarkerOnMap: function (card) {
            var lat = card.get('hint').location[0].lat;
            var long = card.get('hint').location[0].lon;

            if (!lat || !long) {
                return undefined;
            }

            return map.createMarkerWithPopUp(lat, long, iconRepository.redIcon, this.getPopUpTextFromCard(card), null);
        },

        getPopUpTextFromCard: function (card) {
            return "<p><b>" + _.escape(card.getLabel()) + "</b></p>"
                + "<p>" + _.escape(card.getTeaser()) + "</p>"
                + "<p>" + _.escape(card.getHintDirection()) + "</p>";
        },

        updateMarkerFromCardState: function (cardState) {
            if (this.id != cardState.id) {
                return;
            }

            if (!cardState.get('modified') || !this.get('marker')) {
                return;
            }

            if (this.get('type') == "point") {
                this.updatePointMarkerOnMap(cardState)
            }
        },

        updatePointMarkerOnMap: function (cardState) {
            if (!cardState) {
                return;
            }

            if (!cardState.get('visible')) {
                this.removeFromMap();
                return;
            }

            map.updateMarkerIcon(this.get('marker'), iconFactory.getIconForCardState(cardState))

            if (!cardState.get('previousVisible')) {
                map.addMarkerToMap(this.get('marker'));
            }
        },

        removeFromMap: function () {
            map.removeMarkerFromMap(this.get('marker'));
        },

        destroy: function() {
            this.removeFromMap();
            if (this.get('marker')) {
                this.get('marker').unbindPopup();
            }
            this.set({marker: undefined});
        }

    });

    return Marker;
});
