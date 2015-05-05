//= require jquery
//= require jquery_ujs
//= require jquery.nested_attributes
//= require_tree .

$ = jQuery.noConflict();

var widgetGarden = {
  init: function(){
    this.highlightNearestWidget();
    $(window).on('scroll', this.highlightNearestWidget);
  },
  highlightNearestWidget: function(){
    var scrollTop = $(window).scrollTop();
    var minDiff = null;
    var nearest = null;
    $('.h-g5-component').each(function(){
      var componentTop = $(this).position().top;
      var scrollDiff = Math.abs(scrollTop - componentTop);
      if (nearest === null || (scrollDiff < minDiff && componentTop < scrollTop+$(window).height())) {
        minDiff = scrollDiff;
        nearest = $(this).children('a').first().attr('name');
      }
    }).promise().done(function(){
      $('#toc li.nearest').removeClass('nearest');
      if (nearest){
        $('#toc li a[href="#'+nearest+'"]').parent('li').addClass('nearest');
      }
    });
  }
};

$(document).ready(function(){
  widgetGarden.init();
});