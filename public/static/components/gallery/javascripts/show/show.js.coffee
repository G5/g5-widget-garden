# Creates the slideshow

getGridSize = ->
  windowWidth = window.innerWidth
  if windowWidth < 641
    1
  else if windowWidth >= 641 and windowWidth < 910
    2
  else
    3


initializeFlexSlider = (galleryOptions, gallery) ->
  showThumbs = (if galleryOptions['show_thumbnails'] is "yes" then "thumbnails" else true)

  if (galleryOptions['carousel'] is 'yes')
    gallery.find('.gallery-carousel').flexslider
      animation: 'slide'
      animationLoop: true
      itemWidth: 350
      itemMargin: 15
      minItems: getGridSize()
      maxItems: getGridSize()

  else
    gallery.find('.gallery-slideshow').flexslider
      animation: 'fade'
      useCSS: true
      touch: true
      directionNav: true
      controlNav: showThumbs

    setTimeout (->
      gallery.addClass "loaded"
    ), 500


# Gets the height of the tallest image
getLargestImage = (gallery) ->
  slides = gallery.find('.slides li')
  images = gallery.find('.slides img')

  slides.addClass 'loading'
  images.css 'max-height', 'none'
  imageHeight = 0
  imageWidth = 0
  size = []
  images.each ->
    curHeight = null
    curHeight = $(this).height()
    if curHeight > imageHeight
      imageHeight = curHeight
      imageWidth = $(this).width()

  slides.removeClass 'loading'
  size['height'] = imageHeight
  size['width'] = imageWidth
  size


# Sets max height of images so they all fit in the window
setImageHeight = (imageHeight, gallery, carousel) ->
  galleryType = (if carousel is "yes" then "carousel" else "slideshow")
  windowHeight = $(window).height()
  navHeight = gallery.find('.flex-control-nav').outerHeight true
  fixedHeight = null
  padding = 10

  if windowHeight <= imageHeight + navHeight
    fixedHeight = windowHeight - navHeight - padding

    if fixedHeight < 320
      fixedHeight = imageHeight - padding
  else
    fixedHeight = imageHeight - padding

  if galleryType != 'carousel'
    gallery.find('.slides img').css 'max-height', fixedHeight
    gallery.find('.slides li').css 'height', fixedHeight


  gallery.find('.flex-control-nav').css 'bottom', -navHeight
  gallery.find('.flexslider').css 'margin-bottom', navHeight


setMiniNavHeight = (imageHeight, gallery) ->
  gallery.find('.flex-direction-nav a').height imageHeight


setupFlexslider = (galleryOptions, gallery) ->
  size = getLargestImage(gallery)
  imageHeight = size['height']

  initializeFlexSlider(galleryOptions, gallery)

  if galleryOptions['mini_gallery'] is 'yes'
    setMiniNavHeight imageHeight, gallery
  else
    setTimeout (->
      setImageHeight imageHeight, gallery, galleryOptions["carousel"]
    ), 500


resetFlexslider = (galleryOptions, gallery) ->
  size = getLargestImage(gallery)
  imageHeight = size['height']

  setImageHeight imageHeight, gallery

  if galleryOptions['carousel'] == 'yes'
    gridSize = getGridSize()
    flexslider.vars.minItems = gridSize
    flexslider.vars.maxItems = gridSize


resetMiniFlexslider = (gallery) ->
  size = getLargestImage(gallery)
  imageHeight = size['height']

  setMiniNavHeight imageHeight, gallery

$(window).load ->
  galleries = $('.gallery')

  galleries.each ->

    gallery = $(this)

    galleryOptions = JSON.parse(gallery.find('.config:first').html())

    setupFlexslider galleryOptions, gallery

    if galleryOptions['mini_gallery'] is 'yes'
      $(window).smartresize ->
        resetMiniFlexslider gallery
    else
      $(window).smartresize ->
        resetFlexslider galleryOptions, gallery
