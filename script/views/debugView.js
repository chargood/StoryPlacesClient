define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var DebugView = Backbone.View.extend({

        el: $('#debug'),
        
        events: {
            'click .geo-button' : 'clickDebugLocButton'
        },

        render: function (options) {

            this.debugOn()

            if (this.$el.find('#buttons').html() === '') {
                
                this.addDebugLocButton(50.93679, -1.396202, "32north");
                this.addDebugLocButton(50.937385, -1.397039, "gower");
                this.addDebugLocButton(50.936195, -1.396707, "interchange");
                this.addDebugLocButton(50.936181, -1.397393, "nuffnorth");
                this.addDebugLocButton(50.935971, -1.397544, "nuffsouth");
                this.addDebugLocButton(50.936066, -1.396074, "32south");
                this.addDebugLocButton(50.935106, -1.395923, "library");
                this.addDebugLocButton(50.934558, -1.397104, "susu");
                this.addDebugLocButton(50.934707, -1.398295, "garden");
                this.addDebugLocButton(50.935633, -1.399089, "health");
            }
        },

        debugOn: function debugOn() {
            this.$el.show();
        },


        debugOff: function () {
            this.$el.hide();
        },

        printDebug: function (msg) {
           this.$el.append("<p>" + msg + "</p>");
        },

        clearDebug: function () {
            this.$el.empty();
        },

        addDebugLocButton: function (lat, lon, label) {
            this.$el.find('#buttons').append('<button class="geo-button" data-lat="' + lat + '" data-lon="' + lon + '">' + label + "</button>");
        },
        
        clickDebugLocButton: function (e) {
            var lat = $(e.currentTarget).data('lat');
            var lon = $(e.currentTarget).data('lon'); 
            
            localStorage.setItem("GPSLat", lat)
            localStorage.setItem("GPSLon", lon)

            var event = document.createEvent('Event')
            event.initEvent('gpsupdate', true, true)
            document.getElementById("page").dispatchEvent(event);
        }

    });

    return DebugView;

});