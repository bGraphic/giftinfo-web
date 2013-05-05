var AppRouter = Parse.Router.extend({

    routes: {
        "":                 "home",
        ":seafoodKey":   "seafood"
    },

    home: function() {

        this.seafoodCollection = new SeafoodCollection();

        this.searchView =

        $("#app").html('<img id="seafood-spinner" src="img/spinner.gif">');
        $("#app").prepend(new SeafoodDirectoryView({model: this.seafoodCollection}).el);
        $("#filter").append(new SeafoodSearchDirectoryView({model: this.seafoodCollection, app: this}).el);

        this.batchRetrieve(0);

        $("article.info").hide();
        $(".seafood i.chevron").removeClass("icon-chevron-down");
        $(".seafood i.chevron").addClass("icon-chevron-right");
    },

    seafood: function(seafoodKey) {

        this.selectedKey = seafoodKey;

        if(!this.seafoodCollection) {
            this.home();
        }
        else
            this.openSelectedSeafood(false);
    },

    openSelectedSeafood: function(scroll) {

        if(!this.selectedKey)
            return;

        var seafood = this.seafoodCollection.getByKey(this.selectedKey);

        var seafoodInfoView = new SeafoodInfoView({
            model: seafood
        });

        $el = $(".seafood."+this.selectedKey).parent();

        if($el.children("article.info").length == 0)
            $el.append(seafoodInfoView.render().el);

        $el.children("article.info").show();
        $el.find(".seafood i.chevron").addClass("icon-chevron-down");
        $el.find(".seafood i.chevron").removeClass("icon-chevron-right");


        if(scroll) {

            $('html,body').animate({scrollTop: $el.offset().top});
        }

        this.selectedKey = null;
    },

    batchRetrieve: function (startIndex) {
        self = this;
        var limit = 15;

        var query = new Parse.Query(Seafood);
        query.skip(startIndex);
        query.limit(limit);
        query.ascending("name");

        query.find({
            success: function(results) {
                if(startIndex == 0)
                    self.seafoodCollection.add(results);
                else
                    self.seafoodCollection.add(results);

                if(results.length == limit)
                    self.batchRetrieve(startIndex+limit);
                else {
                    self.openSelectedSeafood(true);
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

    Parse.initialize("zdothuhw5y2TiDtKyOb20IHIAcWDIRuZwnCVjHIf", "o4vTVCro9Rwr7RbbKa8FTzVFwBOM1CipFDBBi9C2");

    var app = new AppRouter();
    Parse.history.start();

});