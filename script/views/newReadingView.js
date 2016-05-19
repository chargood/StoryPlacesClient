define([
    'jquery',
    'underscore',
    'backbone',
    'mapReadingView',
    'listReadingView',
    'CardCollection'
], function ($, _, Backbone, MapReadingView, ListReadingView, CardCollection) {

    var ReadingView = Backbone.View.extend({
        events: {
        },

        mapReadingView: undefined,
        listReadingView: undefined,

        mapComponent: 'mapComponent',
        listComponent: 'listComponent',
        compassComponent: 'compassComponent',

        // REMOVE!!!  This is just a kludge to get round not having a full event setup yet!
        reading: undefined,


        initialize: function () {
            this.buildDom();
            this.mapReadingView = new MapReadingView({el: document.getElementById(this.mapComponent)});
            this.listReadingView = new ListReadingView({el: document.getElementById(this.listComponent)});
        },

        buildDom: function() {
            if (this.$el.children().length == 0) {
                this.$el.append("<div id='" + this.mapComponent + "' class='container'></div>");
                this.$el.append("<div id='" + this.listComponent + "' class='container'></div>");
                this.$el.append("<div id='" + this.compassComponent + "' class='container'></div>");
            }
        },

        render: function (reading) {
            if (!this.reading || this.reading.id != reading.id) {
                this.setup(reading);
            }

            //this.reading.updateCardStates();
            $('.view').hide();
            this.$el.show();
        },

        setup: function(reading) {
            this.reading = reading;
            this.listReadingView.setup(this.reading);
            this.mapReadingView.setup(this.reading);
        }
            
    });


    return ReadingView;

});
