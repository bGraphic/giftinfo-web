var Poison = Parse.Object.extend("Poison", {

});

var PoisonCollection = Parse.Collection.extend({
    model: Poison,

    initialize: function() {
        _.bindAll(this, 'getBySlug');
    },

    getBySlug: function(slug) {

        var myPoison;

        this.each(function (poison) {

                if(poison.get("slug").trim() == slug.trim()) {
                    myPoison = poison;
                }
            }
        );

        return myPoison;
    },

    filterByString: function(filterString) {

        var myPoisons = new PoisonCollection();
        filterString = filterString.trim().toLowerCase();

        this.each(function (poison) {
                var name = poison.get("name").trim().toLowerCase();
                var tags = poison.get("tags");

                if(name.indexOf(filterString) > -1) {
                    myPoisons.add(poison);
                }
            }
        );

        return myPoisons;
    }

});