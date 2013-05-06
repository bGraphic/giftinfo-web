var PoisonDirectoryView = Parse.View.extend({
    tagName: "ul",
    className: "directory nav nav-tabs nav-stacked",

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
        this.$el.html("");
        newCollection.each(this.addOnePoison);
    },

    addOnePoison: function (poison) {
        var poisonView = new PoisonListItemView({
            model: poison
        });

        this.$el.append(poisonView.render().el);

        if(this.collection.length == 1)
            poisonView.togglePoisonInfo();
    }
});

var PoisonListItemView = Parse.View.extend({
    tagName: "li",

    template: _.template($('#poisonItemTemplate').html()),

    events: {
        "click a.item" : "togglePoisonInfo"
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    togglePoisonInfo: function () {

        var poisonView = new PoisonView({
            model: this.model
        });

        if(this.$el.children("article.info").length == 0)
            this.$el.append(poisonView.render().el);

        if(this.$el.children("article.info")) {
            this.$el.children("article.info").toggle();
            this.$el.find(".item i.chevron").toggleClass("icon-chevron-down");
            this.$el.find(".item i.chevron").toggleClass("icon-chevron-right");
        }

        if(this.$el.children("article.info").is(":hidden"))
            Parse.history.navigate("liste");
        else
            Parse.history.navigate(this.model.get("slug"));
    }
});

var PoisonView = Parse.View.extend({
    tagName: "article",
    className: "info",

    template: _.template($('#poisonTemplate').html()),

    initialize:function () {
        this.parent = this.options.parent;
    },

    render: function () {

        if(this.parent) {

            this.model.set("use_coal", this.parent.get("use_coal"));
            this.model.set("risk", this.parent.get("risk"));
            this.model.set("symptoms", this.parent.get("symptoms"));
            this.model.set("action", this.parent.get("action"));
            this.model.set("content", this.parent.get("content"));
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

var PoisonSearchDirectoryView = Parse.View.extend({
    el: "#filter",

    template: _.template($('#poisonSearchTemplate').html()),

    events: {
        'keyup' : 'filterCollection'
    },

    initialize:function () {
        _.bindAll(this, 'filterCollection');

        this.app = this.options.app;
        this.render();

    },

    filterCollection: function () {

        Parse.history.navigate("liste");

        var filter = this.$el.find("input").val();

        if(!this.originalPoisonCollection)
            this.originalPoisonCollection = new PoisonCollection().reset(this.collection.toJSON())

        if(filter.trim() != "")
            this.collection.reset(this.originalPoisonCollection.filterByString(filter).toJSON());
        else
            this.collection.reset(this.originalPoisonCollection.toJSON());

        this.app.poisonList();

    },

    render: function () {

        this.$el.html(this.template());

        return this;
    }

});