var AppRouter = Parse.Router.extend({

    routes: {
        "":                        "home",
        "om":                     "about",
        "info":             "articleList",
        "info/:articleSlug":    "article",
        "liste":             "poisonList",
        ":poisonSlug":           "poison"
    },

    initialize: function () {

        $("#app").after('<img id="poison-spinner" src="img/spinner.gif">');

        this.articleCollection = new ArticleCollection();
        this.articleDirectoryView = new ArticleDirectoryView({collection: this.articleCollection});

        self = this;

        this.articleCollection.fetch({
            success: function(collection) {
                $("#poison-spinner").remove();
                self.articlesLoaded = true;

            },
            error: function(collection, error) {
                console.warn("Error: " + error);
            }
        });

        this.poisonCollection = new PoisonCollection();
        this.poisonDirectoryView = new PoisonDirectoryView({collection: this.poisonCollection});
        this.poisonSearchView = new PoisonSearchDirectoryView({collection: this.poisonCollection, app: this});

        $("#filter").append(this.poisonSearchView.el);

        this.batchRetrieve(0);
    },

    home: function() {

        this.articleList();

    },

    about: function() {
        var query = new Parse.Query(Article);
        query.equalTo("slug", "om");
        query.first({
            success: function(article) {
                var articleView = new ArticleView({
                    model: article
                });

                $("#app").html(articleView.render().el);
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },

    articleList: function () {
        $("#app").html(this.articleDirectoryView.el);
    },

    article: function(articleSlug) {

        this.articleDirectoryView.selectedArticleSlug = articleSlug;

        console.log("article");

        this.articleList();
    },

    poisonList: function() {
        $("#app").html(this.poisonDirectoryView.el);
    },

    poison: function(poisonSlug) {

        this.poisonDirectoryView.selectedPoisonSlug = poisonSlug;

        this.poisonList();
    },

    batchRetrieve: function (startIndex) {
        self = this;
        var limit = 15;

        var query = new Parse.Query(Poison);
        query.skip(startIndex);
        query.limit(limit);
        query.ascending("name");

        query.find({
            success: function(results) {
                if(startIndex == 0)
                    self.poisonCollection.add(results);
                else
                    self.poisonCollection.add(results);

                if(results.length == limit)
                    self.batchRetrieve(startIndex+limit);
                else {
                    $("#poison-spinner").remove();
                }
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