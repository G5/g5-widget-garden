$ ->

  # Set up show/hide functionality
  $('.coupon-drawer').hide()

  $('#show-coupon-form').on 'click', (e) ->
    $('#location-info').slideUp()
    $('#coupon-form').slideToggle()

  $('#show-location-info').on 'click', (e) ->
    $('#coupon-form').slideUp()
    $('#location-info').slideToggle()


  # Open window with coupon, print, close
  $('#coupon-print').on 'click', (e) ->

    coupon = $(this).parents('.coupon')
    w = coupon.outerWidth(true)
    h = coupon.outerHeight(true)
    content = coupon.wrap('<div class="coupon-wrapper"></div').parent().html()

    printCoupon(content, w, h)
    coupon.unwrap()


printCoupon = (content, w, h) ->
  # For Dev Only, grab necessary stylesheets
  baseStylesheet = $('link[href*=stylesheets_]').attr 'href'
  appStylesheet = $('link[href*=high-rise]').attr 'href'
  couponStylesheet = $('link[href*=coupon]').attr 'href'

  # Get Application.css url
  if window.location.href.indexOf("herokuapp") > -1
    stylesheets = '<link rel="stylesheet" href="' + baseStylesheet + '" />' +
                  '<link rel="stylesheet" href="' + appStylesheet + '" />' +
                  '<link rel="stylesheet" href="' + couponStylesheet + '" />'
  else
    appStylesheet = $('head link[href*=application]').attr 'href'
    stylesheets = '<link rel="stylesheet" href="' + appStylesheet + '" />'





  # Get coordinates for centering print window
  windowLeft = (if window.screenLeft then window.screenLeft else window.screenX)
  windowTop = (if window.screenTop then window.screenTop else window.screenY)
  newLeft = windowLeft + (window.innerWidth / 2) - (w / 2)
  newTop = windowTop + (window.innerHeight / 2) - (h / 2)

  # Open new window and paste coupon html and stylesheet into it
  title = 'Print Coupon'
  options = 'toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, copyhistory=no, ' +
            'height=' + h + ', width=' + w + ', left=' + newLeft + ', top=' + newTop

  myWindow = window.open '', title, options
  myWindow.document.write '<html><head><title>Print Coupon</title>' +
                          stylesheets +
                          '</head><body style="border: none">' +
                          content +
                          '</body></html>'

  myWindow.document.close()
  myWindow.focus()

  # setTimeout needed for Chrome not loading print preview
  setTimeout (->
    myWindow.print()
    myWindow.close()
  ), 500
