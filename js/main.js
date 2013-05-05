var AppRouter = Parse.Router.extend({

    routes: {
        "":                 "home",
        ":poisonSlug":   "poison"
    },

    home: function() {

        this.poisonCollection = new PoisonCollection();

        $("#app").html('<img id="seafood-spinner" src="img/spinner.gif">');
        $("#app").prepend(new PoisonDirectoryView({model: this.poisonCollection}).el);
        $("#filter").append(new PoisonSearchDirectoryView({model: this.poisonCollection, app: this}).el);

        this.batchRetrieve(0);

        $("article.info").hide();
        $(".seafood i.chevron").removeClass("icon-chevron-down");
        $(".seafood i.chevron").addClass("icon-chevron-right");
    },

    poison: function(poisonSlug) {

        console.log("Poison slug: "+ poisonSlug);

        this.selectedSlug = poisonSlug;

        if(!this.poisonCollection) {
            this.home();
        }
        else
            this.openSelectedPoison(false);
    },

    openSelectedPoison: function(scroll) {

        console.log("open poison, slected: " + this.selectedSlug);

        if(!this.selectedSlug)
            return;


        var poison = this.poisonCollection.getBySlug(this.selectedSlug);

        console.log("posion " + poison);

        var poisonInfoView = new PoisonInfoView({
            model: poison
        });

        $el = $(".seafood."+this.selectedSlug).parent();

        if($el.children("article.info").length == 0)
            $el.append(poisonInfoView.render().el);

        $el.children("article.info").show();
        $el.find(".seafood i.chevron").addClass("icon-chevron-down");
        $el.find(".seafood i.chevron").removeClass("icon-chevron-right");


        if(scroll) {

            $('html,body').animate({scrollTop: $el.offset().top});
        }

        this.selectedSlug = null;
    },

    batchRetrieve: function (startIndex) {
        self = this;
        var limit = 15;

        var query = new Parse.Query(Poison);
        query.skip(startIndex);
        query.limit(limit);
        query.ascending("title");

        query.find({
            success: function(results) {
                if(startIndex == 0)
                    self.poisonCollection.add(results);
                else
                    self.poisonCollection.add(results);

                if(results.length == limit)
                    self.batchRetrieve(startIndex+limit);
                else {
                    self.openSelectedPoison(true);
                    $("#seafood-spinner").remove();
                }
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    }

});


$(function() {
    $('body').popover({
        selector: '[data-toggle="popover"]',
        html: true,
        placement: 'top'
    });

    Parse.$ = jQuery;

    Parse.initialize("shC8z7Gd5GkJdtubJqdk6fIvFSXk7vnfYaZCBTD4", "vNDVdJnP7rKCxfIm7QfWROrgvbeg1T6844CCoW0o");

    var app = new AppRouter();
    Parse.history.start();

});