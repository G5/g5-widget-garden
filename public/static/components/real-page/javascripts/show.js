(function() {
  $(function() {
    var realPageJSBuilder, realPageVars;
    realPageVars = realPageVarsConfig;
    realPageJSBuilder = function(configs) {
      var realPageJS, realpage_url, target_div_param;
      target_div_param = "&container=realpage-iframe";
      realpage_url = configs.realpage_stylesheet.length > 1 && configs.realpage_id.length > 1 ? "" + configs.realpage_id + target_div_param + "&css=https%3A" + configs.realpage_stylesheet : configs.realpage_id.length > 1 ? "" + configs.realpage_id + target_div_param : void 0;
      realPageJS = "<SCRIPT language=\"javascript\" src=\"https://property.onesite.realpage.com/oll/eol/widget?siteId=" + realpage_url + "\"></SCRIPT>";
      if (realpage_url != null) {
        return $('.realpage.widget').append(realPageJS);
      }
    };
    if (realPageVars != null) {
      return realPageJSBuilder(realPageVars);
    }
  });

}).call(this);
