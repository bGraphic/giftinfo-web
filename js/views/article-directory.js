var ArticleDirectoryView = Parse.View.extend({
    tagName: "ul",
    className: "directory nav nav-tabs nav-stacked",

    initialize: function () {
        var self = this;

        _.bindAll(this, 'addArticles', 'addOneArticle', 'resetArticles');

        this.collection.bind("add", this.addArticles);
        this.collection.bind("reset", this.resetArticles);

    },

    addArticles: function (article) {
        if(article instanceof Array)
            article.each(this.addOneArticle);
        else
            this.addOneArticle(article);

    },

    resetArticles: function (newCollection) {
        this.$el.html("");
        newCollection.each(this.addOneArticle);
    },

    addOneArticle: function (article) {

        var articleView = new ArticleListItemView({
            model: article
        });

        this.$el.append(articleView.render().el);

        if(article.get("slug") == this.selectedArticleSlug)
        {

            console.log("test");
            articleView.toggleArticleInfo();
            $('html,body').animate({scrollTop: articleView.$el.offset().top});
        }

        this.selectedArticleSlug = null;
    }
});

var ArticleListItemView = Parse.View.extend({
    tagName: "li",

    template: _.template($('#articleItemTemplate').html()),

    events: {
        "click a.item" : "toggleArticleInfo"
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    toggleArticleInfo: function () {

        var articleView = new ArticleView({
            model: this.model
        });

        if(this.$el.children("article.info").length == 0)
            this.$el.append(articleView.render().el);

        if(this.$el.children("article.info")) {
            this.$el.children("article.info").toggle();
            this.$el.find(".item i.chevron").toggleClass("icon-chevron-down");
            this.$el.find(".item i.chevron").toggleClass("icon-chevron-right");
        }

        if(this.$el.children("article.info").is(":hidden"))
            Parse.history.navigate("info");
        else
            Parse.history.navigate("info/" + this.model.get("slug"));
    }
});

var ArticleView = Parse.View.extend({
    tagName: "article",
    className: "info",

    template: _.template($('#articleTemplate').html()),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});