var PoisonInfoView = Parse.View.extend({
    tagName: "article",
    className: "info",

    template: _.template($('#poisonInfoTemplate').html()),

    render: function () {

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});