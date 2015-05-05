(function() {

  var canonicalUrl = function() {
    var inputs = $('input.u-canonical');
    var loc = $(location).attr('href');
    inputs.val(loc);
  };

  $(function() {
    var clientUrn;
    var config = $('.g5-enhanced-form .config:first')
    if (config.length > 0) {
      clientUrn = JSON.parse(config.html());
    }
    canonicalUrl();
  });

}).call(this);
