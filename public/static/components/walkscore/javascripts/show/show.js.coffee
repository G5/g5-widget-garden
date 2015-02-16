$ ->
  # Get walkscore config options
  walkFeedVars = walkFeedVarsConfig   
  # Walkscore Setup
  if walkFeedVars.walkscore_client.length > 1
    walkscoreFeed = new walkscoreInitializer(walkFeedVars)

# WALKSCORE UTILITIES
# *******************
class walkscoreInitializer
  constructor: (walkFeedVars) ->
    return getpage walkFeedVars
    
  getpage = (walkFeedVars) ->
    $.ajax
      url: "//g5-social-feed-service.herokuapp.com/walkscore-feed/#{walkFeedVars.walkscore_client}/#{walkFeedVars.walkscore_location}"
      dataType: 'json'
      success: (data) =>
        walkscoreBadgeBuilder(data) if data != null

  walkscoreBadgeBuilder = (dataFeed) ->
    if dataFeed != []
      walkscoreBlock = """<a href="#{dataFeed.ws_link}" target="_blank">
                           <img src="#{dataFeed.logo_url}" alt="Walkscore Logo"/>
                             <span>#{dataFeed.walkscore}</span>
                          </a>
                      """
      $('.walkscore-listing').append(walkscoreBlock)