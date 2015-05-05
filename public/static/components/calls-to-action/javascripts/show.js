(function() {
  var trackCTAEvents;

  trackCTAEvents = function(cta) {
    var err;
    try {
      return ga('send', 'event', 'CTA', 'click', cta.text());
    } catch (_error) {
      err = _error;
    }
  };

  $(function() {
    return $('.action-calls a').on('click', function() {
      return trackCTAEvents($(this));
    });
  });

}).call(this);
