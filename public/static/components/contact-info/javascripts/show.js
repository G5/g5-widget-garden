(function() {
  $(function() {
    var phoneOptions;
    phoneOptions = JSON.parse($('.contact-info .config:first').html());
    return new phoneNumber(phoneOptions);
  });

}).call(this);
