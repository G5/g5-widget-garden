$ ->
  configs = JSON.parse($('#news-feed-config').html())

  feedURL = "#{configs.newsServiceDomain}/locations/#{configs.locationURN}/news_feed.json"
  feedSource = new NewsFeedSource(feedURL)
  $(feedSource).bind("feedReady", (event) =>
    new NewsFeedBuilder(configs, feedSource.feed)
    new ToggleListener(configs))
    

  feedSource.getFeed()

class NewsFeedBuilder
  constructor: (@configs, @feed) ->
    @populateFeed()

  populateFeed: () ->
    postCount = parseInt(@configs.numberOfPosts)
    postCount = 5 if isNaN(postCount)

    websitePosts = @feed[0...postCount]
    markup = []

    for post, index in websitePosts
      markup.push( "<div class='news-feed-post'>
                      #{@toggleMarkup(post)}
                      #{@detailsMarkup(post)}
                      <div class='post-body'>#{post.text}</div>
                      <a class='post-toggle post-expand' href='#' data-post-id='#{post.id}'>Read More</a>
                      <a class='post-toggle post-collapse' href='#'>Hide This</a>
                    </div>" )
      
    $('.news-feed-widget').append(markup.join(''))

  toggleMarkup: (post) ->
    toggle  = "<a class='post-toggle' href='#' data-post-id='#{post.id}'>"
    toggle += "  <img src='#{post.image}' />" unless post.image == ""
    toggle += "  <h3 class='post-title'>#{post.title}</h3>" unless post.title == ""
    toggle += "</a>"

  detailsMarkup: (post) ->
    details  = "<span class='post-date'>#{post.pretty_date}</span>" unless post.title == ""
    details += "<span>|</span><span class='post-author'>by #{post.author}</span>" unless post.author == ""
    details += "<div class='post-description'>#{post.description}</div>" unless post.description == ""

class SingleArticleView
  constructor: (@postID, @configs) ->
    @clearAllPosts()
    @buildSelectedPost()

  clearAllPosts: () ->
    $(".news-feed-post").remove()

  buildSelectedPost: () ->
    $('.news-feed-widget').append("<h1>Gigity ---- #{@postID}</h1>")
 


class ToggleListener
  constructor: (@configs) ->
    # @basicListener()
    @fullViewListener()

  basicListener: () ->
    $('.post-toggle').click ->
      $(this).parent().toggleClass("active-post")
      false

  fullViewListener: () ->
    that = this
    $('.post-toggle').click ->
      postID = $(this).data("post-id")
      new SingleArticleView(postID, that.configs)
      false

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
