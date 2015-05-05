(function() {
  var setMap;

  window.getMapCoords = function() {
    return $.getJSON("//maps.googleapis.com/maps/api/geocode/json", {
      address: widgetMapConfig.address,
      sensor: "false"
    }).done(function(data) {
      var coordinates;
      coordinates = data.results[0].geometry.location;
      return setMap(coordinates);
    });
  };

  setMap = function(coordinates) {
    var lat, latLng, lng, map, mapOptions, marker, markerOptions;
    lat = coordinates.lat;
    lng = coordinates.lng;
    latLng = new google.maps.LatLng(lat, lng);
    mapOptions = {
      scrollwheel: widgetMapConfig.panZoom,
      draggable: widgetMapConfig.panZoom,
      disableDefaultUI: !widgetMapConfig.panZoom,
      disableDoubleClickZoom: !widgetMapConfig.panZoom,
      zoom: 16,
      center: new google.maps.LatLng(lat, lng),
      mapTypeId: google.maps.MapTypeId[widgetMapConfig.mapType]
    };
    markerOptions = {
      position: latLng
    };
    marker = new google.maps.Marker(markerOptions);
    map = new google.maps.Map($(".map .canvas")[0], mapOptions);
    return marker.setMap(map);
  };

  $(function() {
    return window.widgetMapConfig = JSON.parse($('.map .config:first').html());
  });

}).call(this);
