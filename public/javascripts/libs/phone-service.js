var phoneNumber = (function() {
  function phoneNumber(phoneOptions) {
    var client_urn, location_urn;
    $(".p-tel").css("visibility", "hidden");
    cpns_url = phoneOptions["cpnsUrl"];
    location_urn = phoneOptions["locationUrn"];
    if (cpns_url && location_urn) {
      this.getPhoneNumber(cpns_url, location_urn);
    }
    $(".p-tel").css("visibility", "visible");
  }

  phoneNumber.prototype.getPhoneNumber = function(cpns_url, location_urn) {
    var row_id;
    row_id = "#" + location_urn;
    return $.get(cpns_url, function(data) {
      var $data, formattedPhone, numbers, phone, screen;
      $data = $(data);
      numbers = $data.find(row_id);
      screen = document.documentElement.clientWidth;
      phone = void 0;
      if (localStorage["ppc"]) {
        phone = $.trim(numbers.find(".p-tel-ppc").text());
      } else if (screen < 768) {
        phone = $.trim(numbers.find(".p-tel-mobile").text());
      } else {
        phone = $.trim(numbers.find(".p-tel-default").text());
      }
      if (phone != '' || phone.length > 0) {
        formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        $(".number").attr("href", "tel://" + phone);
        $(".p-tel").html(formattedPhone)
      }
    });
  };

  return phoneNumber;

})();
