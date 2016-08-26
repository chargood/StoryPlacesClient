define([
    'jquery',
    'underscore',
    'backbone',
    'mapReadingView',
    'listReadingView',
	'SPGPS'
], function ($, _, Backbone, MapReadingView, ListReadingView,SPGPS) {

    var ReadingView = Backbone.View.extend({
        events: {
        },

        mapReadingView: undefined,
        listReadingView: undefined,

        mapComponent: 'mapComponent',
        listComponent: 'listComponent',
        compassComponent: 'compassComponent',
		cardComponent: 'cardComponent',

        reading: undefined,

        initialize: function () {
            this.buildDom();
            this.mapReadingView = new MapReadingView({el: document.getElementById(this.mapComponent)});
            this.listReadingView = new ListReadingView({el: document.getElementById(this.listComponent)});
        },

        buildDom: function() {
            if (this.$el.children().length == 0) {
				this.$el.append("<div id='" + this.listComponent + "' class='listComponent'></div>");
                this.$el.append("<div id='" + this.mapComponent + "' class='mapComponent'></div>");
				this.$el.append("<div id='" + this.cardComponent + "' class='container'></div>");
                this.$el.append("<div id='" + this.compassComponent + "' class='container'></div>");
				
				
            }
        },

        render: function (reading,sim) {
            if (!this.reading || this.reading.id != reading.id) {
                if (this.reading) {
                    this.tearDown();
                }

                this.newReading(reading);
            }
			
			if(sim){
				SPGPS.fakerOn()				
			}
			
            this.listReadingView.render();
			this.sim = sim
            this.mapReadingView.render(sim);
			            

            $('.view').hide();
            this.$el.show();
            
            
            this.mapReadingView.refresh();
        },

        newReading: function(reading) {
            this.reading = reading;
            this.listReadingView.newReading(this.reading);
            this.mapReadingView.newReading(this.reading);
        },

        tearDown: function() {
			this.listReadingView.tearDown();
            this.mapReadingView.tearDown();
            this.reading = undefined;
			if(this.sim){
				SPGPS.fakerOff()
			}
        }
            
    });


    return ReadingView;

});
