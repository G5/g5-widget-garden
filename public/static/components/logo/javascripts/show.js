(function() {
  $(function() {
    var logoBuilder, logoVars;
    logoVars = logoConfigs;
    logoBuilder = function(configs) {
      var cleanArray, i, logo_canonical_url, logo_href, pathArray, single_domain_path;
      logo_canonical_url = window.location.protocol + '//' + window.location.host;
      if (configs.single_domain_location === "true") {
        pathArray = window.location.pathname.split('/');
        cleanArray = pathArray.filter(Boolean);
        single_domain_path = '';
        i = 0;
        while (i < 4) {
          single_domain_path += '/';
          single_domain_path += cleanArray[i];
          i++;
        }
        logo_href = logo_canonical_url + single_domain_path;
      } else {
        logo_href = logo_canonical_url;
      }
      if (logo_href != null) {
        return $('.logo.widget').attr('href', logo_href);
      }
    };
    if (logoVars != null) {
      return logoBuilder(logoVars);
    }
  });

}).call(this);
