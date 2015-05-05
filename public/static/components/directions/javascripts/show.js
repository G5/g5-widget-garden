(function() {
  var G5DirectionsWidget, directionsWidget;

  directionsWidget = (function() {
    directionsWidget.prototype.config = null;

    directionsWidget.prototype.wideWidth = 960;

    directionsWidget.prototype.smallWidth = 480;

    directionsWidget.prototype.storeCoords = null;

    directionsWidget.prototype.lat = null;

    directionsWidget.prototype.lng = null;

    directionsWidget.prototype.directionsDisplay = null;

    directionsWidget.prototype.widget = null;

    directionsWidget.prototype.input = null;

    directionsWidget.prototype.wrapper = null;

    directionsWidget.prototype.submit = null;

    directionsWidget.prototype.canvas = null;

    directionsWidget.prototype.panel = null;

    directionsWidget.prototype.error = null;

    function directionsWidget(options) {
      var _this = this;
      this.config = options;
      this.widget = $('.directions');
      this.input = this.widget.find('.directions-start');
      this.wrapper = this.input.parent('.text');
      this.submit = this.wrapper.find('.directions-submit');
      this.canvas = this.widget.find('.canvas');
      this.panel = this.widget.find('.panel');
      this.error = this.widget.find('.directions-error');
      this.resize();
      this.submit.on('click', function() {
        return _this.calcRoute();
      });
      $(window).on('resize orientationchange', function() {
        return _this.resize();
      });
    }

    directionsWidget.prototype.getDirectionsCoords = function() {
      this.getStoreCoords();
      return this.getClientCoords();
    };

    directionsWidget.prototype.resize = function() {
      if (this.widget.parents('div').width() >= this.wideWidth) {
        this.widget.addClass('wide');
      } else {
        this.widget.removeClass('wide');
      }
      if (this.widget.parents('div').width() < this.smallWidth) {
        this.widget.addClass('small');
      } else {
        this.widget.removeClass('small');
      }
      return this.input.css({
        width: this.wrapper.width() - this.submit.outerWidth(true) - 15
      });
    };

    directionsWidget.prototype.setupMap = function() {
      var map, mapMarkerOptions, mapOptions, marker;
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      mapOptions = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: this.storeCoords
      };
      map = new google.maps.Map(this.canvas[0], mapOptions);
      this.directionsDisplay.setMap(map);
      this.directionsDisplay.setPanel(this.panel[0]);
      mapMarkerOptions = {
        position: this.storeCoords,
        map: map,
        title: this.config.address
      };
      return marker = new google.maps.Marker(mapMarkerOptions);
    };

    directionsWidget.prototype.getStoreCoords = function() {
      var _this = this;
      return $.getJSON("https://maps.googleapis.com/maps/api/geocode/json", {
        address: this.config.address,
        sensor: "false"
      }).done(function(data) {
        if (data.results.length) {
          _this.lat = data.results[0].geometry.location.lat;
          _this.lng = data.results[0].geometry.location.lng;
          _this.storeCoords = new google.maps.LatLng(_this.lat, _this.lng);
          return _this.setupMap();
        } else {
          return _this.invalidStoreAddressError();
        }
      });
    };

    directionsWidget.prototype.getClientCoords = function() {
      var geoloc, nav, watchID,
        _this = this;
      watchID = void 0;
      nav = window.navigator;
      if (nav != null) {
        geoloc = nav.geolocation;
        return watchID = geoloc.getCurrentPosition((function(position) {
          return _this.successCallback(position);
        }), (function(error) {
          return _this.errorCallback(error);
        }));
      }
    };

    directionsWidget.prototype.successCallback = function(position) {
      var coords;
      coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      return this.populateStartAddress(coords);
    };

    directionsWidget.prototype.errorCallback = function(error) {
      this.showErrorMessage("Phyical location for the starting address not found");
      return console.log("error detecting physical location");
    };

    directionsWidget.prototype.showErrorMessage = function(message) {
      if (message.length) {
        return this.error.html(message).addClass('show');
      }
    };

    directionsWidget.prototype.hideErrorMessage = function() {
      return this.error.removeClass('show');
    };

    directionsWidget.prototype.populateStartAddress = function(latLng) {
      var address, geocoder,
        _this = this;
      address = void 0;
      geocoder = new google.maps.Geocoder();
      return geocoder.geocode({
        latLng: latLng
      }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          address = results[0].formatted_address;
          _this.input.attr("value", address);
          return _this.calcRoute();
        }
      });
    };

    directionsWidget.prototype.calcRoute = function() {
      var directionsService, end, request, start,
        _this = this;
      if (!this.storeCoords) {
        return this.invalidStoreAddressError();
      }
      this.hideErrorMessage();
      this.submit.addClass('disabled').prop('disabled', true);
      directionsService = new google.maps.DirectionsService();
      start = this.input.val();
      end = this.storeCoords;
      request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      return directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          _this.directionsDisplay.setDirections(result);
        } else {
          _this.showErrorMessage("No directions found. Try a different address.");
        }
        return _this.submit.removeClass('disabled').prop('disabled', false);
      });
    };

    directionsWidget.prototype.invalidStoreAddressError = function() {
      this.showErrorMessage("The Store address for this Directions Widget is not set up correctly");
      this.submit.addClass('disabled').prop('disabled', true);
      this.canvas.hide();
      return this.panel.hide();
    };

    return directionsWidget;

  })();

  G5DirectionsWidget = null;

  $(document).ready(function() {
    if (directionsConfig) {
      return window.G5DirectionsWidget = new directionsWidget(directionsConfig);
    }
  });

}).call(this);
