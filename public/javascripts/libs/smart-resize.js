// Sets resize handler that does not trigger a billion times
// http://bit.ly/1dNb8HD

(function($, sr) {
  var debounce;
  debounce = null;
  debounce = function(func, threshold, execAsap) {
    var debounced, timeout;
    debounced = void 0;
    timeout = void 0;
    timeout = void 0;
    return debounced = function() {
      var delayed, obj;
      delayed = void 0;
      obj = void 0;
      delayed = function() {
        if (!execAsap) {
          func.apply(obj);
        }
        timeout = null;
      };
      obj = this;
      if (timeout) {
        clearTimeout(timeout);
      } else {
        if (execAsap) {
          func.apply(obj);
        }
      }
      timeout = setTimeout(delayed, threshold || 100);
    };
  };
  jQuery.fn[sr] = function(fn) {
    if (fn) {
      return this.bind("resize", debounce(fn));
    } else {
      return this.trigger(sr);
    }
  };
})(jQuery, "smartresize");