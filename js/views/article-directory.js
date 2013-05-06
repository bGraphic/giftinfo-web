var ArticleDirectoryView = Parse.View.extend({
    tagName: "ul",
    className: "directory nav nav-tabs nav-stacked",

    initialize: function () {
        var self = this;

        _.bindAll(this, 'addArticles', 'addOneArticle', 'resetArticles');

        this.model.bind("add", this.addArticles);
        this.model.bind("reset", this.resetArticles);

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

        if(this.$el.children("article.info")) {
            this.$el.children("article.info").toggle();
            this.$el.find(".item i.chevron").toggleClass("icon-chevron-down");
            this.$el.find(".item i.chevron").toggleClass("icon-chevron-right");
        }
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