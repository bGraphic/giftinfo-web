var PoisonDirectoryView = Parse.View.extend({
	el: $("#poison-collection"),

    initialize: function () {
        var self = this;

        _.bindAll(this, 'addPoisons', 'addOnePoison', 'resetPoisons');

        this.collection.bind("add", this.addPoisons);
        this.collection.bind("reset", this.resetPoisons);

    },

    addPoisons: function (poisons) {
        if(poisons instanceof Array)
            poisons.each(this.addOnePoison);
        else
            this.addOnePoison(poisons);

    },

    resetPoisons: function (newCollection) {
        this.$el.find("ul.nav").html("");
        newCollection.each(this.addOnePoison);
    },

    addOnePoison: function (poison) {
        var poisonView = new PoisonListItemView({
            model: poison,
            collection: this.collection
        });

        this.$el.find("ul.nav").append(poisonView.render().el);

        if(poison.get("slug") == this.collection.selectedPoisonSlug)      
        {
            poisonView.togglePoisonInfo();
			
			if(this.collection.scrollToSlug)
				$('html,body').animate({scrollTop: poisonView.$el.offset().top});
				
			this.collection.selectedPoisonSlug = null;
			this.collection.scrollToSlug = null;
			
        }
    }
});

var PoisonListItemView = Parse.View.extend({
    tagName: "li",

    template: _.template($('#poisonItemTemplate').html()),

    events: {
        "click a.item" : "itemClicked"
    },

    render: function () {
    
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    
	itemClicked: function () {
		_gaq.push(['_trackEvent', 'Poison', 'Open', this.model.get("slug")]);
	
		this.togglePoisonInfo();
	},

    togglePoisonInfo: function () {

        var poisonView = new PoisonView({
            model: this.model,
            collection: this.collection
        });

        if(this.$el.children("article.info").length == 0)
            this.$el.append(poisonView.render().el);
		else
            this.$el.children("article.info").toggle();

        if(this.$el.children("article.info")) {
            this.$el.find(".item i.chevron").toggleClass("icon-chevron-down");
            this.$el.find(".item i.chevron").toggleClass("icon-chevron-right");
        }

        if(this.$el.children("article.info").is(":hidden"))
            Parse.history.navigate("liste", false);
        else
            Parse.history.navigate("gift/" + this.model.get("slug"), false);
    }
});

var PoisonView = Parse.View.extend({
    tagName: "article",
    className: "info",

    template: _.template($('#poisonTemplate').html()),

    render: function () {

        var parentId = this.model.get("parent");

        if(parentId) {

            var parent = this.collection.get(parentId);

            this.model.set("use_coal", parent.get("use_coal"));
            this.model.set("risk", parent.get("risk"));
            this.model.set("symptoms", parent.get("symptoms"));
            this.model.set("action", parent.get("action"));
            this.model.set("content", parent.get("content"));
        }

        if(this.model.get("use_coal") == 1)
            this.model.set("use_coal", true);
        else
            this.model.set("use_coal", false);

        if(!this.model.get("risk"))
            this.model.set("risk", null);

        if(!this.model.get("symptoms"))
            this.model.set("symptoms", null);

        if(!this.model.get("action"))
            this.model.set("action", null);

        if(!this.model.get("content"))
            this.model.set("content", null);

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});