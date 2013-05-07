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

        $("#app").after('<img id="poison-spinner" src="img/spinner.gif">');

        this.poisonCollection = new PoisonCollection();
        this.poisonDirectoryView = new PoisonDirectoryView({collection: this.poisonCollection});
        this.poisonSearchView = new PoisonSearchDirectoryView({collection: this.poisonCollection, app: this});

        $("#filter").append(this.poisonSearchView.el);

        this.batchRetrieve(0);
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