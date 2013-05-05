var SeafoodDirectoryView = Parse.View.extend({
    tagName: "ul",
    id: "seafood-collection",
    className: "nav nav-tabs nav-stacked",

    initialize: function () {
        var self = this;

        _.bindAll(this, 'addSeafoods', 'addOneSeafood', 'resetSeafoods');

        this.model.bind("add", this.addSeafoods);
        this.model.bind("reset", this.resetSeafoods);

    },

    addSeafoods: function (seafoods) {
        if(seafoods instanceof Array)
            seafoods.each(this.addOneSeafood);
        else
            this.addOneSeafood(seafoods);

    },

    resetSeafoods: function (newCollection) {
        this.$el.html("");
        newCollection.each(this.addOneSeafood);
    },

    addOneSeafood: function (seafood) {
        var seafoodView = new SeafoodListItemView({
            model: seafood
        });
        this.$el.append(seafoodView.render().el);
    }
});

var SeafoodListItemView = Parse.View.extend({
    tagName: "li",

    template: _.template($('#seafoodItemTemplate').html()),

    events: {
        "click a.seafood" : "toggleSeafoodInfo"
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    toggleSeafoodInfo: function () {

        if(this.$el.children("article.info")) {
            this.$el.children("article.info").toggle();
            this.$el.find(".seafood i.chevron").toggleClass("icon-chevron-down");
            this.$el.find(".seafood i.chevron").toggleClass("icon-chevron-right");
        }
    }
});

var SeafoodSearchDirectoryView = Parse.View.extend({
    el: "#filter",

    template: _.template($('#seafoodSearchTemplate').html()),

    events: {
        'keyup' : 'filterCollection'
    },

    initialize:function () {
        _.bindAll(this, 'filterCollection');

        this.app = this.options.app;
        this.render();

    },

    filterCollection: function () {
        var filter = this.$el.find("input").val();

        if(!this.originalSeafoodCollection)
            this.originalSeafoodCollection = new SeafoodCollection().reset(this.model.toJSON())

        if(filter.trim() != "")
            this.model.reset(this.originalSeafoodCollection.filterByString(filter).toJSON());
        else
            this.model.reset(this.originalSeafoodCollection.toJSON());

        if(this.model.length == 1) {

            console.log("length == 1");
            this.app.selectedKey = this.model.at(0).get("key");
            this.app.openSelectedSeafood(false);
        }


    },

    render: function () {

        this.$el.html(this.template());


        return this;
    }

});