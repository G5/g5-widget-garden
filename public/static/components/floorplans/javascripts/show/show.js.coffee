class pricingAndAvailability
  constructor: (pricingOptions) ->

    heroku_app_name_max_length = 30

    cpas_urn = pricingOptions["clientUrn"].replace(/-c-/, "-cpas-")
    cpas_urn = cpas_urn.substring(0, heroku_app_name_max_length)

    location_urn = pricingOptions["locationUrn"]

    if cpas_urn && location_urn
      @getPricing(cpas_urn, location_urn)

  getPricing: (cpas_urn, location_urn) ->
    pricingURL = "http://" + cpas_urn + ".herokuapp.com/locations/" + location_urn;

    $.get pricingURL, (data) ->
      $data = $(data)
      floorplans = $data.find('.e-content')
      $(".floorplans").append(floorplans);


$ ->
  pricingOptions = JSON.parse($('.floorplans .config:first').html())
  new pricingAndAvailability(pricingOptions)
  $(".floorplans .floorplan-btn").fancybox()

  $(".filter-btn").live "click", (e) ->
    e.stopPropagation()
    floorplans = $("#sortable li")
    filterName = $(this).attr("for").split("-")[0]
    filterValue = $(this).text()

    floorplans.each (i) ->
      filterClass = "." + filterName + "-val"
      actual = $(this).find(filterClass).text()

      if filterValue is "All"
        $(this).show()
      else if actual is filterValue
        $(this).show()
      else
        $(this).hide()