/*
 * BTW :
 * We have to prevent transitions and animations to be queued at the slide level, 
 * maybe by adding a wrapper for elements inside slide,
 * or by setting queue transition to 'none', always.
 * 
 * le settimeout des animations doit être référencé pour être annulé en cas de forward,
 * ce qui permet de passer rapidement les animations si besoin, et d'éviter de foutre la
 * merde dans tous les cas
 * on utilisera 'e' pour savoir d'où provient le clique. Si il vient d'un slide, c'est un vrai clique
 * => Il faut voir... laisser la queue au niveau des éléments pourrait marcher aussi, à condition d'interdir
 * de mettre un next_on à null avec une animation suivante sur le même élément
 * 
 * augmenter l'espace entre les li dans les ul
 *
 * Quand on exécute une animation sur plusieurs éléments à la fois avec find, si il y a es différences entre ces éléments, 
 * le rewind ne va pas être capable de rétablir ces différences.
 * 
 * Utiliser SVG/VML pour les dégradés à l'arrière plan. Ca va être bien !
 * 
 * Il va y avoir des soucis avec le z-index (c'est l'histoire des z-index qui vont de 10 en 10 et qui sont chiants à gérer)
 * Nan mais les zIndex c'est pas si compliqué, il peut y avoir plusieurs éléments avec le même index, c'est l'utilisateur qui se débrouille après ça.
 * 
 * Dans opera (et que dans opéra) il y a des bugs avec le overflow pendant les transitions.
 * 
 * vérifier que les styles ne s'empiètent pas les uns sur les autres, nottament ceux des masters
 * 
 * mettre de l'ombre sous la présentation
 * 
 * faire en sorte que ça marche bien dans un blog et que l'on puisse passer en full screen.
 * 
 * mouseout ne trigger pas sous ie !
 * 
 * Consider using other approach to generate the presentation instead of creating all slides : lazy ? gmaps ?
 *  
 * Tenter de ne charger les vidéos que lorsque l'on fullsize leur slide. Le reste du temps, ne charger que la miniature.
 * Pareil pour les maps.
 * 
 * il faut un presentationWrapper, parce que le margin top fuck tout, ou alors on peut se débrouiller avec le slider ?
 * 
 * PROBLEMES QU'IL VA Y AVOIR A GERER:
 * - les animations "initiales" sont des parasites qu'il ne faut pas montrer à l'utilisateur.
 * 	=> On pourrait faire en sorte de s'en passer, mais on ne peut pas se passer des animation qui cachent certaines parties des ul
 *   => Il vaut mieux filtrer ça du côté de l'éditeur si possible
 * - Il va être compliqué de gérer les fontClass dans l'éditeur wysiwyg puisque les font ne doivent pouvoir être changées
 * que pour l'ensemble du texte. Or le texte se trouve dans une iframe.
 *  => Il faut vérifier que l'on puisse insérer des balises font au début et à la toute fin du texte
 *   => Si ça s'avère possible, à l'enregistrement il faut parser les éléments texte pour remplacer ces balises par une fontClass pour l'élément. 
 *   => Sinon il faut recoder un éditeur wysiwyg sans iframe :(
 * - Lorsque les éléments sont contenus dans un tableau associatifs et que les animations font référence aux clefs des
 * éléments, c'est très efficace pour retrouver le noeud DOM sur lequel effectuer l'animation mais:
 *  - Comment définir les clefs des nouveaux éléments ajouter pour être certain que l'élément n'existe pas ?
 *  on ne peut pas les compter puisque la supression d'élément fuckerait tout.
 *   => On peut en définir un au hasard et vérifier qu'il n'existe pas déjà
 *  - Comment on supprime des éléments dans un tableau associatif ?
 *  - On ne peut pas trouver la taille de l'objet
 *  => Mieux vaut utiliser un tableau et une référence à l'id du node dans les animations.
 *   => On cré les id au hasard ! Parce qu'on ne sait pas à quelle endroit trouver le dernier
 * - transitions : à la zob
 * - zIndex : gestion directement à partir du DOM
 */

