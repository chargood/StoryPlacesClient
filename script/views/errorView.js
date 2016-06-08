define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var ErrorView = Backbone.View.extend({

        render: function (err) {

            $('.view').hide();
            this.$el.show();
            
            
        }
    });


    return ErrorView;

});
