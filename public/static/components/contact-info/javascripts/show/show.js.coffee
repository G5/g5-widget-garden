$ ->
  phoneOptions = JSON.parse($('.contact-info .config:first').html())
  new phoneNumber(phoneOptions)
