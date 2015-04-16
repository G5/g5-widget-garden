(function() {
  var BusinessSchemaUpdater, ReviewFeedSource, ReviewTemplater;

  $(function() {
    var feedSource, fullReviewsConfig, hcardReviewsConfig, targetElement,
      _this = this;
    if ($('.promoted-reviews-config.full-review-config').length) {
      fullReviewsConfig = JSON.parse($('.promoted-reviews-config.full-review-config').html());
      feedSource = new ReviewFeedSource(fullReviewsConfig.review_api_url);
      $(feedSource).bind("feedReady", function(event) {
        return new ReviewTemplater(fullReviewsConfig.branded_name).update(feedSource.feed);
      });
    } else if ($('.promoted-reviews-config.hcard-review-config').length) {
      hcardReviewsConfig = JSON.parse($('.promoted-reviews-config.hcard-review-config').html());
      feedSource = new ReviewFeedSource(hcardReviewsConfig.review_api_url);
      targetElement = hcardReviewsConfig.insert_review_schema === "" ? ".contact-info" : hcardReviewsConfig.insert_review_schema;
      $(feedSource).bind("feedReady", function(event) {
        return new BusinessSchemaUpdater(targetElement, hcardReviewsConfig.review_page_url).update(feedSource.feed);
      });
    }
    return feedSource.getFeed();
  });

  ReviewFeedSource = (function() {
    function ReviewFeedSource(url) {
      this.url = url;
    }

    ReviewFeedSource.prototype.getFeed = function() {
      if (this.feedFromStorage()) {
        return $(this).trigger("feedReady");
      } else {
        return this.fetch();
      }
    };

    ReviewFeedSource.prototype.fetch = function() {
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

    ReviewFeedSource.prototype.feedFromStorage = function() {
      try {
        return this.feed = JSON.parse(sessionStorage.getItem(this.url));
      } catch (_error) {
        return null;
      }
    };

    ReviewFeedSource.prototype.storeFeed = function() {
      try {
        return sessionStorage.setItem(this.url, JSON.stringify(this.feed));
      } catch (_error) {
        return null;
      }
    };

    return ReviewFeedSource;

  })();

  BusinessSchemaUpdater = (function() {
    function BusinessSchemaUpdater(insert_review_schema, review_page_url) {
      this.insert_review_schema = insert_review_schema;
      this.review_page_url = review_page_url;
    }

    BusinessSchemaUpdater.prototype.update = function(feed) {
      if (feed.location.review_count > 0) {
        return $(this.insert_review_schema).append(this.schemaTemplate(feed.location));
      }
    };

    BusinessSchemaUpdater.prototype.schemaTemplate = function(location) {
      return "<div class=\"ratings-summary-outer\">\n  <div itemprop=\"aggregateRating\" itemscope itemtype=\"http://schema.org/AggregateRating\" class=\"rating ratings-summary\">\n    <span itemprop=\"ratingValue\" class=\"average-rating\"></span>\n    <a href=\"" + this.review_page_url + "\" class=\"total-reviews\">\n      <span itemprop=\"reviewCount\">(" + location.review_count + " reviews)</span>\n    </a>\n    <span class=\"gold-stars\" style=\"width:" + (Math.round(location.average_rating * 16)) + "px;\"></span>\n  </div>\n</div>";
    };

    return BusinessSchemaUpdater;

  })();

  ReviewTemplater = (function() {
    function ReviewTemplater(branded_name) {
      this.branded_name = branded_name;
    }

    ReviewTemplater.prototype.update = function(feed) {
      var review, _i, _len, _ref, _results;
      _ref = feed.reviews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        review = _ref[_i];
        _results.push($('#promoted-reviews').append(this.reviewTemplate(feed.location, review)));
      }
      return _results;
    };

    ReviewTemplater.prototype.reviewTemplate = function(location, review) {
      return "<div itemscope itemtype=\"http://schema.org/Review\" itemprop=\"review\" class=\"review\">\n  <div itemprop=\"reviewBody\" class=\"review-body\">" + review.excerpt + "</div>\n  <div itemprop=\"itemreviewed\" class=\"location-name\">" + this.branded_name + "</div>\n  <div itemprop=\"author\" itemscope itemtype=\"http://schema.org/Person\" class=\"author\">\n    Written by: <span itemprop=\"name\">" + review.author + "</span>\n    <span class=\"" + (this.classifyReputationSiteName(review.reputation_site_name)) + " via\">\n      via " + review.reputation_site_name + "\n    </span>\n  </div>\n  <div class=\"date\">\n    <meta itemprop=\"datePublished\" content=\"" + review.date + "\">Date published: " + review.date + "\n  </div>\n  <div itemprop=\"reviewRating\" itemscope itemtype=\"http://schema.org/Rating\" class=\"rating\">\n    <meta itemprop=\"worstRating\" content=\"1\"><span itemprop=\"ratingValue\">" + review.rating + "</span> / <span itemprop=\"bestRating\">" + location.out_of + "</span> stars\n    <span class=\"gold-stars\" style=\"width:" + (Math.round(review.rating * 16)) + "px;\"></span>\n  </div>\n</div>";
    };

    ReviewTemplater.prototype.classifyReputationSiteName = function(name) {
      return this.lowercaseFirstChar(name).replace(/[^0-9a-z]/i, '');
    };

    ReviewTemplater.prototype.lowercaseFirstChar = function(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    };

    return ReviewTemplater;

  })();

}).call(this);
