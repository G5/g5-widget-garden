nextImage = ->
  $active = $(".gallery-basic .active")
  $next = (if $active.next().length > 0 then $active.next() else $(".gallery-basic figure:first"))
  $nextLoad = (if $next.next().length > 0 then $next.next() else $(".gallery-basic figure:first"))

  # check if next image needs to be loaded
  if $nextLoad.hasClass "lazy-load"
    $img = $nextLoad.find "img"
    src = $img.attr "data-src"
    $img.attr "src", src
    $nextLoad.removeClass "lazy-load"

  # when images are done loading, transition to next slide
  $next.css "z-index", 2
  $active.fadeOut 1500, ->
    $active.css("z-index", 1).show().removeClass "active"
    $next.css("z-index", 3).addClass "active"


# Change slide every 7 seconds
setInterval (->
  nextImage()
), 7000
