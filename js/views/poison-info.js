var PoisonInfoView = Parse.View.extend({
    tagName: "article",
    className: "info",

    template: _.template($('#poisonInfoTemplate').html()),

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

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});