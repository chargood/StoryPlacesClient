define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var ReadingDialog = Backbone.View.extend({
        el: $('#page'),
        events: {

        },
        initialize: function () {
            this.on('createReading', this.createReading);
        },
        remove: function () {
            this.off("createReading", this.createReading);
        },
        render: function (options) {
            var that = this;
            this.storyId = options.id;
            var template = _.template($('#readingdialog').html());
            this.$el.append(template());
            $("#readingdialog").dialog({
                modal: true,
                title: "Add Reading",
                show: true,
                buttons: [{
                    text: "Add Reading",
                    click: function () {
                        that.trigger('createReading');
                        $(this).dialog("close");
                    }
                }]
            });
        },
        createReading: function () {
            console.log("Create Reading " + this.storyId);
        }
    });

    return ReadingDialog;

});
