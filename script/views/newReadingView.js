define([
    'jquery',
    'underscore',
    'backbone',
    'mapReadingView',
    'listReadingView'
], function ($, _, Backbone, MapReadingView, ListReadingView) {

    var ReadingView = Backbone.View.extend({
        events: {
            "gpsupdate": "gpsChange"
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
            this.updateCardStates(reading);
            this.reading = reading;
            $('.view').hide();
            this.mapReadingView.render(reading);
            this.listReadingView.render(reading);
            this.$el.show();
        },

        gpsChange: function () {
            console.log("gps update in reading view");
            if (this.reading) {
                this.render(this.reading)
            }
        },

        updateCardStates: function (reading) {
            reading.storyObj.get('deck').each(function (cachedCard) {
                cachedCard.updateStatus(reading);
            });
        },

    });

    return ReadingView;

});
