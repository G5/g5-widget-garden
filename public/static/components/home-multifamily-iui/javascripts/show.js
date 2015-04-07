(function() {
  var iuiMarkupBuilder;

  $(function() {
    var configs,
      _this = this;
    configs = JSON.parse($('#home-multifamily-iui-config').html());
    return $.ajax({
      url: "" + configs.floorplans_service_host + "/api/v0/multi_families?store_id=" + configs.core_store_id,
      dataType: 'json',
      success: function(data) {
        var categories;
        categories = data.unit_categories;
        if (typeof categories !== "undefined" && categories.length > 0) {
          return new iuiMarkupBuilder(categories, configs);
        }
      }
    });
  });

  iuiMarkupBuilder = (function() {
    var buttonTemplate;

    function iuiMarkupBuilder(categories, configs) {
      var allButton, category, categoryClass, index, markupHash, _i, _len;
      categories.sort(function(a, b) {
        return a.beds - b.beds;
      });
      markupHash = [];
      categoryClass = "count-" + categories.length;
      for (index = _i = 0, _len = categories.length; _i < _len; index = ++_i) {
        category = categories[index];
        markupHash.push(buttonTemplate(category.beds, configs));
      }
      allButton = " <div class='iui-size iui-view-all'>                    <a class='btn' href='" + configs.floorplan_page_url + "/#/bedrooms/all/floorplans'>                      View All                    </a>                  </div> ";
      markupHash.push(allButton);
      $('.home-multifamily-iui').addClass(categoryClass).find('.iui-container').html(markupHash.join(''));
    }

    buttonTemplate = function(beds, configs) {
      var buttonClass, buttonText;
      buttonClass = beds > 0 ? "btn-beds" : "btn-studio";
      buttonText = beds > 0 ? "<strong>" + beds + "</strong> Bedroom" : "Studio";
      return "<div class='iui-size'><a class='btn " + buttonClass + "' href='" + configs.floorplan_page_url + "#/bedrooms/" + beds + "/floorplans'>" + buttonText + "</a></div>";
    };

    return iuiMarkupBuilder;

  })();

}).call(this);
