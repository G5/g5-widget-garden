trackCTAEvents = (cta) ->
  try ga('send','event', 'CTA', 'click', cta.text()) catch err then

$ ->
  $('.action-calls a').on 'click', ->
    trackCTAEvents $(this)
