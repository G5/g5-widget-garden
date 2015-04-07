$ ->
  configs = JSON.parse($('#home-multifamily-iui-config').html())

  $.ajax
    url: "#{configs.floorplans_service_host}/api/v0/multi_families?store_id=#{configs.core_store_id}"
    dataType: 'json'
    success: (data) =>
      categories = data.unit_categories
      if typeof(categories) != "undefined" && categories.length > 0
        new iuiMarkupBuilder(categories, configs)

class iuiMarkupBuilder
  constructor: (categories, configs) ->
    categories.sort((a, b) -> return a.beds - b.beds)
    markupHash = []
    categoryClass = "count-" + categories.length

    for category, index in categories
      markupHash.push(buttonTemplate(category.beds, configs))

    allButton = " <div class='iui-size iui-view-all'>
                    <a class='btn' href='#{configs.floorplan_page_url}/#/bedrooms/all/floorplans'>
                      View All
                    </a>
                  </div> "

    markupHash.push(allButton)

    $('.home-multifamily-iui').addClass(categoryClass).find('.iui-container').html(markupHash.join(''))

  buttonTemplate = (beds, configs) ->
    buttonClass = if beds > 0 then "btn-beds" else "btn-studio"
    buttonText = if beds > 0 then "<strong>#{beds}</strong> Bedroom" else "Studio"
    "<div class='iui-size'><a class='btn #{buttonClass}' href='#{configs.floorplan_page_url}#/bedrooms/#{beds}/floorplans'>#{buttonText}</a></div>"
