var AppView = Parse.View.extend({

    el: "#app",
    
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

        if(filter.trim() != "")
            this.collection.reset(this.originalPoisonCollection.filterByString(filter));
        else
            this.clearFilter();

        if(this.collection.length == 1) {	
            this.selectedKey = this.collection.at(0).get("slug");
            Parse.history.navigate("gift/"+this.selectedKey, false);

            this.openSelectedPoison(false);	
        }
    },
    
    openSelectedPoison: function(scroll) {
    
    	console.log("open "+this.selectedKey);

        if(!this.selectedKey)
            return;

        var poison = this.collection.getBySlug(this.selectedKey);

        var poisonInfoView = new PoisonView({
            model: poison
        });

        $el = $("#"+this.selectedKey).parent();

        if($el.children("article.info").length == 0)
            $el.append(poisonInfoView.render().el);

        $el.children("article.info").show();
        $el.find("i.chevron").addClass("icon-chevron-down");
        $el.find("i.chevron").removeClass("icon-chevron-right");


        if(scroll) {

            $('html,body').animate({scrollTop: $el.offset().top});
        }

        this.selectedKey = null;
    }

});