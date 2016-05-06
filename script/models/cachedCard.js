/**
 * Created by kep1u13 on 05/05/2016.
 */

define([
    'backbone',
], function (Backbone) {
    var CachedCard = Backbone.Model.extend({

        updateStatus: function (reading) {

            if (this.get('previousSuitable') == undefined) {
                this.set({previousSuitable: false});
            }

            if (this.get('previousVisible') == undefined) {
                this.set({previousVisible: false});
            }

            this.set({
                previousSuitable: this.get('suitable'),
                previousVisible: this.get('visible'),
                changed: false,
                visible: false,
                suitable: false
            });

            var nonLocationConditions = reading.checkCardNonLocConditions(this.get('id'));
            var allConditions = reading.checkCardConditions(this.get('id'));

            if (nonLocationConditions) {
                this.set({
                    visible: true,
                    suitable: allConditions
                });
            }

            if (this.get('visible') != this.get('previousVisible') || this.get('suitable') != this.get('previousSuitable')) {
                this.set({changed: true});
            }
        }
    });

    return CachedCard;
});
