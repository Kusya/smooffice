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
 * 
 * dans opera il y a des bugs avec le overflow pendant les transitions. Voir comment ça se passe dans Safari.
 * 
 * ca merde dans ie à cause du control. 
 * 
 * vérifier que les styles ne s'empiètent pas les uns sur les autres, nottament ceux des masters
 * 
 * mettre de l'ombre sous la présentation
 * 
 * faire en sorte que ça marche bien dans un blog et que l'on puisse passer en full screen.
 * 
 * IE et opera ils introduisent un décalage sous les slides au fur et à mesur que la présentation avance
 * à cause d'une mauvaise gestion des arrondis.
 */

;(function($) {

  $.smoo = $.smoo || {}; //Add the 'smoo' scope
  
  $.extend($.smoo, {
	
	Presentation : function($this, json, font_class) {
		/* 
		 * Go one step further in the current slide
		 * or to next slide.
		 */
		this.forward = function() {
			if (!this.slide[this.current_slide].forward())
				this.fastforward();
		};
		/* 
		 * Replace current slide by next slide
		 */
		this.fastforward = function() {				
			// If it isn't the last slide
			if (this.current_slide < this.slide.length -1) {
				queue(this.slide[this.current_slide].transit(1));
				changeSlide(this.current_slide += 1);
				// TODO : forward if there is delayed animations at the beginning of the slide.
				queue(this.slide[this.current_slide].transit(0));
			}
		};
		
		/* 
		 * Go one step back in the current slide
		 * or to previous slide.
		 */			
		this.rewind = function() {
			if (!this.slide[this.current_slide].rewind()) 
				this.fastrewind();
		};
		
		/* 
		 * Replace current slide by the previous slide
		 */
		this.fastrewind = function() {
			// if it isn't the first slid
			if (this.current_slide > 0) {
				queue(this.slide[this.current_slide].transit(0));
				changeSlide(this.current_slide -= 1);
				queue(this.slide[this.current_slide].transit(1));
			}
		};
		
		/*
		 * Replace current slide by this one
		 */
		this.jump = function(slide) {
			// if it's a slide
			if (slide >= 0 && slide < this.slide.length && slide != this.current_slide) {
				// Play transition like a forward or a rewind?
				var forward = slide > this.current_slide? true : false;
				queue(this.slide[this.current_slide].transit(forward? 1 : 0));
				changeSlide(this.current_slide = slide);
				queue(this.slide[this.current_slide].transit(forward? 0 : 1));
			}
		}
		
		this.thumbnailize = function() {
			$this.animate({marginTop: (-20 * this.current_slide) + 20 +'%', width: '25%', fontSize: '25%'}, 'slow');
			for (var i in this.slide)
				this.slide[i].thumbnailize();
		}
		
		this.fullsize = function() {
			$this.animate({marginTop: -80 * this.current_slide +'%', width: '100%', fontSize: '100%'}, 'slow');
			for (var i in this.slide)
				this.slide[i].fullsize(this.current_slide != i);
		}
		
		/* 
		 * Queue transitions on the presentation level
		 */
		function queue(transition) {
			$this.queue(function() {
				if (transition['o'].f) {
					transition['o'].callback = function(){ $this.dequeue();	};
					transition['el'].toggle(transition['o'].f, transition['o']);			
				} else {
					transition['el'].css('display', transition['el'].css('display') == 'none'? 'block' : 'none');
					$this.dequeue();
				}					
			});
		}
		
		/*
		 * Modify slideWrapper position to display current slide
		 */
		function changeSlide(target) {
			$this.queue(function(){
				$this.css('marginTop', -80 * target +'%');
				$this.dequeue();
			})
		}
		
		/*
		 * Execute all jQuery related processing
		 */
		function jQuerify($this) {
			// Not needed ?
		}
		
		var title = json.title,
			author = json.author,
			description = json.description || '',
			creation_date = json.creation_date,
			// Dead simple jQuerify for the presentation
			$this = $this,
			$slides = false,		
			// initialise the loader
			load_percentage = 0; var load_step = 100 / json.slide.length;
		
		this.slide = []; this.current_slide = 0;
		for(var i in json.slide) {
			this.slide.push(new $.smoo.Slide($this, $this.attr('id')+'-s'+i, json.slide[i], json.master, font_class));
			// Display first slide as soon as possbile!
			if (i == 0) {
				var scope = this;
				/* FIX: This timer is intended to avoid the lag during the generation of the creation.
				 * If the lag still occurs on modern browsers for long presentation, we should display 
				 * the first slide only when the presentation is ready
				 */
				setTimeout(function(){ queue(scope.slide[scope.current_slide].transit(0)); }, 500);
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
		
		this.thumbnailize = function() {
			$slide.animate({height: '25%'}, 'slow');
			$this.css('display', 'block');			
		};
		
		this.fullsize = function(hide) {
			$slide.animate({height: '100%'}, {
				duration: 'slow',
				complete: function() {
					if (hide) $this.css('display', 'none');
				}
			});
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
		
		this.serialize = function(master) {
			var slide = {};			
			if (comment) slide.c = comment;
			if (use_master) slide.m = use_master;
			slide.t = [];
			slide.t[0] = (master && transition[0].toSource() == master.t[0].toSource())? null : transtion[0];
			slide.t[1] = (master && transition[1].toSource() == master.t[1].toSource())? null : transtion[1];
			slide.p = $this.filterCss({backgroundColor:0});
			slide.e = [];
			for (var i in this.element)
				slide.e[i] = this.element[i].serialize();
			return slide;
		}
		
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
		};
		
		this.rewind = function(element) {
			return element.rewind(parameters, this.next_on, find);
		};
	},
	
	Element : function($parent, id, json, master, font_class) {
		this.forward = function(parameters, next_on, find) {
			if(parameters.f === undefined && parameters.constructor != String)	properties.unshift($this.filterCss(parameters));
			return {el: find? $this.find(find) : $this, next_on: next_on, o: parameters};
		};
		
		this.rewind = function(parameters, next_on, find) {
			return {el: find? $this.find(find) : $this, next_on: next_on, o: parameters.f === undefined? properties.shift() : parameters};
		};
		
		function jQuerify($parent, id, css, font_class) {			
			switch(type) {
				case 'img':
					$parent.append('<img id="'+id+'" class="smooElement" src="'+content.src+'" '+(content.title? 'title="'+content.title+'"' : '')+'/>');
					break;
				case 'video':
					$parent.append(	'<div id="'+id+'" class="smooElement"><object width="100%" height="100%" style="z-index:1;position:absolute">' +
										'<param name="movie" value="' + content + '&hl=en"></param>' +
										'<param name="wmode" value="transparent"></param>' +
										'<embed width="100%" height="100%" src="' + content + '&hl=en" type="application/x-shockwave-flash" wmode="transparent"></embed>' +
									'</object></div>');
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
		
		this.serialize = function(master) {
			var element = {};
			element.p = $this.filterCss({top:0, left:0, width:0, height:0});
			element.t = type;			
			switch(type) {
				case 'img':
					element.c = {src: $this.attr('src'), title: $this.attr('title')};
					break;
				case 'video':
					element.c = $this.find('embed').attr('src');
					break;
				case 'map':
					// TODO	content = 'todo';
					break;
				default:
					element.c = $this.html();
					element.p = $.extend($this.filterCss({fontSize:0, fontWeight:0, color:0, textAlign:0}, master? master[type] : undefined), element.p);
					break;
			}
			return element;
		}
		var type = json.t,
			content = json.c,
			properties = [],
			$this = jQuerify($parent, id, $.extend({}, master, json.p), font_class);
		
		// TODO try the following :
		// var properties = []; properties[0] = $.extend({width: 'auto', height: 'auto'}, master, json.p);
		// Not a good idea since every element need properly defined properties to rewind properly to initial state
	}
  });
})(jQuery);