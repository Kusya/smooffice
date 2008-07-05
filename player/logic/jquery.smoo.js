;(function($) {
	/* 
	 * Extend jQuery to create a presentation out of a json file
	 */
	$.fn.smoo = function(json_presentation, full_screen) {
		return this.each(function() {
			var font_class = {
				A: { family: 'Arial, Sans, FreeSans, sans-serif', w: 827 },
				T: { family: '\'Times New Roman\', Serif, Times, FreeSerif, serif', w: 741 },
				C: { family: '\'Courier New\', Mono, FreeMono, Courier, monospace', w: 1200 },
				G: { family: 'Georgia, \'Century Schoolbook L\', serif', w: 863 },
				V: { family: 'Verdana, Geneva, \'Bitstream Vera\', sans-serif', w: 924 }
			},
				$this = $(this).append(
					'<span class="smooHide">'+
						// Create font benchmark
						function() {
							var html = '';
							for (var i in font_class)
								html += '<span class="smooFont'+i+'" style="font-family: '+font_class[i].family+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;eeeeeeeeeeeetttttttttaaaaaaaaoooooooiiiiiiinnnnnnsssssshhhhhhrrrrrrddddllllcccuuummwwffggyyppbvk</span>'
							return html;
						}()+
						'<a class="smooFocus" href="#nogo">&nbsp;</a>'+
					'</span>'+
					'<div class="smooPresentation">'+
						'<div id="smoo'+Math.floor(Math.random()*100)+'" class="smooSlideWrapper"></div>'+						
					'</div>'+
					'<ul class="smooControl">'+
						'<li class="smoothumb"><a href="#smoothumb" title="switch to thumbnail"></a></li>'+
						'<li class="smoofr"><a href="#smoofr" title="go to previous slide"></a></li>'+
						'<li class="smoor"><a href="#smoor" title="previous step"></a></li>'+
						'<li class="smoof"><a href="#smoof" title="play/next step"></a></li>'+
						'<li class="smooff"><a href="#smooff" title="go to next slide"></a></li>'+
						'<li class="smooborder"><a></a></li>'+
					'</ul>'
				),
				$presentation = $this.find('div:first').fourthirdize(true),
				// Build & init presentation
				presentation = new $.smoo.Presentation(
					$presentation.find('div:first'),
					json_presentation,
					function() {
						for (var i in font_class)
							font_class[i].coef = font_class[i].w / parseInt($this.find('span.smooFont'+i+':first').width());
						return font_class;
					}()
				),
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
				}),
				$control = $this.find('ul:last').hover(
					function(){
						if ($.smoo.controlTimer) 
							clearTimeout($.smoo.controlTimer);
						$(this).animate({bottom: '30px', height: '30px'});
					},
					function(){
						var $this = $(this);
						$.smoo.controlTimer = setTimeout(function(){
							$this.animate({height: '2px', bottom: '2px'});
						}, 800);			
					})
				.find('li').click(function(e){
					// FIX: currentTarget.className is not recognised by ie
					switch (e.currentTarget.className) {
						case 'smoor':
							presentation.rewind();
							break;
						case 'smoof':
							presentation.forward();							
							break;
						case 'smoofr':
							presentation.fastrewind();
							break;
						case 'smooff':
							presentation.fastforward();
							break;
						case 'smoothumb':
							presentation.thumbnailize();
							$(this).attr({className: 'smoofull', title: 'switch to full size'});
							break;
						case 'smoofull':
							presentation.fullsize();
							$(this).attr({className: 'smoothumb', title: 'switch to thumbnails'});
							break;
					}
					$focus.focus();
				}).end();
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
					if ($.smoo.resizeTimer) 
						clearTimeout($.smoo.resizeTimer);
					resizeTimer = setTimeout(function(){
						$presentation.fourthirdize();
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
	$.fn.fourthirdize = function(init) {
		return this.each(function() {
			var $this = $(this),
				parent_width = $this.parent().width(),
				parent_height = $this.parent().height();
			(parent_width / parent_height) > 1.33?
				$this[init? 'css' : 'animate']({
					height: '100%',
					width: parent_height * 4/3,
					fontSize: parent_height / 3 +'%'
				}, 'slow') :
				$this[init? 'css' : 'animate']({
					width: '100%',
					height: parent_width * 3/4,
					fontSize: parent_width / 4 +'%'
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