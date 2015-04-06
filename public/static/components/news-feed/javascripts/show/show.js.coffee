# Start Here: Get widget configs, build
# initial view, and set up click listener
# ******************************************

$ ->
  configs = JSON.parse($('#news-feed-config').html())

  feedURL = "#{configs.newsServiceDomain}/locations/#{configs.locationURN}/news_feed.json"
  feedSource = new NewsFeedSource(feedURL)
  $(feedSource).bind("feedReady", (event) =>
    new NewsFeedBuilder(configs, feedSource.feed)
    toggleListener = new ToggleListener(configs, feedSource.feed)
    selectedArticle = new QueryParameter("article-index").value()

    if selectedArticle
      postIndex = parseInt(selectedArticle)
      toggleListener.clearAllPosts()
      singleArticleView = new SingleArticleView(postIndex, configs, feedSource.feed)
      singleArticleView.buildSelectedPost()

    else if configs.uiType == "full-page"
      toggleListener.fullViewListener()

    else
      toggleListener.basicListener())

  feedSource.getFeed()
  new NewsFeedWidthChecker()


# Build out markup for initial list of posts
# ******************************************

class NewsFeedBuilder
  constructor: (@configs, @feed) ->
    @populateFeed()

  populateFeed: () ->
    postCount = parseInt(@configs.numberOfPosts)
    postCount = 5 if isNaN(postCount)

    websitePosts = @feed[0...postCount]
    markup = []

    for post, index in websitePosts
      markup.push( "<div class='news-feed-post #{@activeClass(index)}'>
                      #{@toggleMarkup(post, index)}
                      #{@detailsMarkup(post)}
                      <div class='post-body'>#{post.text}</div>
                      #{@bottomToggles(index)}
                    </div>" )

    $('.news-feed-widget').append(markup.join(''))

  toggleMarkup: (post, index) ->
    toggle  = "<a class='post-toggle' href='#' data-post-index='#{index}'>"
    toggle += "  <img src='#{post.image}' />" unless post.image == "" || @configs.displayPhotos != "true"
    toggle += "  <h3 class='post-title'>#{post.title}</h3>" unless post.title == ""
    toggle += "</a>"

  bottomToggles: (index) ->
    toggles  = "<a class='post-toggle toggle-button post-expand' href='#' data-post-index='#{index}'>Read More</a>"
    toggles += "<a class='post-toggle toggle-button post-collapse' href='#'>Hide This</a>" if @configs.uiType != "full-page"
    toggles

  detailsMarkup: (post) ->
    details  = "<span class='post-date'>#{post.pretty_date}</span>" unless post.title == ""
    details += "<span>|</span><span class='post-author'>by #{post.author}</span>" unless post.author == ""
    details += "<div class='post-description'>#{post.description}</div>" unless post.description == ""
    details

  activeClass: (index) ->
    if index == 0
      ""
    else
      ""

# Build markup for selected item
# ******************************************

class SingleArticleView
  constructor: (@postIndex, @configs, @feed) ->
    @postIndex = 0 if typeof @feed[@postIndex] == 'undefined'

  buildSelectedPost: () ->
    post = @feed[@postIndex]
    postMarkup = "<div class='news-feed-single-post'>
                    #{@imageMarkup(post)}
                    <h3 class='post-title'>#{post.title}</h3>
                    <span class='post-date'>#{post.pretty_date}</span>
                    #{@authorMarkup(post)}
                    <div class='post-body'>#{post.text}</div>
                    <div class='posts-nav'>
                      #{@previousButton()}
                      <a href='#' class='all-posts'>See More News<span class='nav-bling'> ></span></a>
                      #{@nextButton()}
                    </div>
                  </div>"

    $('.news-feed-widget').append(postMarkup)

    toggleListener = new ToggleListener(@configs, @feed)
    toggleListener.fullViewListener()
    toggleListener.listViewListener()

  nextButton: () ->
    if @postIndex < @feed.length - 1
      linkIndex = @postIndex + 1
      " <a href='#' data-post-index='#{linkIndex}' class='post-toggle next-post'>
          <div class='post-nav-top'>
            <span>Next</span>
            <span class='nav-bling'> ></span>
          </div>
          <div>
            #{@navImageMarkup(@feed[linkIndex])}
            <div class='post-title'>#{@feed[linkIndex].title}</div>
            <div class='post-date'>#{@feed[linkIndex].pretty_date}</div>
            #{@authorMarkup(@feed[linkIndex])}
          </div>
        </a>"
    else
      ""

  imageMarkup: (post) ->
    if @configs.displayPhotos == "true" && post.image != ""
      "<img src='#{post.image}' />"
    else
      ""

  authorMarkup: (post) ->
    if post.author != ""
      "<span class='author-divider'>|</span><span class='post-author'>by #{post.author}</span>"
    else
      ""

  previousButton: () ->
    if @postIndex > 0
      linkIndex = @postIndex - 1
      " <a href='#' data-post-index='#{linkIndex}' class='post-toggle previous-post'>
          <div class='post-nav-top'>
            <span class='nav-bling'>< </span>
            <span>Previous</span>
          </div>
          <div>
            #{@navImageMarkup(@feed[linkIndex])}
            <div class='post-title'>#{@feed[linkIndex].title}</div>
            <div class='post-date'>#{@feed[linkIndex].pretty_date}</div>
            #{@authorMarkup(@feed[linkIndex])}
          </div>
        </a>"
    else
      ""
  navImageMarkup: (post) ->
    markup = ""
    if @configs.displayPhotos == "true"
      image = post.image
      image = @configs.defaultImage if image == ""
      imageElement = "<img src='#{image}' />" if image != ""
      markup = "<div class='post-image-wrapper'><div>#{imageElement}</div></div>" if imageElement

    markup


# Choose type of listener based on UI type
# ******************************************

class ToggleListener
  constructor: (@configs, @feed) ->
    @selectedArticle = new QueryParameter("article-index").value()

  basicListener: () ->
    $('.post-toggle').click ->
      $(this).siblings(".post-description, .post-body").slideToggle()
      $(this).parent().toggleClass("active-post")
      false

  fullViewListener: () ->
    that = this
    $('.post-toggle').click ->
      postIndex = $(this).data("post-index")
      that.clearAllPosts()
      singleArticleView = new SingleArticleView(postIndex, that.configs, that.feed)
      singleArticleView.buildSelectedPost()
      false

  listViewListener: () ->
    that = this
    $('.all-posts').click ->
      that.clearAllPosts()
      new NewsFeedBuilder(that.configs, that.feed)
      toggleListener = new ToggleListener(that.configs, that.feed)
      toggleListener.fullViewListener()
      false

  clearAllPosts: () ->
    $(".news-feed-single-post, .news-feed-post").remove()

    $('html, body').animate({
      scrollTop: $("#news-feed-top").offset().top
    }, 420)

# Get news feed from service or session storage
# *********************************************

class NewsFeedSource
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

# Pseudo Media Query
# ******************************************

class NewsFeedWidthChecker
  constructor: () ->
    @applyWidthClasses()

    $( window ).resize () =>
      @applyWidthClasses()

  applyWidthClasses: () ->
    container = $("#news-feed-widget")
    width = container.width()

    if width <= 460
      container.removeClass("wide").addClass("narrow")
    else
      container.removeClass("narrow").addClass("wide")

# Find a query param if it exists
# ******************************************

class QueryParameter
  constructor: (@param) ->

  value: () ->
    name = @param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    regex = new RegExp("[\\?&]#{name}=([^&#]*)")
    results = regex.exec(location.search);
    if results == null
      false
    else
      decodeURIComponent(results[1].replace(/\+/g, " "))
