(function() {
  var printCoupon;

  $(function() {
    $('.coupon-drawer').hide();
    $('#show-coupon-form').on('click', function(e) {
      $('#location-info').slideUp();
      return $('#coupon-form').slideToggle();
    });
    $('#show-location-info').on('click', function(e) {
      $('#coupon-form').slideUp();
      return $('#location-info').slideToggle();
    });
    return $('#coupon-print').on('click', function(e) {
      var content, coupon, h, w;
      coupon = $(this).parents('.coupon');
      w = coupon.outerWidth(true);
      h = coupon.outerHeight(true);
      content = coupon.wrap('<div class="coupon-wrapper"></div').parent().html();
      printCoupon(content, w, h);
      return coupon.unwrap();
    });
  });

  printCoupon = function(content, w, h) {
    var appStylesheet, baseStylesheet, couponStylesheet, myWindow, newLeft, newTop, options, stylesheets, title, windowLeft, windowTop;
    baseStylesheet = $('link[href*=stylesheets_]').attr('href');
    appStylesheet = $('link[href*=high-rise]').attr('href');
    couponStylesheet = $('link[href*=coupon]').attr('href');
    if (window.location.href.indexOf("herokuapp") > -1) {
      stylesheets = '<link rel="stylesheet" href="' + baseStylesheet + '" />' + '<link rel="stylesheet" href="' + appStylesheet + '" />' + '<link rel="stylesheet" href="' + couponStylesheet + '" />';
    } else {
      appStylesheet = $('head link[href*=application]').attr('href');
      stylesheets = '<link rel="stylesheet" href="' + appStylesheet + '" />';
    }
    windowLeft = (window.screenLeft ? window.screenLeft : window.screenX);
    windowTop = (window.screenTop ? window.screenTop : window.screenY);
    newLeft = windowLeft + (window.innerWidth / 2) - (w / 2);
    newTop = windowTop + (window.innerHeight / 2) - (h / 2);
    title = 'Print Coupon';
    options = 'toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, copyhistory=no, ' + 'height=' + h + ', width=' + w + ', left=' + newLeft + ', top=' + newTop;
    myWindow = window.open('', title, options);
    myWindow.document.write('<html><head><title>Print Coupon</title>' + stylesheets + '</head><body style="border: none">' + content + '</body></html>');
    myWindow.document.close();
    myWindow.focus();
    return setTimeout((function() {
      myWindow.print();
      return myWindow.close();
    }), 500);
  };

}).call(this);
