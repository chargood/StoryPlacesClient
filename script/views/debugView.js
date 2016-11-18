/* *****************************************************************************
 *
 * StoryPlaces
 *

This application was developed as part of the Leverhulme Trust funded 
StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk

Copyright (c) 2016
  University of Southampton
    Charlie Hargood, cah07r.ecs.soton.ac.uk
    Kevin Puplett, k.e.puplett.soton.ac.uk
    David Pepper, d.pepper.soton.ac.uk

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The name of the Universities of Southampton nor the name of its 
      contributors may be used to endorse or promote products derived from 
      this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

***************************************************************************** */

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var DebugView = Backbone.View.extend({

        el: $('#debug'),
        debug: null,
        initialize: function () {
            console.log("debugView init");
            //getDebug();
        },


        events: {
            'click .geo-button': 'clickDebugLocButton'
        },

        render: function (options) {

            this.debugOn();

            if (this.$el.find('#buttons').html() === '') {

                /*this.addDebugLocButton(50.93679, -1.396202, "32north");
                this.addDebugLocButton(50.937385, -1.397039, "gower");
                this.addDebugLocButton(50.936195, -1.396707, "interchange");
                this.addDebugLocButton(50.936181, -1.397393, "nuffnorth");
                this.addDebugLocButton(50.935971, -1.397544, "nuffsouth");
                this.addDebugLocButton(50.936066, -1.396074, "32south");
                this.addDebugLocButton(50.935106, -1.395923, "library");
                this.addDebugLocButton(50.934558, -1.397104, "susu");
                this.addDebugLocButton(50.934707, -1.398295, "garden");
                this.addDebugLocButton(50.935633, -1.399089, "health");*/
                
                this.addDebugLocButton(50.896933,-1.394094,"canute_chambers")
                this.addDebugLocButton(50.900078,-1.405502,"simnel_street")
                this.addDebugLocButton(50.900069,-1.405799,"the_undercroft")
                this.addDebugLocButton(50.897006,-1.404603,"french_garden")
                this.addDebugLocButton(50.897545,-1.392040,"frog_and_frigate")
                this.addDebugLocButton(50.897545,-1.392040,"victoria_park_LOCUNKNOWN")
                this.addDebugLocButton(50.898041,-1.396409,"Terminus_Terrace")
                this.addDebugLocButton(50.897960,-1.392375,"emigrants_home")
                this.addDebugLocButton(50.897479,-1.393536,"royalcrescent_albertroad")
                this.addDebugLocButton(50.897454,-1.393620,"cafe")
                this.addDebugLocButton(50.896843,-1.398811,"dockgate4")

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

            localStorage.setItem("GPSLat", lat);
            localStorage.setItem("GPSLon", lon);

            console.log("firing gps change");

            var event = document.createEvent('Event');
            event.initEvent('gpsupdate', true, true);
            document.getElementById("page").dispatchEvent(event);
        }

    });

    DebugView.getDebug = function () {
        if (DebugView.debug === null || DebugView.debug === undefined) {
            DebugView.debug = new DebugView();
        }
        return DebugView.debug;
    };

    return DebugView;

});
