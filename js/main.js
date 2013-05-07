var AppRouter = Parse.Router.extend({

    routes: {
        "":                        "home",
        "om":                     "about",
        "info":             "articleList",
        "info/:articleSlug":    "article",
        "liste":             "poisonList",
        "gift/:poisonSlug":      "poison"
    },

    initialize: function () {

        this.poisonCollection = new PoisonCollection();
        this.poisonDirectoryView = new PoisonDirectoryView({collection: this.poisonCollection});
        this.poisonSearchView = new PoisonSearchDirectoryView({collection: this.poisonCollection, app: this});

        $("#filter").append(this.poisonSearchView.el);

        var self = this;

        var query = new Parse.Query(Poison);
        query.ascending("name");
        query.limit(200);
        query.find({
            success: function(results) {
                 self.poisonCollection.reset(results);
                 console.log("Fetched " + results.length + " poisons");
            },
            error: function(error) {
                  console.log("Error: " + error.code + " " + error.message);
            }
        });

    },

    home: function() {
        Parse.history.navigate("info", true);
    },

    about: function() {
        this.article("om");
    },

    articleList: function () {
        var articleCollection = new ArticleCollection();

        var articleDirectoryViewMore = new ArticleDirectoryView({
            collection: new ArticleCollection(),
            sectionTitle: "Mer informasjon om:"
        });

        var articleDirectoryViewGeneralEmergency = new ArticleDirectoryView({
            collection: new ArticleCollection(),
            sectionTitle: "Generelle råd ved:"
        });

        self = this;

        articleCollection.fetch({
            success: function(collection) {
                $("#poison-spinner").remove();

                articleDirectoryViewMore.collection.reset([
                    articleCollection.getBySlug("forebygging"),
                    articleCollection.getBySlug("medisinsk-kull"),
                    articleCollection.getBySlug("brekninger"),
                    articleCollection.getBySlug("bevisstloshet")
                ]);

                articleDirectoryViewGeneralEmergency.collection.reset([
                    articleCollection.getBySlug("svelging"),
                    articleCollection.getBySlug("hudkontakt"),
                    articleCollection.getBySlug("sol-i-oyet"),
                    articleCollection.getBySlug("innanding")]);
            },
            error: function(collection, error) {
                console.warn("Error: " + error);
            }
        });

        $("#app").html("");
        $("#app").append(articleDirectoryViewGeneralEmergency.el);
        $("#app").append(articleDirectoryViewMore.el);
    },

    article: function(articleSlug) {

        var query = new Parse.Query(Article);
        query.equalTo("slug", articleSlug);
        query.first({
            success: function(article) {
                var articleView = new ArticleView({
                    model: article
                });
                $("#poison-spinner").remove();
                $("#app").html(articleView.render().el);
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },

    poisonList: function() {
        $("#app").html(this.poisonDirectoryView.el);
    },

    poison: function(poisonSlug) {

        var query = new Parse.Query(Poison);
        query.equalTo("slug", poisonSlug);
        query.first({
            success: function(poison) {
                var poisonView = new PoisonView({
                    model: poison
                });
                $("#poison-spinner").remove();
                $("#app").html(poisonView.render().el);
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
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