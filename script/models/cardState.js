/**
 * Created by kep1u13 on 05/05/2016.
 */

define([
    'backbone',
], function (Backbone) {
    var CardState;

    CardState = Backbone.Model.extend({

        // This works as this object's ID is the same as that of the card it is representing

        initialize: function () {
            this.set({
                previousSuitable: false,
                previousVisible: false,
                modified: false,
                visible: false,
                suitable: false,
            });
        },

        updateState: function (reading) {

            console.log("updating state of cardstate :", this);

            this.set({
                previousSuitable: this.get('suitable'),
                previousVisible: this.get('visible'),
                modified: false,
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
                this.set({modified: true});
            }
        },

        isVisible: function () {
            return this.get('visible');
        },

        isSuitable: function () {
            return this.get('suitable');
        },

        hasChanged: function () {
            return this.get('modified');
        }
    });

    return CardState;
});
