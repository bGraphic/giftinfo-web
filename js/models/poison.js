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

        return this.filter(function(poison){
			var name = poison.get("name").trim().toLowerCase();
			var tags = poison.get("tags");
			
			if(tags != null)
				tags = tags.toString().trim().toLowerCase();
			else
				tags = "";
			            
            filterString = filterString.trim().toLowerCase();

            return name.indexOf(filterString) > -1 || tags.indexOf(filterString) > -1;
        });
    }

});