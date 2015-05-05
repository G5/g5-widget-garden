function app(jQuery) {

  // If <= IE 9
  if (window.XDomainRequest) {
    loadIEScript();
  }

  loadScript();

  function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";

    document.body.appendChild(script);
  };

  function loadIEScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//g5-widget-garden.herokuapp.com/javascripts/libs/jquery.xdomainrequest.min.js";

    document.body.appendChild(script);
  }
};

function initialize() {
  if ($(".map").length) {
    window.getMapCoords();
  }
  if ($(".directions").length && window.G5DirectionsWidget) {
    window.G5DirectionsWidget.getDirectionsCoords();
  }
  if ($(".comarketing").length) {
    window.getComarketingCoords();
  }
}

$(document).ready(app);
