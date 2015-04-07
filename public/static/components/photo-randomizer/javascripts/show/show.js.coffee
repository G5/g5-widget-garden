$ ->
  #Grab up all the URLs & alt text from the Configs in an array
  photo_array = photoRandomizerVarsConfig.photos  

  # PHOTO RANDOMIZER UTILITIES
  #Clean the array if any one of the objects in the array has an undefined alt or url
  cleanArray = []
  photo_array.forEach (arrayItem) ->
    x = arrayItem.url
    y = arrayItem.alt
    valuesExist = if x.length > 1 and y.length > 1 then true else false
    if valuesExist is true
      cleanArray.push arrayItem
    return
  
  #Randomize the array that has been cleaned up
  random_photo = cleanArray[Math.floor(Math.random()*cleanArray.length)]

  #Build out the random image
  photoRandomizerBuilder = (data)  ->
    if data != []
      #clean up array of undefined values

      photoRandomizerMarkup = """<img class="u-photo" src="#{data.url}" alt="#{data.alt}" itemprop="image"/>"""
      $('.photo-randomizer').append(photoRandomizerMarkup)

  photoRandomizerBuilder(random_photo) if cleanArray.length > 1