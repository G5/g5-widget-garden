(function() {
  var walkscoreInitializer;

  $(function() {
    var walkFeedVars, walkscoreFeed;
    walkFeedVars = walkFeedVarsConfig;
    if (walkFeedVars.walkscore_client.length > 1) {
      return walkscoreFeed = new walkscoreInitializer(walkFeedVars);
    }
  });

  walkscoreInitializer = (function() {
    var getpage, walkscoreBadgeBuilder;

    function walkscoreInitializer(walkFeedVars) {
      return getpage(walkFeedVars);
    }

    getpage = function(walkFeedVars) {
      var _this = this;
      return $.ajax({
        url: "//g5-social-feed-service.herokuapp.com/walkscore-feed/" + walkFeedVars.walkscore_client + "/" + walkFeedVars.walkscore_location,
        dataType: 'json',
        success: function(data) {
          if (data !== null) {
            return walkscoreBadgeBuilder(data);
          }
        }
      });
    };

    walkscoreBadgeBuilder = function(dataFeed) {
      var walkscoreBlock;
      if (dataFeed !== []) {
        walkscoreBlock = "<a href=\"" + dataFeed.ws_link + "\" target=\"_blank\">\n <img src=\"" + dataFeed.logo_url + "\" alt=\"Walkscore Logo\"/>\n   <span>" + dataFeed.walkscore + "</span>\n</a>";
        return $('.walkscore-listing').append(walkscoreBlock);
      }
    };

    return walkscoreInitializer;

  })();

}).call(this);
