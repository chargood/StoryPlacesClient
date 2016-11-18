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
    'backbone',
    'StoryCollection',
    'errorView'
], function ($, _, Backbone, StoryCollection, ErrorView) {

    var StoryListView = Backbone.View.extend({
        events: {},

        initialize: function () {
            this.errorView = new ErrorView({el: document.getElementById('errorView')});
        },

        render: function (storyList,tag) {
            var that = this;

            // storyList is now injected to enable testing, so hasn't been injected then create it.
            if (storyList === undefined) {
                storyList = new StoryCollection();
            }

            storyList.fetch({
                success: function (storyList) {
                    $('.view').hide();
                    that.$el.closest('.view').show();

                    that.$el.html(that.template({
                        storyList: storyList,
                        tag: tag
                    }));

                    console.log("story list view rendered");
                },
                error: function() {
                    that.errorView.render("Unable to load story list, please check your internet connection and try again.");
                }
            });
        },

        //console.log('story publish state')
        
        template: _.template(
            "<% if(tag!=undefined){%>"
            + "<p><b>List for: </b><%=tag%> - <a href='#'>Cancel Filter</a></p>"
            + "<%} else {%>"
            + "<p><b>Filter List for: </b><a href='#/storylist/Bournemouth'>Bournemouth</a>, <a href='#/storylist/Southampton'>Southampton</a></p>"
            + "<%}%>"
            + "<table class='table table-hover'>"
            + "<tbody>"
            + "<% storyList.each(function(story) { %>"
            + "<% if(story.get('publishState')!='unpublished'&&(tag==undefined||story.get('tags').indexOf(tag)!=-1)){ %>"
            + "<tr><td><a href='#/story/<%= story.id %>'><%=story.get('name') %></a></td></tr>"
            + "<%}%>"
            + "<%});%>"
            + "</tbody>"
            + "</table>"
        ),
    });

    return StoryListView;

});
