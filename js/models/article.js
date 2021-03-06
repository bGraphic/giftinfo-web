var Article = Parse.Object.extend("Article", {

});

var ArticleCollection = Parse.Collection.extend({
    model: Article,

    initialize: function() {
        _.bindAll(this, 'getBySlug');
    },

    getBySlug: function(slug) {

        var object;

        this.each(function (objectInArray) {

                if(objectInArray.get("slug").trim() == slug.trim()) {
                    object = objectInArray;
                }
            }
        );

        return object;
    }
});