$(document).ready(function() {
        
    $('#sidebar').affix({
      offset: {
        top: 380
      }
	});

	var $body   = $(document.body);
	var navHeight = $('.navbar').outerHeight(true) + 10;

	$body.scrollspy({
	  target: '#leftcol',
	  offset: navHeight
	});


	/* smooth scrolling sections */
	$('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top - 70
	        }, 1000);
	        return false;
	      }
	    }
	});

	// make code pretty
    window.prettyPrint && prettyPrint()

});