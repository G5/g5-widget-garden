(function() {
  var BlogFetcher, facebookFeedBuilder, facebookInitializer, googlePlusFeedBuilder, googlePlusInitializer, tabListener, tweetBuilder, tweetInitializer;

  $(function() {
    var blogConfig, facebookFeed, feedVars, googlePlusFeed;
    feedVars = JSON.parse($('#social-feed-config').html());
    if (feedVars.twitter_username.length > 1) {
      new tweetInitializer(feedVars);
    }
    if (feedVars.feed_url.length > 10) {
      blogConfig = new window.BlogConfig(feedVars);
      new window.BlogInterface($("#blog-feed .feed"), blogConfig);
    }
    if (feedVars.facebook_page_id.length > 1) {
      facebookFeed = new facebookInitializer(feedVars);
    }
    if (feedVars.google_plus_page_id.length > 1) {
      return googlePlusFeed = new googlePlusInitializer(feedVars);
    }
  });

  window.BlogConfig = (function() {
    function BlogConfig(config) {
      this.feed_url = config.feed_url, this.feedTitle = config.feedTitle, this.showAuthor = config.showAuthor, this.show_entry_summary = config.show_entry_summary, this.entries_to_show = config.entries_to_show;
    }

    return BlogConfig;

  })();

  BlogFetcher = (function() {
    function BlogFetcher(url) {
      this.url = url;
    }

    BlogFetcher.prototype.fetch = function() {
      var _this = this;
      return $.ajax({
        url: '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=3&callback=?&q=' + encodeURIComponent(this.url),
        dataType: 'json',
        success: function(data) {
          _this.feed = data.responseData.feed;
          return $(_this).trigger("feedReady");
        }
      });
    };

    return BlogFetcher;

  })();

  window.BlogInterface = (function() {
    function BlogInterface(list, config) {
      var fetcher,
        _this = this;
      this.list = list;
      this.config = config;
      fetcher = new BlogFetcher(this.config.feed_url);
      $(fetcher).bind("feedReady", function(event) {
        return _this.updateDom(event);
      });
      fetcher.fetch();
    }

    BlogInterface.prototype.updateDom = function(event) {
      var entry, feed, feedBlock, feedEntry, feedList, feedTab, innerText, _i, _len, _ref;
      feed = event.currentTarget.feed;
      feedList = "";
      _ref = feed.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        feedEntry = '<li class="h-entry hentry" itemscope itemtype="http://schema.org/BlogPosting">';
        innerText = " <a class='p-name entry-title u-url url' href='" + entry.link + "' target='_blank' itemprop='url'>                      <span itemprop='headline'>" + entry.title + "</span>                    </a>                    <br /> ";
        if (this.config.show_entry_summary) {
          innerText += "<p class='p-summary summary' itemprop='description'>" + entry.contentSnippet + "</p>";
        }
        if (this.config.showAuthor) {
          innerText += "<p class='p-author author' itemprop='author'>Posted By: " + entry.author + "</p>";
        }
        feedEntry += "" + innerText + "</li>";
        feedList += feedEntry;
      }
      feedTab = " <a class='feed-switch' id='feed-switch-blog' href='#blog-feed' title='Show Blog Feed'>                  <svg version='1.1' id='Layer_2' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='30px' height='30px' viewBox='0 0 200 200' enable-background='new 0 0 200 200' xml:space='preserve'>                    <path stroke-width='40' d='M0,22'/>                    <path stroke-width='40' d='M111,196.48C111,136.52,61.354,88,0,88'/>                    <path stroke-width='40' d='M181,196.48'/>                    <circle cx='27.5' cy='169.5' r='24.5'/>                    <path stroke-width='40' d='M181,196.48C181,100.039,100.045,22,0,22'/>                  </svg>                </a>";
      $('.feed-switcher').append(feedTab);
      feedBlock = " <div id='blog-feed' class='blog-feed feed-section' style='display: none;'>                    <ul class='h-feed feed'>" + feedList + "</ul>                  </div>";
      $('.social-feed').append(feedBlock);
      return new tabListener('#feed-switch-blog', '#blog-feed');
    };

    return BlogInterface;

  })();

  tweetInitializer = (function() {
    function tweetInitializer(feedVars) {
      var _this = this;
      $.ajax({
        url: "//g5-social-feed-service.herokuapp.com/twitter-feed/" + feedVars.twitter_username,
        dataType: "json",
        type: "GET",
        success: function(data) {
          if (data.length > 0) {
            return new tweetBuilder(data, feedVars);
          }
        }
      });
    }

    return tweetInitializer;

  })();

  tweetBuilder = (function() {
    var tweetTemplate;

    function tweetBuilder(data, feedVars) {
      var composedTweets, index, tweet, twitterBlock, twitterTab, _i, _len;
      composedTweets = [];
      for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
        tweet = data[index];
        if ((index + 1) > feedVars.tweet_count) {
          break;
        }
        composedTweets.push(tweetTemplate(tweet, feedVars));
      }
      twitterTab = "<a class='feed-switch' id='feed-switch-twitter' href='#twitter-feed' title='Show Tweets'>                    <svg enable-background='new 0 0 512 512' height='40' style='max-width:100%; max-height:100%;' version='1.1' viewBox='0 0 512 512' width='40' x='0px' xmlns='http://www.w3.org/2000/svg' y='0px'><path alt='twitter' class='social-feed-icon twitter-social-feed-icon' d='M462,128.223c-15.158,6.724-31.449,11.269-48.547,13.31c17.449-10.461,30.854-27.025,37.164-46.764 c-16.333,9.687-34.422,16.721-53.676,20.511c-15.418-16.428-37.386-26.691-61.698-26.691c-54.56,0-94.668,50.916-82.337,103.787 c-70.25-3.524-132.534-37.177-174.223-88.314c-22.142,37.983-11.485,87.691,26.158,112.85c-13.854-0.438-26.891-4.241-38.285-10.574 c-0.917,39.162,27.146,75.781,67.795,83.949c-11.896,3.237-24.926,3.978-38.17,1.447c10.754,33.58,41.972,58.018,78.96,58.699 C139.604,378.282,94.846,390.721,50,385.436c37.406,23.982,81.837,37.977,129.571,37.977c156.932,0,245.595-132.551,240.251-251.435 C436.339,160.061,450.668,145.174,462,128.223z'></path></svg>                  </a>";
      $('.feed-switcher').append(twitterTab);
      twitterBlock = "<div id='twitter-feed' class='twitter-feed feed-section' style='display:none;'>                      <ul class='tweet-list'>                        " + (composedTweets.join('')) + "                      </ul>                      <a class='btn' href='http://www.twitter.com/" + feedVars.twitter_username + "' href='#' target='_blank'>Read All</a>                    </div>";
      $('.social-feed').append(twitterBlock);
      new tabListener('#feed-switch-twitter', '#twitter-feed');
    }

    tweetTemplate = function(tweet, feedVars) {
      var avatar;
      avatar = feedVars.display_avatar ? "<span class='post-thumb'><img src='" + tweet.user.profile_image_url_https + "'/></span>" : "";
      return " <li>        " + avatar + "        <div><a href='https://twitter.com/" + tweet.user.screen_name + "' class='tweet-name author-name' target='_blank'> " + tweet.user.screen_name + " says:</a></div>        <span class='tweet-text'>" + tweet.text + "</span>      </li>";
    };

    return tweetBuilder;

  })();

  facebookInitializer = (function() {
    var getpage;

    function facebookInitializer(feedVars) {
      return getpage(feedVars);
    }

    getpage = function(feedVars) {
      var _this = this;
      return $.ajax({
        url: "//g5-social-feed-service.herokuapp.com/facebook-feed/" + feedVars.facebook_page_id,
        dataType: 'json',
        success: function(data) {
          if (data.hasOwnProperty('data') && data.data.length > 0) {
            return new facebookFeedBuilder(feedVars, data);
          }
        }
      });
    };

    return facebookInitializer;

  })();

  facebookFeedBuilder = (function() {
    var postTemplate;

    function facebookFeedBuilder(feedVars, dataFeed) {
      var facebookBlock, facebookFeedList, facebookTab, index, post, _i, _len, _ref;
      facebookTab = " <a class='feed-switch' id='feed-switch-facebook' href='#facebook-feed' title='Show Facebook Feed'>                      <svg enable-background='new 0 0 512 512' height='40' style='max-width:100%; max-height:100%;' version='1.1' viewBox='0 0 512 512' width='40' x='0px' xmlns='http://www.w3.org/2000/svg' y='0px'><path alt='facebook' class='social-feed-icon facebook-social-feed-icon' d='M204.067,184.692h-43.144v70.426h43.144V462h82.965V254.238h57.882l6.162-69.546h-64.044 c0,0,0-25.97,0-39.615c0-16.398,3.302-22.89,19.147-22.89c12.766,0,44.896,0,44.896,0V50c0,0-47.326,0-57.441,0 c-61.734,0-89.567,27.179-89.567,79.231C204.067,174.566,204.067,184.692,204.067,184.692z'></path></svg>                    </a>";
      $('.feed-switcher').append(facebookTab);
      facebookFeedList = [];
      _ref = dataFeed.data;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        post = _ref[index];
        if (typeof post.message === 'undefined') {
          feedVars.facebook_post_limit += 1;
          continue;
        }
        if ((index + 1) > feedVars.facebook_post_limit) {
          break;
        }
        facebookFeedList.push(postTemplate(post, feedVars));
      }
      facebookBlock = "<div id='facebook-feed' class='facebook-feed feed-section' style='display:none;'>                      <ul class='tweet-list'>                        " + (facebookFeedList.join('')) + "                      </ul>                    </div>";
      $('.social-feed').append(facebookBlock);
      new tabListener('#feed-switch-facebook', '#facebook-feed');
    }

    postTemplate = function(post, feedVars) {
      var avatar;
      avatar = feedVars.display_avatar && post.picture ? "<span class='post-thumb'><img src='" + post.picture + "'/></span>" : "";
      return " <li>        " + avatar + "        <div class='facebook-name tweet-name author-name'><a href='http://facebook.com/" + post.from.id + "' class='author-name' target='_blank'>" + post.from.name + " said:</a></div>        <div class='facebook-post'>" + post.message + "</div>      </li>";
    };

    return facebookFeedBuilder;

  })();

  googlePlusInitializer = (function() {
    var getpage;

    function googlePlusInitializer(feedVars) {
      return getpage(feedVars);
    }

    getpage = function(feedVars) {
      var _this = this;
      return $.ajax({
        url: "//g5-social-feed-service.herokuapp.com/google-plus-feed/" + feedVars.google_plus_page_id,
        dataType: 'json',
        success: function(data) {
          if (data.length > 0) {
            return new googlePlusFeedBuilder(feedVars, data);
          }
        }
      });
    };

    return googlePlusInitializer;

  })();

  googlePlusFeedBuilder = (function() {
    function googlePlusFeedBuilder(feedVars, dataFeed) {
      var googleBlock, googleFeedList, googleTab, index, post, _i, _len;
      googleTab = " <a class='feed-switch' id='feed-switch-google' href='#google-feed' title='Show Google Feed'>                    <svg enable-background='new 0 0 512 512' height='40' style='max-width:100%; max-height:100%;' version='1.1' viewBox='0 0 512 512' width='40' x='0px' xmlns='http://www.w3.org/2000/svg' y='0px'><path alt='google' class='social-feed-icon google-social-feed-icon' d='M462,141.347h-54.621v54.622h-27.311v-54.622h-54.622v-27.311h54.622V59.416h27.311v54.621H462V141.347z M307.583,367.26  c0,40.943-37.384,90.787-131.434,90.787C107.365,458.047,50,428.379,50,378.478c0-38.514,24.383-88.511,138.323-88.511 c-16.922-13.792-21.075-33.077-10.733-53.959c-66.714,0-100.879-39.222-100.879-89.023c0-48.731,36.242-93.032,110.15-93.032 c18.66,0,118.398,0,118.398,0l-26.457,27.77h-31.079c21.925,12.562,33.586,38.433,33.586,66.949 c0,26.175-14.413,47.375-34.983,63.279c-36.503,28.222-27.158,43.98,11.087,71.872C295.121,312.074,307.583,333.882,307.583,367.26 z M233.738,150.453c-5.506-41.905-32.806-76.284-64.704-77.243c-31.909-0.949-53.309,31.119-47.798,73.035 c5.509,41.905,35.834,71.178,67.749,72.139C220.882,219.333,239.242,192.363,233.738,150.453z M266.631,371.463 c0-34.466-31.441-67.317-84.192-67.317c-47.542-0.523-87.832,30.042-87.832,65.471c0,36.154,34.335,66.25,81.879,66.25 C237.267,435.866,266.631,407.617,266.631,371.463z'></path></svg>                  </a>";
      $('.feed-switcher').append(googleTab);
      this.postLimit = feedVars.google_plus_post_limit;
      googleFeedList = [];
      for (index = _i = 0, _len = dataFeed.length; _i < _len; index = ++_i) {
        post = dataFeed[index];
        if ((index + 1) > this.postLimit) {
          break;
        }
        googleFeedList.push(this.postTemplate(post.attributes, feedVars));
      }
      googleBlock = "<div id='google-feed' class='google-feed feed-section' style='display:none;'>                      <ul class='google-list'>                        " + (googleFeedList.join('')) + "                      </ul>                    </div>";
      $('.social-feed').append(googleBlock);
      new tabListener('#feed-switch-google', '#google-feed');
    }

    googlePlusFeedBuilder.prototype.postTemplate = function(post, feedVars) {
      var avatar;
      if (typeof post.object.content === 'undefined' || post.object.content === '') {
        this.postLimit += 1;
        return "";
      }
      avatar = feedVars.display_avatar ? "<span class='post-thumb'><img src='" + post.actor.image.url + "'/></span>" : "";
      return " <li>        " + avatar + "        <div class='google-name author-name'><a href='" + post.actor.url + "' class='author-name' target='_blank'>" + post.actor.displayName + " said:</a></div>        <div class='google-post'>" + post.object.content + "</div>      </li>";
    };

    return googlePlusFeedBuilder;

  })();

  tabListener = (function() {
    function tabListener(tab, block) {
      $('.social-feed').on('click', tab, function(e) {
        $('.social-feed .feed-switch').removeClass('active');
        $(this).addClass('active');
        $('.feed-section').css('display', 'none');
        $(block).css('display', 'block');
        return false;
      });
      if ($('.feed-switcher a').length === 1) {
        $(tab).addClass('active');
        $(block).css('display', 'block');
      }
    }

    return tabListener;

  })();

}).call(this);
