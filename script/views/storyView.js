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
    'Story',
    'StoryReadingCollectionRepository',
    'Reading',
    'errorView'
], function ($, _, Backbone, Story, StoryReadingCollectionRepository, Reading, ErrorView) {
    var StoryView;

    StoryView = Backbone.View.extend({
        events: {
            'click #newReadingBtn': 'newReading',
            'click #newCustomReadingBtn': 'newCustomReading',
            'click #refreshReadingsBtn': 'redraw',
            'click #showDescription': 'showDescription',
            'click #hideDescription': 'hideDescription'
        },

        story: undefined,

        initialize: function () {
            this.errorView = new ErrorView({el: document.getElementById('errorView')});
        },

        redraw: function () {
            if (this.story) {
                this.render(this.story);
            }
        },

        showDescription: function() {
            this.$el.find("[role='description']").show();
            this.$el.find("#hideDescription").show();
            this.$el.find("#showDescription").hide();
        },

        hideDescription: function() {
            this.$el.find("[role='description']").hide();
            this.$el.find("#hideDescription").hide();
            this.$el.find("#showDescription").show();
        },

        render: function (story) {
            var that = this;

            this.story = story;


            StoryReadingCollectionRepository.getStoryReadingCollection(
                this.story.id,
                function (readingList) {
                    $('.view').hide();

                    that.$el.find("[role='title']").html(that.headingTemplate({
                        story: that.story
                    }));

                    that.$el.find("[role='author']").html(that.authorTemplate({
                        story: that.story
                    }));

                    if (that.story.get('description')) {
                        that.$el.find("[role='descriptionWrapper']").show();
                        that.$el.find("[role='description']").html(that.descriptionTemplate({
                            story: that.story
                        }));
                    } else {
                        that.$el.find("[role='descriptionWrapper']").hide();
                    }

                    that.$el.find("[role='list']").html(that.template({
                        story: that.story,
                        readingList: readingList
                    }));

                    that.$el.show();

                },

                function () {
                    console.log("Can not fetch readinglist");
                    window.history.back();
                    that.errorView.render("Unable to load story, please check your internet connection and try again.");
                }
            );
        },

        headingTemplate: _.template("<%= _.escape(story.get('name')) %>"),
        authorTemplate: _.template("<%= story.get('author') %>"),
        descriptionTemplate: _.template("<%= story.get('description') %>"),

        template: _.template(
            "<table class='table table-hover'>"
            + "<% readingList.each(function(reading) { %>"
            + "<tr>"
            + "<td><a href='#/reading/<%= _.escape(reading.id) %>'><%= _.escape(reading.get('name')) %></a></td>"
            + "<% }); %>"
            + "</table>"
            + "<% if(readingList.size()==0) { %>"
            + "<p>You have not created a reading, please click the plus sign above to do so.</p>"
            + "<% } %>"
        ),


        //TODO:  Move all the following to a reading collection

        newReading: function () {            
            if (!navigator.onLine) {
                this.errorView.render("Cannot create new reading whilst offline, please check your internet connection and try again.");
                return;
            }
            
            var that = this;
            StoryReadingCollectionRepository.getStoryReadingCollection(
                this.story.id,
                function (storyRC) {
                    storyRC.newReading(
                        function () {
                            that.redraw();
                        },
                        function () {
                            that.errorView.render("Unable to create reading, please check your internet connection and try again.");
                        }
                    );
                });
        },
        newCustomReading: function () {
            console.log("New Custom Reading");
            var readingDialog = new ReadingDialog();
            readingDialog.render({'id': this.storyId});
        }

    });

    return StoryView;
});
