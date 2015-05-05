(function() {
  var nextImage;

  nextImage = function() {
    var $active, $img, $next, $nextLoad, src;
    $active = $(".gallery-basic .active");
    $next = ($active.next().length > 0 ? $active.next() : $(".gallery-basic figure:first"));
    $nextLoad = ($next.next().length > 0 ? $next.next() : $(".gallery-basic figure:first"));
    if ($nextLoad.hasClass("lazy-load")) {
      $img = $nextLoad.find("img");
      src = $img.attr("data-src");
      $img.attr("src", src);
      $nextLoad.removeClass("lazy-load");
    }
    $next.css("z-index", 2);
    return $active.fadeOut(1500, function() {
      $active.css("z-index", 1).show().removeClass("active");
      return $next.css("z-index", 3).addClass("active");
    });
  };

  setInterval((function() {
    return nextImage();
  }), 7000);

}).call(this);
