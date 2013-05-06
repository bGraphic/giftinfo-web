var PoisonDirectoryView = Parse.View.extend({
    tagName: "ul",
    id: "poison-collection",
    className: "nav nav-tabs nav-stacked",

    initialize: function () {
        var self = this;

        _.bindAll(this, 'addPoisons', 'addOnePoison', 'resetPoisons');

        this.model.bind("add", this.addPoisons);
        this.model.bind("reset", this.resetPoisons);

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
    }
});

var PoisonListItemView = Parse.View.extend({
    tagName: "li",

    template: _.template($('#poisonItemTemplate').html()),

    events: {
        "click a.poison" : "togglePoisonInfo"
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    togglePoisonInfo: function () {

        if(this.$el.children("article.info")) {
            this.$el.children("article.info").toggle();
            this.$el.find(".poison i.chevron").toggleClass("icon-chevron-down");
            this.$el.find(".poison i.chevron").toggleClass("icon-chevron-right");
        }
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
        var filter = this.$el.find("input").val();

        if(!this.originalPoisonCollection)
            this.originalPoisonCollection = new PoisonCollection().reset(this.model.toJSON())

        if(filter.trim() != "")
            this.model.reset(this.originalPoisonCollection.filterByString(filter).toJSON());
        else
            this.model.reset(this.originalPoisonCollection.toJSON());

        if(this.model.length == 1) {

            console.log("search single slug " + this.app.selectedSlug);

            this.app.openSelectedPoison(false);
        }


    },

    render: function () {

        this.$el.html(this.template());


        return this;
    }

});