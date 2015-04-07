(function() {
  var setUpContactInfoSheet;

  setUpContactInfoSheet = function() {
    var chatWindow, initializeContactInfoSheet, phoneOptions, setFadeDelay, setupContactInfoSheet, setupMobileContactInfoSheet, showEmail, showPhone, stopContactInfoSheet;
    phoneOptions = JSON.parse($('.contact-info-sheet .config:first').html());
    new phoneNumber(phoneOptions);
    setFadeDelay = function(seconds) {
      var delay;
      delay = seconds === "" ? 4 : parseInt(seconds);
      return $(document).idle({
        onIdle: function() {
          if (!$(".contact-info-sheet.opened").length) {
            return $(".contact-info-sheet").fadeOut(420);
          }
        },
        onActive: function() {
          if (typeof noStickyNavForIE9 === "undefined" || noStickyNavForIE9 === null) {
            return $(".contact-info-sheet").fadeIn(420);
          }
        },
        idle: delay * 1000,
        events: 'mousemove keypress mousedown scroll'
      });
    };
    setFadeDelay(phoneOptions.fadeDelay);
    chatWindow = function(configs) {
      var chatMarkup, height, width;
      chatMarkup = "<a href=\"" + configs.third_party_chat + "\" class=\"info-sheet-chat-btn info-sheet-icon\">Third Party Chat</a>";
      if (configs.third_party_chat.length > 1) {
        $(chatMarkup).insertAfter($(".info-sheet-email-btn"));
      }
      width = configs.chat_width.length > 1 ? configs.chat_width : 600;
      height = configs.chat_height.length > 1 ? configs.chat_height : 600;
      return $('.info-sheet-chat-btn').click(function() {
        var openChatWindow;
        openChatWindow = window.open(configs.third_party_chat, 'Chat', "width=" + width + ", height=" + height + ", scrollbars=yes, resizable=yes");
        return false;
      });
    };
    if (phoneOptions.third_party_chat.length > 1) {
      chatWindow(phoneOptions);
    }
    showPhone = function(widget) {
      widget.removeClass("opened showing-email");
      widget.find(".info-sheet-email").hide();
      widget.find(".info-sheet-phone").show();
      return widget.addClass("opened showing-phone");
    };
    showEmail = function(widget) {
      widget.removeClass("opened showing-phone");
      widget.find(".info-sheet-phone").hide();
      widget.find(".info-sheet-email").show();
      return widget.addClass("opened showing-email");
    };
    setupContactInfoSheet = function() {
      var chatPresent, screenHeight, widget, widgetHeight, widgetPosition;
      $("body").css("padding-bottom", 0);
      widget = $(".contact-info-sheet").first();
      screenHeight = $(window).height();
      chatPresent = phoneOptions.third_party_chat.length > 1 || phoneOptions.third_party_url === true ? true : false;
      if ($("body").hasClass("web-home-template") || Modernizr.mq("(min-width: 1325px)")) {
        widgetPosition = $("header[role=banner]").outerHeight() + 30;
      } else if (Modernizr.mq("(min-width: 910px)") && chatPresent === true) {
        widgetPosition = $("header[role=banner]").outerHeight() + 30;
      } else {
        widgetPosition = $("header[role=banner]").outerHeight() + $("section[role=main] .row:first-of-type").outerHeight() + 30;
      }
      widgetHeight = screenHeight - widgetPosition;
      return widget.css("top", widgetPosition).find(".info-sheet-content").css("max-height", widgetHeight);
    };
    setupMobileContactInfoSheet = function() {
      var widget, widgetHeight;
      widget = $(".contact-info-sheet").first().addClass('mobile');
      widgetHeight = widget.outerHeight();
      return $("body").css("padding-bottom", widgetHeight);
    };
    initializeContactInfoSheet = function() {
      var screenHeight;
      setupContactInfoSheet();
      $(".contact-info-sheet").on("click", ".info-sheet-toggle", function(e) {
        var $this, widget;
        $this = $(this);
        widget = $(this).parent().parent();
        widget.find(".info-sheet-toggle").removeClass("active");
        if ($(this).hasClass("info-sheet-phone-btn")) {
          if (widget.hasClass("showing-phone")) {
            widget.removeClass("opened showing-phone");
          } else {
            showPhone(widget);
            $this.addClass("active");
          }
        } else {
          if (widget.hasClass("showing-email")) {
            widget.removeClass("opened showing-email");
          } else {
            showEmail(widget);
            $this.addClass("active");
          }
        }
        return false;
      });
      $(".contact-info-sheet").on("click", "form", function(e) {
        return e.stopPropagation();
      });
      $("html").on("click", function(e) {
        return $(".contact-info-sheet").removeClass("opened").find(".info-sheet-toggle").removeClass("active");
      });
      if ($("body").hasClass("web-home-template")) {
        screenHeight = $(window).height();
        $(".contact-info-sheet").on("click", ".info-sheet-page-up", function() {
          var scrollAmount, scrollPosition;
          scrollPosition = $(window).scrollTop();
          scrollAmount = scrollPosition - screenHeight;
          return $("html, body").animate({
            scrollTop: scrollAmount
          }, 1000);
        });
        return $(".contact-info-sheet").on("click", ".info-sheet-page-down", function() {
          var scrollAmount, scrollPosition;
          scrollPosition = $(window).scrollTop();
          scrollAmount = scrollPosition + screenHeight;
          return $("html, body").animate({
            scrollTop: scrollAmount
          }, 1000);
        });
      }
    };
    stopContactInfoSheet = function() {
      var widget, widgetHeight;
      setupMobileContactInfoSheet();
      $(".contact-info-sheet").off("click", ".info-sheet-toggle").removeClass("opened showing-email showing=phone").removeAttr("style");
      $(".contact-info-sheet").off("click", ".info-sheet-page-up");
      $(".contact-info-sheet").off("click", ".info-sheet-page-down");
      widget = $(".contact-info-sheet").first().addClass('mobile');
      widgetHeight = widget.outerHeight();
      return $("body").css("padding-bottom", widgetHeight);
    };
    if (Modernizr.mq("(min-width: 668px)")) {
      initializeContactInfoSheet();
    } else {
      setupMobileContactInfoSheet();
    }
    return $(window).smartresize(function() {
      if (Modernizr.mq("(min-width: 668px)")) {
        if ($('.contact-info-sheet').first().hasClass('mobile')) {
          $('.contact-info-sheet').first().removeClass('mobile');
          return initializeContactInfoSheet();
        } else {
          return setupContactInfoSheet();
        }
      } else {
        return stopContactInfoSheet();
      }
    });
  };

  $(function() {
    if (typeof noStickyNavForIE9 !== 'undefined') {
      return $('.contact-info-sheet').remove();
    } else {
      $('.contact-info-sheet').removeClass('hidden');
      return setUpContactInfoSheet();
    }
  });

}).call(this);
