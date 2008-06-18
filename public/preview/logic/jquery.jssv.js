;(function($) {
	// Extend jQuery to create a presentation out of a json file
	jQuery.fn.jssv = function(json_presentation) {
		return this.each(function() {
			// Append a hidden input to the presentation which will be used to catch
			// keypress inside this presentation.
			$(this).append(
				'<div id="jssv'+Math.floor(Math.random()*100)+'" class="jssvPresentation">'+
					'<input type="text" class="jssvInput" />'+
					'<div class="jssvFont">abcde&nbsp;fghij&nbsp;klmno&nbsp;pqrst&nbsp;uvwxyz</div>'+
				'</div>'
			);
			// Calculate a font coef relative to the width of the alphabet in Arial < Firefox < Linux
			// This is intended to reduce font dimensions differences in various browsers and OS
			var fontCoef = 221 / $(this).find('div.jssvFont').innerWidth();
			var $this = $(this).find('div:first').fourthirdize(fontCoef);
			new $.jssv.Presentation(json_presentation, $this);
			// Keep the presentation in 4/3rd, fixed for the weird window.resize event in IE and safari.
			var resizeTimer = null;
			jQuery(window).resize(function(){
				if (resizeTimer) clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function(){
					$this.fourthirdize(fontCoef);
				}, 100);
			});
		});
	};
	jQuery.fn.fourthirdize = function(fontCoef) {
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