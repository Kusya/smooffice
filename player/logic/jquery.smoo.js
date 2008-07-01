;(function($) {
	/* 
	 * Extend jQuery to create a presentation out of a json file
	 */
	$.fn.smoo = function(json_presentation, full_screen) {
		return this.each(function() {
			var $this = $(this).append(
					// Build presentation style from master
					'<style typ="text/css">'+
					function() {
						var html = '';
						for(var i in json_presentation.master) {
							if (json_presentation.master[i].p) {
								html += 'div.'+i+' {\n';
								for (var l in json_presentation.master[i].p) {
									html += '\t' + l.replace(/[A-Z]/, function(find){
										return '-' + find.toLowerCase();
									}) + ': ' + json_presentation.master[i].p[l] + ';\n';
								}
								html += '}\n';
							}
							for (var j in json_presentation.master[i].e) {
								html += 'div.'+i+' '+j+'.smooElement {\n';
								for (var k in json_presentation.master[i].e[j])
									html += '\t' + k.replace(/[A-Z]/, function(find){
										return '-' + find.toLowerCase();
									}) + ': ' + json_presentation.master[i].e[j][k] + ';\n';
								html += '}\n';
							}
						}
						return html;
					}()+
					'</style>'+
					//'<span class="smooFont">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;eeeeeeeeeeeetttttttttaaaaaaaaoooooooiiiiiiinnnnnnsssssshhhhhhrrrrrrddddllllcccuuummwwffggyyppbvk</span>'+
					'<span class="smooFont">abcd&nbsp;efgh&nbsp;ijklm&nbsp;nopqr&nbsp;stuvw&nbsp;xyz</span>'+
					'<a class="smooFocus" href="#nogo">&nbsp;</a>'+
					'<div id="smoo'+Math.floor(Math.random()*100)+'" class="smooPresentation" />'				
				),
				// Calculate a font coef relative to the width of etaoin shridlu in sans-serif < Firefox < Linux
				// This is intended to reduce font dimensions differences in various browsers and OS
				fontCoef = 221 / $this.find('span.smooFont').innerWidth(),
				$presentation = $this.find('div:first').fourthirdize(fontCoef),
				// Build & init presentation
				presentation = new $.smoo.Presentation(json_presentation, $presentation),
				// Bind keydown event to the Focus anchor
				$focus = $this.find('a:first').keydown(function(e) {
					if (arguments.length == 2) e.which = arguments[1];
					switch (e.which) {
						case 37: // On left arrow
							presentation.rewind();
							break;
						case 39: // On right arrow
							presentation.forward();							
							break;
						case 38: // On up arrow
							presentation.fastrewind();
							break;
						case 40: // On down arrow
							presentation.fastforward();
							break;
					}
				});
			// Bind click event to the presentation container
			$presentation.bind('click', function() {
				presentation.forward();
				// Give focus back to the Focus anchor
				$focus.focus();
				return false;
			});
			if (full_screen) {
				// This anchor is used to catch keydown event and need to keep focus.
				// TODO : try a .blur(function() { $focus.focus(); })
				$focus.focus();
				// Keep the presentation in 4/3rd, fixed for the weird window.resize event in IE and safari.
				var resizeTimer = null;
				$(window).resize(function(){
					if (resizeTimer) 
						clearTimeout(resizeTimer);
					resizeTimer = setTimeout(function(){
						$presentation.fourthirdize(fontCoef);
					}, 100);
				});
			}
			// DEBUG : 
			$.smoo.presentation = presentation;
		});
	};
	
	/*
	 * Extend jQuery to resize an element to 4/3 and preserve the font-size ratio
	 */
	$.fn.fourthirdize = function(fontCoef) {
		return this.each(function() {
			var $this = $(this),
				parent_width = $this.parent().width(),
				parent_height = $this.parent().height();
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
	
	$.fn.filterCss = function(map, master) {
		var $this = $(this), 
			css = {}, 
			tmp;
		for (var i in map) {
			tmp = $this.css(i);
			// make sure height, width, top & left are in percent
			if (/^((wi)|(to)|(lef)|h)/.test(i) && !/%$/.test(tmp)) {
				tmp = Math.round(100 * (parseInt(tmp) / parseInt(/^(to)|h/.test(i) ? 
					$this.parents('div.smooPresentation').height() :
					$this.parents('div.smooPresentation').width()))) 
				+ '%';
				// TODO : if it happens to often, consider replacing $this.parent('div.smooPresentation').dimension() by a precalculated dimensions
				console.error('non percent value found in '+$this.attr('id'));
			}
			// add style only if different from master
			if((!master || master[map[i]] === undefined || tmp != master[map[i]]) && (i != 'fontSize' || /%$/.test(tmp))) css[i] = tmp;
		}
		return css;
	}
})(jQuery);