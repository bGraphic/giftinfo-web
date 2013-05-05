var SeafoodEnvStatusInfoView = Parse.View.extend({
    tagName: "div",
    className: "env-status",

    initialize: function() {

        this.configureTemplate(this.options.model.get("env_status"));
    },

    configureTemplate: function(status) {
        if(status)
            this.template = _.template($('#seafoodEnvStatusInfoTemplate').html());
        else
            this.template = _.template($('#seafoodEnvStatusNoneInfoTemplate').html());
    },

    render: function () {

        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }

});

var SeafoodBadgesView = Parse.View.extend({
    tagName: "div",
    className: "badges",

    template: _.template($('#seafoodBadgesInfoTemplate').html()),

    render: function () {
        if(this.model.has("badges")) {
            this.$el.html(this.template(this.model.toJSON()));
        }

        return this;
    }

});

var SeafoodPictureView = Parse.View.extend({
    tagName: "div",
    className: "picture",

    template: _.template($('#seafoodPictureInfoTemplate').html()),

    render: function () {
        if(this.model.has("img_src"))
            this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

});

var SeafoodInfoView = Parse.View.extend({
    tagName: "article",
    className: "info",

    template: _.template($('#seafoodInfoTemplate').html()),

    render: function () {

        this.$el.html(this.template(this.model.toJSON()));

        var envStatusView = new SeafoodEnvStatusInfoView({
            model: this.model
        });

        this.$el.append(envStatusView.render().el);

        var badgesView = new SeafoodBadgesView({
            model: this.model
        });

        this.$el.append(badgesView.render().el);

        var pictureView = new SeafoodPictureView({
            model: this.model
        });

        this.$el.append(pictureView.render().el);

        return this;
    }
});