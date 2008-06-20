;(function($) {
	/* 
	 * Extend jQuery to create a presentation out of a json file
	 */
	$.fn.smoo = function(json_presentation, full_screen) {
		return this.each(function() {
			var $this = $(this).append(
				'<span class="smooFont">abcde&nbsp;fghij&nbsp;klmno&nbsp;pqrst&nbsp;uvwxyz</span>'+
				'<a class="smooFocus" href="#nogo">&nbsp;</a>'+
				'<div id="smoo'+Math.floor(Math.random()*100)+'" class="smooPresentation" />'				
			);
			// This anchor is used to catch keydown event and need to keep focus.
			if(full_screen) $this.find('a:first').focus();			
			// Calculate a font coef relative to the width of the alphabet in Arial < Firefox < Linux
			// This is intended to reduce font dimensions differences in various browsers and OS
			var fontCoef = 221 / $this.find('span.smooFont').innerWidth();
			$this = $this.find('div:first').fourthirdize(fontCoef);
			// Build & init presentation
			new $.smoo.Presentation(json_presentation, $this);
			// Keep the presentation in 4/3rd, fixed for the weird window.resize event in IE and safari.
			var resizeTimer = null;
			$(window).resize(function(){
				if (resizeTimer) clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function(){
					$this.fourthirdize(fontCoef);
				}, 100);
			});
		});
	};
	
	/*
	 * Extend jQuery to resize an element to 4/3 and preserve the font-size ratio
	 */
	$.fn.fourthirdize = function(fontCoef) {
		return this.each(function() {
			var $this = $(this);
			var parent_width = $this.parent().width();
			var parent_height = $this.parent().height();
			(parent_width / parent_height) > 1.33?
				$this.animate({
					height: '100%',
					width: parent_height * 4/3,
					fontSize: parent_height / 3 * fontCoef +'%'
				}, 'slow') :
				$this.animate({
					width: '100%',
					height: parent_width * 3/4,
					fontSize: parent_width / 4 * fontCoef +'%'
				}, 'slow');
		});
	};
})(jQuery);