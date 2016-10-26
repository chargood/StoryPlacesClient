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
    'moment'
], function (_, Backbone, Moment) {

    var StoryFunction = Backbone.Model.extend({
        checkConditions: function (context) {
            var that = this;
            var res = true;
            var conditions = this.get("conditions");
            conditions.forEach(function (condition) {
                if (!context.checkCondition(condition)) {
                    res = false;
                }
            });

            return res;
        },

        execute: function (context) {
            if (this.checkConditions(context)) {
                var argumentsString = "context,";

                var args = this.get("arguments");
                args.forEach(function (argument) {
                    argumentsString += "'" + argument + "',";
                });
                argumentsString = argumentsString.substring(0, argumentsString.length - 1);
                eval("this." + this.get("type") + "function(" + argumentsString + ")");
            }
        },

        setfunction: function (context, key, value) {
            context.setVariable(key, value);
        },
        
        settimestampfunction: function(context, key) {
            var now = Moment().format();
            context.setVariable(key, now);
        },

        incrementfunction: function (context, key, value) {
            if (!isNaN(parseInt(context.getVariable(key))) && !isNaN(parseInt(value)))
                context.setVariable(key, (parseInt(context.getVariable(key)) + parseInt(value)));
			if(context.getVariable(key)==undefined)
				context.setVariable(key,parseInt(value))
        }

    });

    return StoryFunction;

});
