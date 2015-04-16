$ ->

  if $('.promoted-reviews-config.full-review-config').length
    # Populate #promoted-reviews with full content of reviews
    fullReviewsConfig = JSON.parse($('.promoted-reviews-config.full-review-config').html())
    feedSource = new ReviewFeedSource(fullReviewsConfig.review_api_url)
    $(feedSource).bind("feedReady", (event) =>
      new ReviewTemplater(fullReviewsConfig.branded_name).update(feedSource.feed))

  else if $('.promoted-reviews-config.hcard-review-config').length
    # Append stars and page link to contact-info widget
    hcardReviewsConfig = JSON.parse($('.promoted-reviews-config.hcard-review-config').html())
    feedSource = new ReviewFeedSource(hcardReviewsConfig.review_api_url)
    targetElement = if hcardReviewsConfig.insert_review_schema == "" then ".contact-info" else hcardReviewsConfig.insert_review_schema
    $(feedSource).bind("feedReady", (event) =>
      new BusinessSchemaUpdater(targetElement, hcardReviewsConfig.review_page_url).update(feedSource.feed))

  feedSource.getFeed()

class ReviewFeedSource
  constructor: (@url) ->

  getFeed: ->
    if @feedFromStorage()
      $(this).trigger("feedReady")
    else
      @fetch()

  fetch: ->
    $.ajax
      url: @url
      dataType: 'json'
      success: (data, status, xhr) =>
        @feed = data
        @storeFeed()
        $(this).trigger("feedReady")
      error: (xhr, status, error) =>

  feedFromStorage: ->
    try
      @feed = JSON.parse(sessionStorage.getItem(@url))
    catch
      null

  storeFeed: ->
    try
      sessionStorage.setItem(@url, JSON.stringify(@feed))
    catch
      null

class BusinessSchemaUpdater
  # Looks for specifed element (usually .contact-info), and inserts a link to the reviews page
  constructor: (@insert_review_schema, @review_page_url) ->

  update: (feed) ->
    $(@insert_review_schema).append(@schemaTemplate(feed.location)) if feed.location.review_count > 0

  schemaTemplate: (location) ->
    """
    <div class="ratings-summary-outer">
      <div itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating" class="rating ratings-summary">
        <span itemprop="ratingValue" class="average-rating"></span>
        <a href="#{@review_page_url}" class="total-reviews">
          <span itemprop="reviewCount">(#{location.review_count} reviews)</span>
        </a>
        <span class="gold-stars" style="width:#{Math.round(location.average_rating * 16)}px;"></span>
      </div>
    </div>
    """

class ReviewTemplater
  # Generates the full review markup
  constructor: (@branded_name) ->

  update: (feed) ->
    $('#promoted-reviews').append(@reviewTemplate(feed.location, review)) for review in feed.reviews

  reviewTemplate: (location, review) ->
    """
    <div itemscope itemtype="http://schema.org/Review" itemprop="review" class="review">
      <div itemprop="reviewBody" class="review-body">#{review.excerpt}</div>
      <div itemprop="itemreviewed" class="location-name">#{@branded_name}</div>
      <div itemprop="author" itemscope itemtype="http://schema.org/Person" class="author">
        Written by: <span itemprop="name">#{review.author}</span>
        <span class="#{@classifyReputationSiteName(review.reputation_site_name)} via">
          via #{review.reputation_site_name}
        </span>
      </div>
      <div class="date">
        <meta itemprop="datePublished" content="#{review.date}">Date published: #{review.date}
      </div>
      <div itemprop="reviewRating" itemscope itemtype="http://schema.org/Rating" class="rating">
        <meta itemprop="worstRating" content="1"><span itemprop="ratingValue">#{review.rating}</span> / <span itemprop="bestRating">#{location.out_of}</span> stars
        <span class="gold-stars" style="width:#{Math.round(review.rating * 16)}px;"></span>
      </div>
    </div>
    """

  classifyReputationSiteName: (name) ->
    @lowercaseFirstChar(name).replace(/[^0-9a-z]/i, '')

  lowercaseFirstChar: (string) ->
    string.charAt(0).toLowerCase() + string.slice(1);
