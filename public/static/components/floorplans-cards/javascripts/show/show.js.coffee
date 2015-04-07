class populateUnitData
  constructor: (floorplanConfig) -> 
    dataFeed = floorplanConfig['floorplanDataFeed']
    $ ->
      $.getJSON(dataFeed, (unitData) -> buildHTML(unitData, floorplanConfig)).then (response) ->
        new customizeUnitGrid(floorplanConfig)

  buildHTML = (unitData, floorplanConfig) ->
    unitsDiv = $('.floorplans-cards').first()
    unitsMarkup = ""
    for index, floorplan of unitData
      unitsMarkup += "<div class='floorplan-card'>
                        <div class='floorplan-card-title'>#{floorplan["title"]}</div>
                        <a href='#{floorplan["image_url"]}' class='floorplan-view-link'>
                          #{svgIconMarkup(floorplanConfig["accentColor2"])}
                          <div>View<span></span></div>
                        </a>
                        <div class='unit-details'>
                          <div class='unit-beds'>#{bedroomMarkup floorplan["beds"]}</div>
                          <div class='unit-baths'><span>#{floorplan["baths"]}</span> Bathroom</div>
                          #{sizeMarkup floorplan["size"]}
                          #{priceMarkup floorplan["price"]}
                        </div>
                        <a href='#{floorplan["price_url"]}' class='unit-cta-button'>#{floorplanConfig["ctaText"]}</a>
                      </div>"

    unitsDiv.append(unitsMarkup)

  bedroomMarkup = (bedrooms) ->
    if bedrooms > 0
      "<span>#{bedrooms}</span> Bedroom"
    else
      "<span>S</span> Studio"

  svgIconMarkup = (color) ->
    svgMarkup =  "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='77px' height='111px' viewBox='0 0 77 111' enable-background='new 0 0 77 111' xml:space='preserve'>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='1.5' y1='0' x2='1.5' y2='111'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='0' y1='109.5' x2='77' y2='109.5'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='75.564' y1='0' x2='75.436' y2='111'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='76.925' y1='1.5' x2='34.075' y2='1.5'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='17.934' y1='1.5' x2='0' y2='1.5'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='50' y1='0' x2='50' y2='22.997'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='50' y1='69.973' x2='50' y2='111'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='35.694' y1='1.5' x2='26.171' y2='17.721'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='50' y1='71.518' x2='29.774' y2='71.646'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='31.25' y1='71.518' x2='31.25' y2='95.842'/>
                    <line fill='none' stroke='#{color}' stroke-width='3' stroke-miterlimit='10' x1='0' y1='71.518' x2='17.934' y2='71.518'/>
                    <circle fill='#{color}' cx='16.519' cy='5.495' r='1.416'/>
                    <circle fill='#{color}' cx='18.578' cy='8.841' r='1.416'/>
                    <circle fill='#{color}' cx='20.578' cy='12.316' r='1.416'/>
                    <circle fill='#{color}' cx='23.409' cy='15.147' r='1.416'/>
                  </svg>"

  sizeMarkup = (size) ->
    if size == null
      ""
    else
      "<div class='unit-size'>#{size} Sq. Ft.</div>"

  priceMarkup = (price) ->
    if price == null
      ""
    else
      "<div class='unit-rate'>From <span>$#{price}</span></div>" 

class customizeUnitGrid
  constructor: (colorConfigurations) ->
    setHeadingColor colorConfigurations['headingColor']
    setCtaColor colorConfigurations['ctaColor'], colorConfigurations['accentColor1']
    setAccents1 colorConfigurations['accentColor1']
    setAccents2 colorConfigurations['accentColor2']
    setText colorConfigurations['textColor']
    $(".floorplan-view-link").fancybox()

  setHeadingColor = (color) ->
    $('.floorplan-card-title').css('background-color', color)

  setCtaColor = (color, hoverColor) ->
    ctaButtons = $('.unit-cta-button')
    ctaButtons.css('background-color', color)
    ctaButtons.hover(
      -> $(this).css('background-color', hoverColor),
      -> $(this).css('background-color', color)
    )

  setAccents1 = (color) ->
    $('.floorplan-view-link span').css('background-color', color)

  setAccents2 = (color) ->
    $('.unit-beds span, .unit-baths span, .floorplan-view-link div').css('background-color', color)

  setText = (color) ->
    $('.unit-beds, .unit-baths, .unit-size, .unit-rate').css('color', color)

class initializeUnitGrid
  floorplanConfig = JSON.parse($('#floorplan-cards-config').html())
  new populateUnitData(floorplanConfig)
  
