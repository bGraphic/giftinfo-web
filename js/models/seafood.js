var Seafood = Parse.Object.extend("Seafood", {
    initialize: function() {
        _.bindAll(this, 'configureBadges');

        this.bind("change:badges", this.configureBadges);
    },

    configureBadges: function () {
        var self = this;

        this.set("krav", false);
        this.set("msc", false);

        var badges = this.get("badges");

        if(badges) {
            badges = badges.split(",");

            if(badges instanceof Array) {
                _.each(badges, function (badge) {
                    if(badge.trim() == "Krav")
                        self.set("krav", true);
                    if(badge.trim() == "MSC")
                        self.set("msc", true);
                });
            } else {
                if(badges.trim() == "Krav")
                    self.set("krav", true);
                if(badges.trim() == "MSC")
                    self.set("msc", true);
            }
        }
    }
});

var SeafoodCollection = Parse.Collection.extend({
    model: Seafood,

    initialize: function() {
        _.bindAll(this, 'getByKey');
    },

    getByKey: function(key) {

        var mySeafood;

        this.each(function (seafood) {

                if(seafood.get("key").trim() == key.trim()) {
                    mySeafood = seafood;
                }
            }
        );

        return mySeafood;
    },

    filterByString: function(filterString) {

        var mySeafoods = new SeafoodCollection();
        filterString = filterString.trim().toLowerCase();

        this.each(function (seafood) {
                var name = seafood.get("name").trim().toLowerCase();

                if(name.indexOf(filterString) > -1) {
                    mySeafoods.add(seafood);
                }
            }
        );

        return mySeafoods;
    }


});