;(function($) {

  $.smoo = $.smoo || {}; //Add the 'smoo' scope
  
  $.extend($.smoo, {
	
	Presentation : function($this, json, font_class) {
		this.forward = function() {
			if (!slide[current_slide].forward())
				$this.queue(function() { changeSlide(current_slide + 1); $this.dequeue(); });
		};
		this.fastforward = function() {				
			$this.queue(function() { changeSlide(current_slide + 1); $this.dequeue(); });
		};
		this.rewind = function() {
			if (!slide[current_slide].rewind()) 
				$this.queue(function() { changeSlide(current_slide - 1); $this.dequeue(); });
		};
		this.fastrewind = function() {
			$this.queue(function() { changeSlide(current_slide - 1); $this.dequeue(); });
		};
		this.jump = function(slide_id, thumbnail) {
			changeSlide(slide_id, thumbnail);
		}
		
		this.thumbnailize = function() {
			for (var i in slide)
				if (i == current_slide) {
					slide[i].thumbnailize(true);
					$this.animate({marginTop: -18.75 * (current_slide - 1) +'%'});
				} else slide[i].thumbnailize(-1);				
		}
		
		this.fullsize = function() {
			$this.queue(function() {
				for (var i in slide)				
					if (i != current_slide) slide[i].fullsize(-1);
				$this.dequeue();
			})
		}		
		
		/*
		 * Display target slide but:
		 * - If presentation is in thumbnail mode:
		 *   - Don't play transitions
		 *   - animate resize
		 * - If presentation is in fullsize mode:
		 *   - Display transitions
		 *   - Don't animate resize
		 */
		function changeSlide(target, thumbnail) {
			// Verify target
			if (target >= 0 && target < slide.length) {
				// Play transition like a forward or a rewind?
				var forward = target > current_slide? true : false;
				// Hide current slide
				if (!thumbnail && current_slide >= 0) queue(slide[current_slide].transit(forward? 1 : 0));
				// if (!thumbnail && current_slide >= 0) queue(slide[current_slide].transit(0));
				$this.queue(function() {
					// Hide the magic of changeSlide in fullSize
					if (!thumbnail) $this.css('display', 'none');
					// Scroll to target. -18.75 is equivalent to the height of a slide.
					$this[thumbnail? 'animate' : 'css']({marginTop: -18.75 * target + '%'});
					$this.dequeue();
				})
				// fullsize target
				$this.queue(function() {
					slide[target].fullsize(thumbnail, function() { $this.dequeue(); });
				});				
				if (!thumbnail) 
					$this.queue(function() {
						if (current_slide >= 0) slide[current_slide].thumbnailize(thumbnail);
						// The trick is finished
						$this.css('display', 'block');
						current_slide = target;
						$this.dequeue();
					});
				else current_slide = target;
				// Show new slide
				if (!thumbnail) queue(slide[target].transit(forward? 0 : 1));
				//if (!thumbnail) queue(slide[target].transit(0));
				//thumbnail = false;				
			}
		}
		
		/* 
		 * Queue transitions on the presentation level
		 */
		function queue(transition) {
			$this.queue(function() {
				if (transition['o'].f) {
					transition['o'].callback = function(){ $this.dequeue();	};
					transition['el'].toggle(transition['o'].f, transition['o']);			
				// FIX: Is it possible not to have an animated transition ?
				} else {
					transition['el'].css('display', transition['el'].css('display') == 'none'? 'block' : 'none');
					$this.dequeue();
				}					
			});
		}
		
		var title = json.title,
			author = json.author,
			description = json.description || '',
			creation_date = json.creation_date,
			// Dead simple jQuerify for the presentation
			$this = $this,
			// FIX: ???? what is that ?
			$slides = false,
			// Whether presentation is in thumbnail mode or fullsize mode
			//thumbnail = false,
			slide = [],
			current_slide = -1;
		for(var i in json.slide) {
			slide.push(new $.smoo.Slide($this, $this.attr('id')+'-s'+i, json.slide[i], json.master, font_class));
			// Display first slide as soon as possbile!
			if (i == 0) {
				/* FIX: This timer is intended to avoid the lag during the generation of the creation.
				 * If the lag still occurs on modern browsers for long presentation, we should display 
				 * the first slide only when the presentation is ready
				 */
				setTimeout(function(){ changeSlide(0); }, 500);
			}
		}
	},// end Presentation class
	
	Slide : function($parent, id, json, master, font_class) {				
		/* 
		 * Try to go one step further in the slide and queue animations of this step
		 */
		this.forward = function(initial) {
			// If this is not the last animation of the slide
			if (this.current_animation < this.animation.length -1) {
				var animations = [];
				do {
					this.current_animation += 1;
					// Play the animation on its related element
					animations.unshift(this.animation[this.current_animation].forward(this.element[this.animation[this.current_animation].on_element], initial));
					// If the slide is being initialised, mark the animation to prevent them to be rewinded
					if (initial) {
						this.animation[this.current_animation].initial = true;
					}
				} while (animations[0].next_on === null && this.current_animation < this.animation.length -1)
				// Queue groups of animation that have to be executed in the same time.
				return queue(animations, true, initial);
			} else 
				return false;
		};
		
		/*
		 * Try to go one step back in the slide and queue animations of this step
		 */
		this.rewind = function() {
			// If this is not the first animation of the slide
			if (this.current_animation > -1 && !this.animation[this.current_animation].initial) {
				var animations = [];
				do {
					animations.unshift(this.animation[this.current_animation].rewind(this.element[this.animation[this.current_animation].on_element]));
					this.current_animation -= 1;
					// next_on have to be switched to have a meaning
					animations[0].next_on = this.animation[this.current_animation].next_on;
				} while (this.current_animation > -1 && !this.animation[this.current_animation].initial && animations[0].next_on === null);
				// Remove delay from animations when rewinding
				return queue(animations, false, false);
			} else {
				return false;
			}
		};
		
		/*
		 * build a transition object
		 */
		this.transit = function(i) {
			return { el: $this, o: transition[i] };
		};
		
		this.thumbnailize = function(thumbnail) {
			// modify current slide
			if (thumbnail !== -1) {
				$slide[thumbnail? 'animate' : 'css']({width: '23%', height: '23%', fontSize: '23%'}, thumbnail? 'slow' : undefined);			
				// fix slide position, see fullsize.
				$slide.css({ position: 'relative' });
				if ($.browser.msie) $slide.css({marginLeft : 'auto'});
				for (var i in this.element)
					this.element[i].thumbnailize();
			}
			// just show others
			else $this.css('display', 'block');						
		};
		
		this.fullsize = function(thumbnail, callback) {
			// modify current slide
			if (thumbnail !== -1) {
				var o = {duration: thumbnail? 'slow' : 1, complete: callback };
				$slide.animate({width: '100%', height: '100%', fontSize: '100%'}, o);
				// fix problems of approximated slide position
				$slide.queue(function() {
					$slide.css({position: 'absolute', top: 0});
					if ($.browser.msie) $slide.css({marginLeft: '-38.5%'});
					$slide.dequeue();
				});
				for (var i in this.element)
					this.element[i].fullsize();
			}// hide others
			else $this.css('display', 'none');			
		};
		
		/*
		 * Queue animations on the slide level
		 */
		function queue(animations, forward, initial) {			
			$this.queue(function() {
				while(animations.length > 0) {
					var animation = animations.pop();
					// Set the callback on the last animation
					if (animations.length == 0) {
						animation['o'].callback = function(){
							$this.dequeue();
							// TODO : handle case where initial && constructor == Number,
							// where we have to fire a forward after the intro transition
							if (animation.next_on !== null && animation.next_on.constructor == Number) 
								$.smoo.animationTimer = setTimeout(function(){
									$this.parent('div.smooPresentation').prev('a.smooFocus').trigger('keydown', forward? 39 : 37);
								}, forward? animation.next_on : 0);
						};
					}
					if (initial) {
						animation['el'].css('display', animation['o'] == 'hide'? 'none' : 'block');
						$this.dequeue();
					} else if (animation['o'].f) 
						animation['el'].toggle(animation['o'].f, animation['o'])
					else
						animation['el'].animate(animation['o'], animation['o'].callback);
				}
			});
			// may help to handle the special, yet unimplemented case (see todo). 
			return true;
		};
		
		function jQuerify($parent, id, css) {
			$parent.append('<div class="smooSlide"><div id="'+id+'" class="smooElementWrapper" /></div>');
			// Set percentage dimensions in javascript to ensure that they will always stay in percentage
			// FIX: oups, I removed the folowing line of code without reading the previous comment
			// return $('#'+id).css($.extend({width: 100%, height: 100%, fontSize: 100%}, css));
			return $('#'+id).css(css);
		};
		
		var comment = json.c || '',
			use_master = json.m || false,
			transition = [ json.t[0] || master.t[0], json.t[1] || master.t[1]],		
			$this = jQuerify($parent, id, use_master? $.extend({}, master[use_master].p, json.p) : json.p),
			$slide = $this.parent();
		
		this.animation = []; this.current_animation = -1;
		for (var i in json.a)
			this.animation.push(new $.smoo.Animation(json.a[i]));
		
		// add background elements first
		if (use_master) for (var i in master[use_master].b) {
			master[use_master].b[i].p['display'] = 'block';
			new $.smoo.Element($this, id+'-m'+i, master[use_master].b[i], false, font_class);
		}			
		
		this.element = {};
		for (var i in json.e)
			this.element[i] = new $.smoo.Element($this, id+'-'+i, json.e[i], use_master && master[use_master].e[json.e[i].t]? master[use_master].e[json.e[i].t] : false, font_class);		
		
		this.forward(true);
	},// end Slide class
	
	Animation : function(json) {
		var parameters = json.p || {},
			find = json.f || null;
		this.next_on = json.n === undefined? null : json.n;
		this.on_element = json.o;
				
		
		this.forward = function(element, initial) {
			if(initial) parameters.f = null;
			return element.forward(parameters, this.next_on, find);
		}
		
		this.rewind = function(element) {
			return element.rewind(parameters, this.next_on, find);
		}
	},
	
	Element : function($parent, id, json, master, font_class) {
		this.forward = function(parameters, next_on, find) {
			if(parameters.f === undefined && parameters.constructor != String)	properties.unshift($this.filterCss(parameters));
			return {el: find? $this.find(find) : $this, next_on: next_on, o: parameters};
		}
		
		this.rewind = function(parameters, next_on, find) {
			return {el: find? $this.find(find) : $this, next_on: next_on, o: parameters.f === undefined? properties.shift() : parameters};
		}
		
		this.thumbnailize = function() {
			if (type == 'video')
				$this.children('object:first').replaceWith('<img width="100%" height="100%" src="'+content.img+'" title="replacement image for a video"/>');
		}
		
		this.fullsize = function() {
			if (type == 'video')
				$this.children('img:first').replaceWith(
					'<object width="100%" height="100%" style="z-index:1;position:absolute">' +
						'<param name="movie" value="' + content.src + '&hl=en"></param>' +
						'<param name="wmode" value="transparent"></param>' +
						'<embed width="100%" height="100%" src="' + content.src + '&hl=en" type="application/x-shockwave-flash" wmode="transparent"></embed>' +
					'</object>'
				);
		}
		
		function jQuerify($parent, id, css, font_class) {			
			switch(type) {
				case 'img':
					$parent.append('<img id="'+id+'" class="smooElement" src="'+content.src+'" title="'+(content.title || '')+'"/>');
					break;
				case 'video':
					$parent.append(	'<div id="'+id+'" class="smooElement"><img width="100%" height="100%" src="'+content.img+'" title="replacement image for a video"/></div>' );
					break;
				case 'map':
					$parent.append('<div id="'+id+'" class="smooElement"></div>');
					new GoogleMap(document.getElementById(id), content);
					break;
				default:
					// Remove '%' and make sure there is a fontSize
					css.fontSize = parseInt(css.fontSize) || 100;
					// We need an extra className to keep trac of fontClass and original fontSize
					$parent.append('<'+type+' id="'+id+'" class="smooElement smoo'+css.fontClass + css.fontSize+'">'+content+'</'+type+'>');
					// Adjust fontSize according to fontClass
					css.fontSize = font_class[css.fontClass].coef * css.fontSize + '%';
					css.fontFamily = font_class[css.fontClass].family;
					break;
			}
			return $('#'+id).css(css);
		};
		
		var type = json.t,
			content = json.c,
			properties = [],
			$this = jQuerify($parent, id, $.extend({}, master, json.p), font_class);
		
		// TODO try the following :
		// var properties = []; properties[0] = $.extend({width: 'auto', height: 'auto'}, master, json.p);
		// Not a good idea since every element need properly defined properties to rewind properly to initial state
		/*
		 * <object width="100%" height="100%" style="z-index:1;position:absolute">' +
										'<param name="movie" value="' + content + '&hl=en"></param>' +
										'<param name="wmode" value="transparent"></param>' +
										'<embed width="100%" height="100%" src="' + content + '&hl=en" type="application/x-shockwave-flash" wmode="transparent"></embed>' +
									'</object>
		 */
	}
  });
})(jQuery);