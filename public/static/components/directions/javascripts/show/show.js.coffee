class directionsWidget
  config: null
  wideWidth: 960
  smallWidth: 480
  storeCoords: null
  lat: null
  lng: null
  directionsDisplay: null

  widget: null
  input: null
  wrapper: null
  submit: null
  canvas: null
  panel: null
  error: null

  constructor: (options) ->
    @config = options
    @widget = $('.directions')
    @input = @widget.find('.directions-start')
    @wrapper = @input.parent('.text')
    @submit = @wrapper.find('.directions-submit')
    @canvas = @widget.find('.canvas')
    @panel = @widget.find('.panel')
    @error = @widget.find('.directions-error')
    @resize()
    @submit.on 'click', =>
      @calcRoute()
    $(window).on 'resize orientationchange', =>
      @resize()

  getDirectionsCoords: ->
    @getStoreCoords()
    @getClientCoords()

  resize: ->
    if @widget.parents('div').width() >= @wideWidth then @widget.addClass('wide') else @widget.removeClass('wide')
    if @widget.parents('div').width() < @smallWidth then @widget.addClass('small') else @widget.removeClass('small')
    @input.css({width: @wrapper.width() - @submit.outerWidth(true) - 15})

  setupMap: ->
    @directionsDisplay = new google.maps.DirectionsRenderer()
    mapOptions =
      zoom: 15
      mapTypeId: google.maps.MapTypeId.ROADMAP
      center: @storeCoords

    map = new google.maps.Map(@canvas[0], mapOptions)
    @directionsDisplay.setMap map
    @directionsDisplay.setPanel @panel[0]

    mapMarkerOptions =
      position: @storeCoords
      map: map
      title: @config.address
    marker = new google.maps.Marker(mapMarkerOptions)

  getStoreCoords: ->
    $.getJSON("https://maps.googleapis.com/maps/api/geocode/json",
      address: @config.address
      sensor: "false"
    ).done (data) =>
      if data.results.length
        @lat = data.results[0].geometry.location.lat
        @lng = data.results[0].geometry.location.lng
        @storeCoords = new google.maps.LatLng(this.lat, this.lng)
        @setupMap()
      else
        @invalidStoreAddressError()

  getClientCoords: ->
    watchID = undefined
    nav = window.navigator
    if nav?
      geoloc = nav.geolocation
      watchID = geoloc.getCurrentPosition \
        ((position) => @successCallback(position)), \
        ((error) => @errorCallback(error))

  successCallback: (position) ->
    coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    @populateStartAddress coords

  errorCallback: (error) ->
    @showErrorMessage "Phyical location for the starting address not found"
    console.log "error detecting physical location"

  showErrorMessage: (message) ->
    @error.html(message).addClass('show') if message.length

  hideErrorMessage: ->
    @error.removeClass 'show'

  populateStartAddress: (latLng) ->
    address = undefined
    geocoder = new google.maps.Geocoder()
    geocoder.geocode
      latLng: latLng,
      (results, status) =>
        if status is google.maps.GeocoderStatus.OK
          address = results[0].formatted_address
          @input.attr "value", address
          @calcRoute();

  calcRoute: ->
    return @invalidStoreAddressError() unless @storeCoords
    @hideErrorMessage()
    @submit.addClass('disabled').prop('disabled',true)
    directionsService = new google.maps.DirectionsService()
    start = @input.val()
    end = @storeCoords
    request =
      origin: start
      destination: end
      travelMode: google.maps.TravelMode.DRIVING

    directionsService.route request, (result, status) =>
      if status is google.maps.DirectionsStatus.OK
        @directionsDisplay.setDirections result
      else
        @showErrorMessage "No directions found. Try a different address."
      @submit.removeClass('disabled').prop('disabled',false)

  invalidStoreAddressError: ->
    @showErrorMessage "The Store address for this Directions Widget is not set up correctly"
    @submit.addClass('disabled').prop('disabled',true)
    @canvas.hide()
    @panel.hide()

G5DirectionsWidget = null

$(document).ready ->
  window.G5DirectionsWidget = new directionsWidget(directionsConfig) if directionsConfig
