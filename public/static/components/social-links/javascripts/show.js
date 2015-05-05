(function() {

  if ($(".social-links.widget").length > 0) {
  	var localPath = window.location.href;

  	if (window.location.hash){
  		localPath = localPath.replace(window.location.hash, '')
  	}

  	$.each($('.social-links use'), function() {
  	  $(this).attr('xlink:href', localPath + $(this).attr('xlink:href'));
  	});
  }
}).call(this);