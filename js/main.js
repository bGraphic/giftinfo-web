var AppRouter = Parse.Router.extend({

    routes: {
        "":                        "home",
        "giftliste":         "poisonList",
        "gift/:poisonSlug":      "poison",
        "info/:articleSlug":    "article"
    },

    initialize: function () {

        $("#app").after('<img id="poison-spinner" src="img/spinner.gif">');

        this.articleCollection = new ArticleCollection();
        this.articleDirectoryView = new ArticleDirectoryView({model: this.articleCollection});

        self = this;

        this.articleCollection.fetch({
            success: function(collection) {
                $("#poison-spinner").remove();
                self.openSelectedArticle(true);
            },
            error: function(collection, error) {
                console.warn("Error: " + error);
            }
        });

        this.poisonCollection = new PoisonCollection();
        this.poisonDirectoryView = new PoisonDirectoryView({model: this.poisonCollection});
        this.poisonSearchView = new PoisonSearchDirectoryView({model: this.poisonCollection, app: this});

        $("#filter").append(this.poisonSearchView.el);

        this.batchRetrieve(0);
    },

    home: function() {

        this.articleList();

    },

    articleList: function () {
        $("#app").html(this.articleDirectoryView.el);
    },

    article: function(articleSlug) {

        console.log("Article slug: "+ articleSlug);

        this.selectedSlug = articleSlug;

        this.articleList();

        this.openSelectedArticle(false);
    },

    openSelectedArticle: function(scroll) {

        if(!this.selectedSlug)
            return;

        console.log("open article");

        var article = this.articleCollection.getBySlug(this.selectedSlug);

        console.log("Article by slug " + article);

        var articleView = new ArticleView({
            model: article
        });

        $el = $(".item."+this.selectedSlug).parent();

        if($el.children("article.info").length == 0)
            $el.append(articleView.render().el);

        $el.children("article.info").show();
        $el.find(".item i.chevron").addClass("icon-chevron-down");
        $el.find(".item i.chevron").removeClass("icon-chevron-right");


        if(scroll) {

            $('html,body').animate({scrollTop: $el.offset().top});
        }

        this.selectedSlug = null;
    },

    poisonList: function() {
        $("#app").html(this.poisonDirectoryView.el);
    },

    poison: function(poisonSlug) {

        console.log("Poison slug: "+ poisonSlug);

        this.selectedSlug = poisonSlug;

        this.openSelectedPoison(false);
    },

    openSelectedPoison: function(scroll) {

        if(!this.selectedSlug)
            return;

        this.poisonList();

        var poison = this.poisonCollection.getBySlug(this.selectedSlug);
        var parent = poison.get("parent");

        if(parent) {
            parent = this.poisonCollection.get(parent.id);
        }

        var poisonInfoView = new PoisonInfoView({
            model: poison,
            parent: parent
        });

        $el = $(".item."+this.selectedSlug).parent();

        if($el.children("article.info").length == 0)
            $el.append(poisonInfoView.render().el);

        $el.children("article.info").show();
        $el.find(".item i.chevron").addClass("icon-chevron-down");
        $el.find(".item i.chevron").removeClass("icon-chevron-right");


        if(scroll) {

            $('html,body').animate({scrollTop: $el.offset().top});
        }

        this.selectedSlug = null;
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
                    self.openSelectedPoison(true);
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
    $('body').popover({
        selector: '[data-toggle="popover"]',
        html: true,
        placement: 'top'
    });

    Parse.$ = jQuery;

    Parse.initialize("shC8z7Gd5GkJdtubJqdk6fIvFSXk7vnfYaZCBTD4", "vNDVdJnP7rKCxfIm7QfWROrgvbeg1T6844CCoW0o");

    var app = new AppRouter();
    Parse.history.start();

});