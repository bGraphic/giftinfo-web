var AppRouter = Parse.Router.extend({

    routes: {
        "":                        "home",
        "info":             "articleList",
        "info/:articleSlug":    "article",
        "liste":             "poisonList",
        "gift/:poisonSlug":      "poison"
    },

    initialize: function () {
    
    	var self = this;

        this.poisonCollection = new PoisonCollection();
		this.moreInfoArticleCollection = new ArticleCollection();
		this.generalInfoArticleCollection = new ArticleCollection();
		
		var poisonDirectoryView = new PoisonDirectoryView({
			collection: this.poisonCollection
		});
        
        var articleDirectoryViewMore = new ArticleDirectoryView({
            collection: this.moreInfoArticleCollection,
            el: "#info-more-collection"
        });

        var articleDirectoryViewGeneralEmergency = new ArticleDirectoryView({
            collection: this.generalInfoArticleCollection,
            el: "#info-general-collection"
        });
        
        this.filterView = new FilterView({
        	collection: this.poisonCollection}
        );
        
        this.retrievePoisons();
        this.retrieveArticles();
    },

    home: function() {
        Parse.history.navigate("info", true);
    },
    
    updateNavbar: function(activePage) {
    	this.filterView.clearFilter();
    
    	$(".navbar li").removeClass("active");
    	$(".navbar li."+activePage).addClass("active");
    },

    articleList: function () {
    
    	$("#poison-collection").hide();
		$('[id^="info-"]').show();
		
    	$('article.info').hide();
		$(".item i.chevron").removeClass("icon-chevron-down");
		$(".item i.chevron").addClass("icon-chevron-right");
    
    	this.updateNavbar("info");

    },

    article: function(articleSlug) {
		this.generalInfoArticleCollection.selectedArticleSlug = articleSlug;
		this.generalInfoArticleCollection.scrollToSlug = true;
		
		this.moreInfoArticleCollection.selectedArticleSlug = articleSlug;
		this.moreInfoArticleCollection.scrollToSlug = true;
		
		this.articleList();
    },

    poisonList: function() {
    	$("#poison-collection").show();
    	$('[id^="info-"]').hide();
    	
    	$('article.info').hide();
		$(".item i.chevron").removeClass("icon-chevron-down");
		$(".item i.chevron").addClass("icon-chevron-right");
    	
    	this.updateNavbar("poison-collection");
    },

    poison: function(poisonSlug) {
		this.poisonCollection.selectedPoisonSlug = poisonSlug;
		this.poisonCollection.scrollToSlug = true;
		this.poisonList();
    },
    
    retrieveArticles: function () {
    
        var articleCollection = new ArticleCollection();
        
        var self = this;
    
    	articleCollection.fetch({
            success: function(collection) {
                $('[id^="info-"] .spinner').remove();

				self.moreInfoArticleCollection.reset([
                    articleCollection.getBySlug("forebygging"),
                    articleCollection.getBySlug("medisinsk-kull"),
                    articleCollection.getBySlug("brekninger"),
                    articleCollection.getBySlug("bevisstloshet")
                ]);

				self.generalInfoArticleCollection.reset([
                    articleCollection.getBySlug("svelging"),
                    articleCollection.getBySlug("hudkontakt"),
                    articleCollection.getBySlug("sol-i-oyet"),
                    articleCollection.getBySlug("innanding")
                ]);
            },
            error: function(collection, error) {
                console.warn("Error: " + error);
            }
        });	
    },
    
    retrievePoisons: function () {
    
    	var self = this;
    
    	var query = new Parse.Query(Poison);
    	query.ascending("name");
    	query.limit(200);
    	query.find({
    	    success: function(results) {
    	        console.log("Fetched " + results.length + " poisons");
                $('#poison-collection .spinner').remove();
    	        self.poisonCollection.reset(results);
    	    },
    	    error: function(error) {
    	          console.log("Error: " + error.code + " " + error.message);
    	    }
    	});		
    }
    

});


$(function() {

    Parse.$ = jQuery;

    Parse.initialize("shC8z7Gd5GkJdtubJqdk6fIvFSXk7vnfYaZCBTD4", "vNDVdJnP7rKCxfIm7QfWROrgvbeg1T6844CCoW0o");

    var app = new AppRouter();
    Parse.history.start();

});