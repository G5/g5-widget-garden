(function() {
  var NewsFeedBuilder, NewsFeedSource, NewsFeedWidthChecker, QueryParameter, SingleArticleView, ToggleListener;

  $(function() {
    var configs, feedSource, feedURL,
      _this = this;
    configs = JSON.parse($('#news-feed-config').html());
    feedURL = "" + configs.newsServiceDomain + "/locations/" + configs.locationURN + "/news_feed.json";
    feedSource = new NewsFeedSource(feedURL);
    $(feedSource).bind("feedReady", function(event) {
      var postIndex, selectedArticle, singleArticleView, toggleListener;
      new NewsFeedBuilder(configs, feedSource.feed);
      toggleListener = new ToggleListener(configs, feedSource.feed);
      selectedArticle = new QueryParameter("article-index").value();
      if (selectedArticle) {
        postIndex = parseInt(selectedArticle);
        toggleListener.clearAllPosts();
        singleArticleView = new SingleArticleView(postIndex, configs, feedSource.feed);
        return singleArticleView.buildSelectedPost();
      } else if (configs.uiType === "full-page") {
        return toggleListener.fullViewListener();
      } else {
        return toggleListener.basicListener();
      }
    });
    feedSource.getFeed();
    return new NewsFeedWidthChecker();
  });

  NewsFeedBuilder = (function() {
    function NewsFeedBuilder(configs, feed) {
      this.configs = configs;
      this.feed = feed;
      this.populateFeed();
    }

    NewsFeedBuilder.prototype.populateFeed = function() {
      var index, markup, post, postCount, websitePosts, _i, _len;
      postCount = parseInt(this.configs.numberOfPosts);
      if (isNaN(postCount)) {
        postCount = 5;
      }
      websitePosts = this.feed.slice(0, postCount);
      markup = [];
      for (index = _i = 0, _len = websitePosts.length; _i < _len; index = ++_i) {
        post = websitePosts[index];
        markup.push("<div class='news-feed-post " + (this.activeClass(index)) + "'>                      " + (this.toggleMarkup(post, index)) + "                      " + (this.detailsMarkup(post)) + "                      <div class='post-body'>" + post.text + "</div>                      " + (this.bottomToggles(index)) + "                    </div>");
      }
      return $('.news-feed-widget').append(markup.join(''));
    };

    NewsFeedBuilder.prototype.toggleMarkup = function(post, index) {
      var toggle;
      toggle = "<a class='post-toggle' href='#' data-post-index='" + index + "'>";
      if (!(post.image === "" || this.configs.displayPhotos !== "true")) {
        toggle += "  <img src='" + post.image + "' />";
      }
      if (post.title !== "") {
        toggle += "  <h3 class='post-title'>" + post.title + "</h3>";
      }
      return toggle += "</a>";
    };

    NewsFeedBuilder.prototype.bottomToggles = function(index) {
      var toggles;
      toggles = "<a class='post-toggle toggle-button post-expand' href='#' data-post-index='" + index + "'>Read More</a>";
      if (this.configs.uiType !== "full-page") {
        toggles += "<a class='post-toggle toggle-button post-collapse' href='#'>Hide This</a>";
      }
      return toggles;
    };

    NewsFeedBuilder.prototype.detailsMarkup = function(post) {
      var details;
      if (post.title !== "") {
        details = "<span class='post-date'>" + post.pretty_date + "</span>";
      }
      if (post.author !== "") {
        details += "<span>|</span><span class='post-author'>by " + post.author + "</span>";
      }
      if (post.description !== "") {
        details += "<div class='post-description'>" + post.description + "</div>";
      }
      return details;
    };

    NewsFeedBuilder.prototype.activeClass = function(index) {
      if (index === 0) {
        return "";
      } else {
        return "";
      }
    };

    return NewsFeedBuilder;

  })();

  SingleArticleView = (function() {
    function SingleArticleView(postIndex, configs, feed) {
      this.postIndex = postIndex;
      this.configs = configs;
      this.feed = feed;
      if (typeof this.feed[this.postIndex] === 'undefined') {
        this.postIndex = 0;
      }
    }

    SingleArticleView.prototype.buildSelectedPost = function() {
      var post, postMarkup, toggleListener;
      post = this.feed[this.postIndex];
      postMarkup = "<div class='news-feed-single-post'>                    " + (this.imageMarkup(post)) + "                    <h3 class='post-title'>" + post.title + "</h3>                    <span class='post-date'>" + post.pretty_date + "</span>                    " + (this.authorMarkup(post)) + "                    <div class='post-body'>" + post.text + "</div>                    <div class='posts-nav'>                      " + (this.previousButton()) + "                      <a href='#' class='all-posts'>See More News<span class='nav-bling'> ></span></a>                      " + (this.nextButton()) + "                    </div>                  </div>";
      $('.news-feed-widget').append(postMarkup);
      toggleListener = new ToggleListener(this.configs, this.feed);
      toggleListener.fullViewListener();
      return toggleListener.listViewListener();
    };

    SingleArticleView.prototype.nextButton = function() {
      var linkIndex;
      if (this.postIndex < this.feed.length - 1) {
        linkIndex = this.postIndex + 1;
        return " <a href='#' data-post-index='" + linkIndex + "' class='post-toggle next-post'>          <div class='post-nav-top'>            <span>Next</span>            <span class='nav-bling'> ></span>          </div>          <div>            " + (this.navImageMarkup(this.feed[linkIndex])) + "            <div class='post-title'>" + this.feed[linkIndex].title + "</div>            <div class='post-date'>" + this.feed[linkIndex].pretty_date + "</div>            " + (this.authorMarkup(this.feed[linkIndex])) + "          </div>        </a>";
      } else {
        return "";
      }
    };

    SingleArticleView.prototype.imageMarkup = function(post) {
      if (this.configs.displayPhotos === "true" && post.image !== "") {
        return "<img src='" + post.image + "' />";
      } else {
        return "";
      }
    };

    SingleArticleView.prototype.authorMarkup = function(post) {
      if (post.author !== "") {
        return "<span class='author-divider'>|</span><span class='post-author'>by " + post.author + "</span>";
      } else {
        return "";
      }
    };

    SingleArticleView.prototype.previousButton = function() {
      var linkIndex;
      if (this.postIndex > 0) {
        linkIndex = this.postIndex - 1;
        return " <a href='#' data-post-index='" + linkIndex + "' class='post-toggle previous-post'>          <div class='post-nav-top'>            <span class='nav-bling'>< </span>            <span>Previous</span>          </div>          <div>            " + (this.navImageMarkup(this.feed[linkIndex])) + "            <div class='post-title'>" + this.feed[linkIndex].title + "</div>            <div class='post-date'>" + this.feed[linkIndex].pretty_date + "</div>            " + (this.authorMarkup(this.feed[linkIndex])) + "          </div>        </a>";
      } else {
        return "";
      }
    };

    SingleArticleView.prototype.navImageMarkup = function(post) {
      var image, imageElement, markup;
      markup = "";
      if (this.configs.displayPhotos === "true") {
        image = post.image;
        if (image === "") {
          image = this.configs.defaultImage;
        }
        if (image !== "") {
          imageElement = "<img src='" + image + "' />";
        }
        if (imageElement) {
          markup = "<div class='post-image-wrapper'><div>" + imageElement + "</div></div>";
        }
      }
      return markup;
    };

    return SingleArticleView;

  })();

  ToggleListener = (function() {
    function ToggleListener(configs, feed) {
      this.configs = configs;
      this.feed = feed;
      this.selectedArticle = new QueryParameter("article-index").value();
    }

    ToggleListener.prototype.basicListener = function() {
      return $('.post-toggle').click(function() {
        $(this).siblings(".post-description, .post-body").slideToggle();
        $(this).parent().toggleClass("active-post");
        return false;
      });
    };

    ToggleListener.prototype.fullViewListener = function() {
      var that;
      that = this;
      return $('.post-toggle').click(function() {
        var postIndex, singleArticleView;
        postIndex = $(this).data("post-index");
        that.clearAllPosts();
        singleArticleView = new SingleArticleView(postIndex, that.configs, that.feed);
        singleArticleView.buildSelectedPost();
        return false;
      });
    };

    ToggleListener.prototype.listViewListener = function() {
      var that;
      that = this;
      return $('.all-posts').click(function() {
        var toggleListener;
        that.clearAllPosts();
        new NewsFeedBuilder(that.configs, that.feed);
        toggleListener = new ToggleListener(that.configs, that.feed);
        toggleListener.fullViewListener();
        return false;
      });
    };

    ToggleListener.prototype.clearAllPosts = function() {
      $(".news-feed-single-post, .news-feed-post").remove();
      return $('html, body').animate({
        scrollTop: $("#news-feed-top").offset().top
      }, 420);
    };

    return ToggleListener;

  })();

  NewsFeedSource = (function() {
    function NewsFeedSource(url) {
      this.url = url;
    }

    NewsFeedSource.prototype.getFeed = function() {
      if (this.feedFromStorage()) {
        return $(this).trigger("feedReady");
      } else {
        return this.fetch();
      }
    };

    NewsFeedSource.prototype.fetch = function() {
      var _this = this;
      return $.ajax({
        url: this.url,
        dataType: 'json',
        success: function(data, status, xhr) {
          _this.feed = data;
          _this.storeFeed();
          return $(_this).trigger("feedReady");
        },
        error: function(xhr, status, error) {}
      });
    };

    NewsFeedSource.prototype.feedFromStorage = function() {
      try {
        return this.feed = JSON.parse(sessionStorage.getItem(this.url));
      } catch (_error) {
        return null;
      }
    };

    NewsFeedSource.prototype.storeFeed = function() {
      try {
        return sessionStorage.setItem(this.url, JSON.stringify(this.feed));
      } catch (_error) {
        return null;
      }
    };

    return NewsFeedSource;

  })();

  NewsFeedWidthChecker = (function() {
    function NewsFeedWidthChecker() {
      var _this = this;
      this.applyWidthClasses();
      $(window).resize(function() {
        return _this.applyWidthClasses();
      });
    }

    NewsFeedWidthChecker.prototype.applyWidthClasses = function() {
      var container, width;
      container = $("#news-feed-widget");
      width = container.width();
      if (width <= 460) {
        return container.removeClass("wide").addClass("narrow");
      } else {
        return container.removeClass("narrow").addClass("wide");
      }
    };

    return NewsFeedWidthChecker;

  })();

  QueryParameter = (function() {
    function QueryParameter(param) {
      this.param = param;
    }

    QueryParameter.prototype.value = function() {
      var name, regex, results;
      name = this.param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      results = regex.exec(location.search);
      if (results === null) {
        return false;
      } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
      }
    };

    return QueryParameter;

  })();

}).call(this);
