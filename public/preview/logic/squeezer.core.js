/*
 * This file of "classes" extending jQuery
 * The aim is to use jQuery constructor - $('...') - as few as possible
 * - properties are made public using jQuery.data()
 * - there is no method but event instead
 *
 *
 * DOM reference rules:
 * - Only a parent can pass brothers to children
 * - An element can only trigger events on parent, children or brothers provided by the parent
 * - Previous rules may be ignored for $presentation
 *
 * Avantages/Inconvéniants/fausse idées sur cette structure
 * - l'objet jQuery d'un élément est toujours à portée main. au lieu de faire element.$this on fait $element.
 * - Il suffit de retrouver l'objet jQuery d'un élément pour avoir accès à toutes ces méthodes.
 * Pas besoin de se trimbaler des objets obligatoirement initialisés à l'avance (see jquery.slideMe.js)
 * - Ca n'aide absolument pas pour l'extensibilité du code. On ne peut pas binder des évènements depuis l'extérieur
 * puisque l'on aurait plus accès aux variables privées
 * - C'est certainement mois performant que des classes javascript classiques.
 * - Une classe javascript ça peut s'étendre avec prototype
 * (même si prototype n'est pas compatible avec l'anonymisation utilisée ici)
 */
(function($) {
    $.fn.view = function($navBar, font_coefs) {
        return this.each(function() {
            var $this = $(this),
                $presentation = $this.children(':first').presentation(font_coefs),
                $navSlider = $this.children(':last').navSlider($presentation);


            // Set view dimensions to 4/3 and adjust fontSize to view dimensions
            $this.resize(function(e, duration) {
                var parent_width = $this.parent().width(),
                    parent_height = $this.parent().height();
                (parent_width / parent_height) > 1.33?
                    $this[duration? 'animate' : 'css']({
                        height: '100%',
                        width: parent_height * 4/3,
                        fontSize: parent_height / 3 +'%'
                    }, duration) :
                    $this[duration? 'animate' : 'css']({
                        width: '100%',
                        height: parent_width * 3/4,
                        fontSize: parent_width / 4 +'%'
                    }, duration);
                return $this;

            }).click(function() {
                // Always give focus back to keylogger
                $navBar.focus();
                // Never let click bubble on a higher element
                return false;

            }).bind('toggleNavigation', function() {
                $navBar.trigger($presentation.hasClass('sldmThumbnail')? 'show' : 'hide');
                $navSlider.trigger($presentation.hasClass('sldmThumbnail')? 'hide' : 'show');
            });
        });
    };


    $.fn.presentation = function(font_coefs) {
        return this.each(function() {
            var $this = $(this)
                    // Hide the magic of initialisation & assign unique id
                    .hide().attr('id', function() {
                        do {
                            var id = 'sldm-p'+ Math.round(Math.random()*100);
                        } while($('#'+id).length);
                        return id;
                    }()),
                // TODO: Regenerate presentation content from persistance
                $slides = $this.children().slide($this.attr('id'), font_coefs),
                $view = $this.parent(),
                current_slide = 0,

                transit = function(slide_id, aft) {
                    $this.queue(function() {
                        var $slide = $slides.eq(slide_id);
                        if(slide_id != current_slide)
                            $slide.trigger('fullsize');
                        // Fade when there is no explicit transition
						var transition = $slide.data('transition')[(slide_id == current_slide && aft) || (slide_id != current_slide && !aft)? 0 : 1] || {effect: "fade"};
                            transition.callback = function() {
                                if(slide_id == current_slide)
                                    $slide.trigger('thumbnailize');
								
								$this.dequeue();
                            };
                        $slide.toggle(transition.effect, transition);                        
                    });
                },

                jump = function(target) {
                    if(target >= 0 && target < $slides.length) {
                        // rewind or forfward ?
						var aft = target < current_slide;
						// Execute the transition on the current slide
                        transit(current_slide, aft);
                        // Update the view
						$this.css({marginTop: -18.75 * target +'%'});
                        // Execute the transition on the target slide
                        transit(target, aft);
						
                        // Make sure current slide is hidden. TOFIX: usefull ?
                        //$slides.eq(current_slide).css({display: 'none'});
                        $this.queue(function() {
                            current_slide = target;
							//$this.trigger(aft? 'rewind' : 'forward');							
							$this.dequeue();
                        });
                    }                    
                };


            $this.data('length', $slides.length)
			
			.click(function(e) {
				// Display target slide
                if ($this.hasClass('sldmThumbnail')) {
					var elem = e.target, slide_id;
					// Search for the id of clicked slide
					do {
						slide_id = elem.id? elem.id.match(/^sldm-.*?-s(\d*)/) : false;
						elem = elem.parentNode;
					} while (!slide_id && elem)
					// Back to fullsize
					if (elem) {
                        current_slide = slide_id[1];
						$this.trigger('fullsize', slide_id[1]);
						$view.trigger('toggleNavigation');
					}                    
				} else
					$this.trigger('forward');				

            }).bind('fullsize', function(e, slide_id) {
                $this.animate({marginTop: -18.75 * current_slide +'%'}, function() { $this.removeClass('sldmThumbnail'); });
                $slides.eq(slide_id).trigger('fullsize', function() {                    
                    $slides.not(':eq('+slide_id+')').css('display', 'none');
                });

            }).bind('thumbnailize', function() {
                $slides.css({display: 'block'});
                $this.addClass('sldmThumbnail').animate({marginTop: -18.75 * (current_slide -1) +'%'});
                $slides.eq(current_slide).trigger('thumbnailize', true);
                
            }).bind('forward', function() {
                $slides.eq(current_slide).trigger('forward');

            }).bind('rewind', function() {
                $slides.eq(current_slide).trigger('rewind');

            }).bind('fastforward', function() {
                jump(current_slide +1);

            }).bind('fastrewind', function() {
				jump(current_slide -1);

            }).bind('jump', function(e, target) {
                jump(target);
            });

            $slides.eq(0).trigger('fullsize').css('display', 'block');
			$this.css({display: 'block'});			
        });
    };

    /*
     * Init sldmSlide
     */
    $.fn.slide = function(parent_id, font_coefs) {
        return this.each(function(i) {
            var $this = $(this).attr('id', parent_id+'-s'+i).css({display: 'none'}),
                $presentation = $this.parent(),
                $elements = $this.children('.sldmElement').element($this.attr('id'), font_coefs),
                // Read inner json
                json = JSON.parse($this.children('script:first').html().replace(/^.*?\{/m, '{')),
                current_animation = -1,
				
				animate = function(animation, delay, $element) {
					setTimeout(function() {
						// Don't queue animation on an element level, we take care of it.
	                    // FIX: it doesn't work for all effects !
	                    animation.o['queue'] = false;
						animation.o['duration'] = animation['o'].duration;
	                    $element[animation.type == 'animate'? 'effect' : 'toggle'](animation.o['effect'], animation.o);
					}, delay);								                    
				},
                
				forwind = function(aft) {
					if(aft && current_animation == -1)
						$presentation.trigger('fastrewind');
					else if(!aft && current_animation == json.animations.length -1)
						$presentation.trigger('fastforward');
					else $this.queue(function() {
						var anims = json.animations,
							x_length = anims.length,
							x = current_animation,
							delay = 0,
							to_add = 0;
						do {
							if(!aft) x++;
								var $element = $elements.filter('#'+$this.attr('id')+'-'+anims[x].id),
									animation = anims[x];																		
								if(animation.trigger == 'after') delay += to_add;								
								animate(animation, animation['o'].delay + delay, $element);
								to_add = animation['o'].delay + animation['o'].duration;
							if(aft) x--;
						} while(((!aft && x < x_length -1) || (aft && x > -1)) && anims[x+1].trigger != 'click')
						current_animation = x;
						if ($element.length) $element.queue(function(){
							$element.dequeue();
							$this.dequeue();
						});
						else $this.dequeue();
					});
				};


            $this.data('transition', json.transition)
			
			.bind('transit', function(e, o) {
                var transition = json.transition[o.t_id];
                    transition.callback = o.callback;
                // Switch the class first
                $this.toggle(transition.effect, transition);

            }).bind('fullsize', function(e, animated) {
                $this[animated? 'animate' : 'css']({width: '100%', height: '100%', fontSize: '100%'}, animated);
				$this.queue(function() {
					$this.css('position', 'absolute');
					$this.dequeue();
				})

            }).bind('thumbnailize', function(e, animated) {
                $this.css('position', 'relative')[animated? 'animate' : 'css']({width: '23%', height: '23%', fontSize: '23%'});

            }).bind('forward', function() {
                forwind(0);

            }).bind('rewind', function() {
                forwind(1);

            }).bind('jump', function(e, i) {
                zob
				
            });
        });
    };

    /*
     * Init sldmElement
     */
    $.fn.element = function(parent_id, font_coefs) {
        return this.each(function() {                
            var $this = $(this),
                // Find fontClass
                match = $this.attr('id', parent_id +'-'+ $this.attr('id')).attr('class').match(/sldmFont./);


            $this.bind('applyFont', function(e, fontClass) {
                // Retrieve original fontSize
                var font_size = $this.attr('data-fontsize') || function(fs) {
                    return /%/.test(fs)? parseInt(fs) : 100;
                }($this.css('fontSize'));
                // Update element
                $this.attr('class', 'sldmElement').addClass(fontClass).attr('data-fontsize', font_size)
                .css('fontSize', font_size * font_coefs[fontClass] +'%');

            }).bind('editable', function(e, editable) {
                if (editable) {

                }
            });
            // Apply font & Store original css values for use when rewinding to initial state
            // FIX: make sure the coeficiented fontSize is stored
            if (match) $this.trigger('applyFont', match[0]).cssStore();
        });
    };

    /*
     * Init sldmNavSlider
     */
    $.fn.navSlider = function($presentation) {
        return this.each(function() {
            var $this = $(this).slider({
                    handle: ':first',
                    axis: 'vertical',
                    min: 0,
                    max: 150,
                    stop: function(e, ui) {
                        $presentation.animate({'marginTop' : ($presentation.data('length') * ui.value / 150 -1) * -18.75 +'%'}, 500);
                    },
                    slide: function(e, ui) {
                        $presentation.css('marginTop', ($presentation.data('length') * ui.value / 150 -1) * -18.75 +'%');
                    }
                }),
                $handle = $this.children(':first').unbind('keydown');


            // Overwrite keydown event to invert y axis and use steps
			$this.keydown(function(e) {
				switch(e.which) {
					case 38:
						$this.slider('moveTo', $this.slider('value') - 150 / $presentation.data('length'));
						break;
					case 40:
						$this.slider('moveTo', $this.slider('value') + 150 / $presentation.data('length'));
						break;
				}

            }).bind('show', function() {
                $this.fadeIn();
                $handle.focus();

            }).bind('hide', function() {
                $this.fadeOut();

            }).bind('update', function(e, step) {
                $this.slider('moveTo', step * 150 / $presentation.data('length'), undefined, true);
            
            // click on navSlider shouldn't bubble to the view
            }).click(function() { return false; });
        });
    };

    /*
     * Init sldmNavBar
     */
    $.fn.navBar = function($view) {
        return this.each(function() {
            var $this = $(this),
                $keylogger = $this.children('a:first'),
                $bar = $this.children('ul:first'),
                $presentation = $view.children(':first');


            // Toggle navBar visibility
            $this.mouseover(function() {
                if ($.sldm.navTimer) 
					clearTimeout($.sldm.navTimer);
				// Show it only in fullsize mode
                if (!$presentation.hasClass('sldmThumbnail')) $bar.animate({bottom: '0px'});

            }).mouseout(function(){
				$.sldm.navTimer = setTimeout(function(){
					if ($this.is(':visible'))
                        $bar.animate({bottom: '-28px'});
				}, 800);

            }).bind('click keydown', function(e){
				// Extract "keycode"
                switch (arguments[1] || e.keyCode || parseInt(e.target.className.match(/sldm(\d*)/)[1])) {
					case 37:
						$presentation.trigger('rewind');
						break;
					case 39:
						$presentation.trigger('forward');
						break;
					case 38:
						$presentation.trigger('fastrewind');
						break;
					case 40:
						$presentation.trigger('fastforward');
						break;
					case 109:
                        $view.trigger('toggleNavigation');
                        $presentation.trigger('thumbnailize');                        
						break;
				}
				return false;

            }).bind('show', function() {
                $this.fadeIn();
                $keylogger.focus();

            }).bind('hide', function() {
                $this.fadeOut();
            });
        })
    };    
})(jQuery);