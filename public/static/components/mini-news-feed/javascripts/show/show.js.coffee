# Start Here: Get widget configs, build
# initial view, and set up click listener
# ******************************************

$ ->
  configs = JSON.parse($('#mini-news-feed-config').html())

  feedURL = "#{configs.newsServiceDomain}/locations/#{configs.locationURN}/news_feed.json"
  feedSource = new MiniNewsFeedSource(feedURL)
  $(feedSource).bind("feedReady", (event) =>
    new NewsLinkBuilder(configs, feedSource.feed) )

  feedSource.getFeed()
  new MiniNewsFeedWidthChecker()


# Build out markup for posts links
# ******************************************

class NewsLinkBuilder
  constructor: (@configs, @feed) ->
    @populateFeed()

  populateFeed: () ->
    postCount = parseInt(@configs.numberOfPosts)
    postCount = 3 if isNaN(postCount)

    websitePosts = @feed[0...postCount]
    markup = []

    for post, index in websitePosts
      markup.push( "<div class='news-item-preview'>
                      #{@imageMarkup(post)}
                      <h3 class='post-title'>#{post.title}</h3>
                      #{@postDetails(post)}
                      <div class='post-description'>#{post.description}</div>
                      <a class='news-item-link' href='#{@configs.newsPagePath}?article-index=#{index}' data-post-index='#{index}'>
                        Read More<span class='nav-bling'> ></span>
                      </a>
                    </div>" )

    markup.push(" <div class='all-news'>
                    <a class='all-news-link' href='#{@configs.newsPagePath}'>
                      See More News<span class='nav-bling'> ></span>
                    </a>
                  </div> ")

    $('.mini-news-feed-widget').append(markup.join(''))

  postDetails: (post) ->
    markup =  " <div class='post-details'>"
    markup += "<span class='post-date'>#{post.pretty_date}</span>"
    markup += "<span class='divider'> | </span><span class='post-author'>by #{post.author}</span>" unless post.author == ""
    markup += "</div>"

  imageMarkup: (post) ->
    markup = ""
    if @configs.displayPhotos == "true"
      image = post.image
      image = @configs.defaultImage if image == ""
      imageElement = "<img src='#{image}' />" if image != ""
      markup = "<div class='post-image-wrapper'><div>#{imageElement}</div></div>" if imageElement

    markup

# Get news feed from service or session storage
# *********************************************

class MiniNewsFeedSource
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

class MiniNewsFeedWidthChecker
  constructor: () ->
    @applyWidthClasses()

    $( window ).resize () =>
      @applyWidthClasses()

  applyWidthClasses: () ->
    container = $("#mini-news-feed-widget")
    width = container.width()

    if width <= 590
      container.removeClass("wide").addClass("narrow")
    else
      container.removeClass("narrow").addClass("wide")
