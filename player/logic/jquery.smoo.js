;(function($) {
	/* 
	 * Extend jQuery to create a presentation out of a json file
	 */
	$.fn.smoo = function(json_presentation, full_screen) {
		return this.each(function() {
			var font_class = {
					A: { family: 'Arial, Sans, FreeSans, sans-serif', w: 803 },
					T: { family: '\'Times New Roman\', Serif, Times, FreeSerif, serif', w: 704 },
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
					'<div class="smooView">'+
						'<div id="smoo'+Math.floor(Math.random()*100)+'" class="smooPresentation"></div>'+
						'<div class="smooSlider"><div class="smooHandle" /></div>'+
					'</div>'+
					'<ul class="smooControl">'+
						'<li><a class="smoothumb" href="#smoothumb" title="switch to thumbnail"></a></li>'+
						'<li><a class="smoofr" href="#smoofr" title="go to previous slide"></a></li>'+
						'<li><a class="smoor" href="#smoor" title="previous step"></a></li>'+
						'<li><a class="smoof" href="#smoof" title="play/next step"></a></li>'+
						'<li><a class="smooff" href="#smooff" title="go to next slide"></a></li>'+
						'<li><a class="smooborder"></a></li>'+
					'</ul>'
				),
				$view = $this.children('div:first').fourthirdize(true),
				$presentation = $view.children(':first'),
				// Build & init presentation
				presentation = new $.smoo.Presentation(
					$presentation,
					json_presentation,
					function() {
						for (var i in font_class)
							font_class[i].coef = font_class[i].w / parseInt($this.find('span.smooFont' + i + ':first').width());
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
				$control = $this.children('ul:first'),
				$slider = $view.children(':last');
			$slider.slider({
				handle: ':first',
				axis: 'vertical',
				min: 0,
				max: 150,
				stop: function(event, ui) {
                    $presentation.animate({'marginTop' : (presentation.length * ui.value / 150 -1) * -18.75 +'%'}, 500);
                },
                slide: function(event, ui) {
                    $presentation.css('marginTop', (presentation.length * ui.value / 150 -1) * -18.75 +'%');
                }
			// UGLY: Overwrite keydown event to invert y axis and use steps
			}).keydown(function(e) {
				switch(e.which) {
					case 38:
						$slider.slider('moveTo', $slider.slider('value') - 150 / presentation.length);
						break;
					case 40:
						$slider.slider('moveTo', $slider.slider('value') + 150 / presentation.length);
						break;
				}
			}).children(':first').unbind('keydown');			
			$control.mouseover(function(){
				if ($.smoo.controlTimer) 
					clearTimeout($.smoo.controlTimer);
				if (!$view.is('.thumbnail')) $control.animate({bottom: '30px', height: '30px'});
			}).mouseout(function(){
				$.smoo.controlTimer = setTimeout(function(){
					if ($control.is(':visible'))
						$control.animate({height: '2px', bottom: '2px'});
				}, 800);
			}).click(function(e){
				switch (e.target.className) {
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
						$control.fadeOut('slow');						
						presentation.thumbnailize();
						$view.addClass('thumbnail');
						break;						
				}
				// $slider.slider('focus', ['.smooHandle', $slider], true);
				e.target.className != 'smoothumb'? $focus.focus() : $slider.fadeIn('slow').children(':first').focus();
			}).mouseout();
			// Bind click event to the view
			$view.bind('click', function(e) {
				if ($view.is('.thumbnail')) {
					var elem = e.target, slide_id;
					// Search for the id of clicked slide
					do {
						slide_id = elem.id? elem.id.match(/^smoo\d*?-s(\d*)/) : false;
						elem = elem.parentNode;
					} while (!slide_id && elem)
					// Back to fullsize
					if (elem) {
						presentation.jump(parseInt(slide_id[1]), true);
						$view.removeClass('thumbnail');
						presentation.fullsize();
						$control.fadeIn('slow').mouseout();
						$slider.fadeOut('slow');
					}
				} else
					presentation.forward();
				// Give focus back to the Focus anchor
				$focus.focus();
				return false;
			});
			$presentation.bind('updateSlider', function(e, step) {
				$slider.slider('moveTo', step * 150 / presentation.length, undefined, true);
			});
			if (full_screen) {
				// This anchor is used to catch keydown event and need to keep focus.
				$focus.focus();
				// Keep the presentation in 4/3rd, fixed for the weird window.resize event in IE and safari.
				var resizeTimer = null;
				$(window).resize(function(){
					if ($.smoo.resizeTimer) 
						clearTimeout($.smoo.resizeTimer);
					resizeTimer = setTimeout(function(){
						$view.fourthirdize();
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
})(jQuery);