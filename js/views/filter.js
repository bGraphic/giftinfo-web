var FilterView = Parse.View.extend({

    el: "#filter",
    
    events: {
        'focus input':           'selectedFilter',
        'keyup' :               'filterCollection',
        'click #clearFilter': 'clickedClearFilter'
    },
    
    initialize: function() {
     	console.log("init");
    },
    
    selectedFilter: function() {
    	
        var filter = this.$el.find("input").val();
        
        if(filter.trim() == "")
        	Parse.history.navigate("liste", true);
        	
    },
    
    clickedClearFilter: function () {
    	Parse.history.navigate("liste", true);
    },

    clearFilter: function() {

        var filter = this.$el.find("input").val("");
        this.$el.find("button").attr("disabled", "disabled");

        if(this.originalPoisonCollection)
            this.collection.reset(this.originalPoisonCollection.toJSON());
    },
    
    filterCollection: function () {
        var filter = this.$el.find("input").val();

        this.$el.find("button").removeAttr("disabled");

        if(!this.originalPoisonCollection)
            this.originalPoisonCollection = new PoisonCollection().reset(this.collection.toJSON())

        if(filter.trim() != "") {
        	var filteredCollection = this.originalPoisonCollection.filterByString(filter);
        	
        	console.log(filteredCollection);
        	
        	if(filteredCollection.length == 1) {
        		var selectedPoisonSlug = filteredCollection[0].get("slug");
        		
        		this.collection.selectedPoisonSlug = selectedPoisonSlug;
        		this.collection.scrollToSlug = false;
        		
        		_gaq.push(['_trackEvent', 'Poison', 'Search', selectedPoisonSlug]);
        		
        		Parse.history.navigate("gift/"+selectedPoisonSlug, false);
        	}
        	
        	if(filteredCollection.length == 0) {
        		_gaq.push(['_trackEvent', 'Poison', 'Search', '_'+filter]);
        	}
        
            this.collection.reset(filteredCollection);
        }
        else
            this.clearFilter();
    },

});