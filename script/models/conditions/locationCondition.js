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
    'underscore',
    'backbone',
    'SPGPS',
    'debugView'
], function (_, Backbone, GPS, DebugView) {

    var LocationCondition = Backbone.Model.extend({

        resolveCondition: function (context) {
            if (this.get("locationType") == "circle") {
                return this.resolveCircle(context);
            }
        },

        resolveCircle: function (context) {
            var dis =  GPS.getDistanceFromLatLonInKm(localStorage.getItem("GPSLat"), localStorage.getItem("GPSLon"), this.get("locationData").lat, this.get("locationData").lon);
            console.log("circle check", dis, this.get("locationData").radius, localStorage.getItem("GPSLat"), localStorage.getItem("GPSLon"), this.get("locationData").lat, this.get("locationData").lon);

            var debugView =  DebugView.getDebug();
            debugView.printDebug("circle check " + this.get("name") + " distance:" + dis + " radius:" + this.get("locationData").radius + " ulat:" + localStorage.getItem("GPSLat") + " ulon:" + localStorage.getItem("GPSLon") + " tlat:" + this.get("locationData").lat + " tlon:" + this.get("locationData").lon);
            return (this.get("bool") && dis < this.get("locationData").radius);
        }

    });

    return LocationCondition;

});
