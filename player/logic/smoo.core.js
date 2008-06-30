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
 */

;(function($) {

  $.smoo = $.smoo || {}; //Add the 'smoo' scope
  
  $.extend($.smoo, {
	
	Presentation : function(json, $this) {
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
				this.current_slide += 1;
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
				this.current_slide -= 1;
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
				this.current_slide = slide;
				queue(this.slide[this.current_slide].transit(forward? 0 : 1));
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
				} else {
					transition['el'].css('display', transition['el'].css('display') == 'none'? 'block' : 'none');
					$this.dequeue();
				}					
			});
		};
		
		/*
		 * Execute all jQuery related processing
		 */
		function jQuerify($this) {
			// Not needed ?
		};
		
		var title = json.title,
			author = json.author,
			description = json.description || '',
			creation_date = json.creation_date,
			// Dead simple jQuerify for the presentation
			$this = $this,		
			// initialise the loader
			load_percentage = 0; var load_step = 100 / json.slide.length;
		
		this.slide = []; this.current_slide = 0;
		for(var i in json.slide) {
			this.slide.push(new $.smoo.Slide(json.slide[i], json.master, $this, $this.attr('id')+'-s'+i));
			load_percentage += load_step;
		}
		
		queue(this.slide[this.current_slide].transit(0));
	},// end Presentation class
	
	Slide : function(json, master, $parent, id) {				
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
								$.smoo.T = setTimeout(function(){
									$this.parent('div.smooPresentation').prev('a.smooFocus').trigger('keydown', forward? 39 : 37);
								}, forward? animation.next_on : 0);
						};
					}
					if (initial) {
						animation['o'] != 'hide' ? animation['el'].show() : animation['el'].css('display', 'none');
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
		
		function jQuerify($parent, id, css, master_class) {
			$parent.append('<div id="'+id+'" class="smooSlide '+master_class+'" />');
			// Set percentage dimensions in javascript to ensure that they will always stay in percentage
			return $('#'+id).css($.extend({display: 'none', width: '100%', height: '100%', fontSize: '100%'}, css));
		};
		
		this.serialize = function() {
			return {
				c: comment,
				zob: zob
			};
		}
		
		var comment = json.c || '',
			use_master = json.m || false,
			transition = [ json.t[0] || master.t[0], json.t[1] || master.t[1]],
		
			$this = jQuerify($parent, id, json.p, use_master? use_master : '');
		
		this.animation = []; this.current_animation = -1;
		for (var i in json.a)
			this.animation.push(new $.smoo.Animation(json.a[i]));
		
		// add background elements first
		if (use_master) for (var i in master[use_master].b) {
			master[use_master].b[i].p['display'] = 'block';
			new $.smoo.Element(master[use_master].b[i], $this, id+'-m'+i);
		}			
		
		this.element = {};
		for (var i in json.e)
			this.element[i] = new $.smoo.Element(json.e[i], $this, id+'-'+i);		
		
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
	
	Element : function(json, $parent, id) {
		this.forward = function(parameters, next_on, find) {
			if(parameters.f === undefined)	properties.unshift($this.filterCss(parameters));
			return {el: find? $this.find(find) : $this, next_on: next_on, o: parameters};
		};
		
		this.rewind = function(parameters, next_on, find) {
			return {el: find? $this.find(find) : $this, next_on: next_on, o: parameters.f === undefined? properties.shift() : parameters};
		};
		
		function jQuerify($parent, id, css) {			
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
					$parent.append('<'+type+' id="'+id+'" class="smooElement">'+content+'</'+type+'>');
					break;
			}
			return $('#'+id).css(css);
		};
		
		this.serialize = function(master) {
			var style = $this.filterCss({top:0, left:0, width:0, height:0});
			switch(type) {
				case 'img':
					content = {src: $this.attr('src'), title: $this.attr('title')};
					break;
				case 'video':
					content = $this.find('embed').attr('src');
					break;
				case 'map':
					// TODO	content = 'todo';
					break;
				default:
					content = $this.html();
					style = $.extend($this.filterCss({fontSize: 0, color: 0}, master[type]), style);
					break;
			}
			return {
				t: type,
				c: content,
				p: style
			};
		}
		
		var type = json.t || 'ul',
			content = json.c,
			properties = [],
			$this = jQuerify($parent, id, json.p);
		
		// TODO try the following :
		// var properties = []; properties[0] = $.extend({width: 'auto', height: 'auto'}, master, json.p);
		// Not a good idea since every element need properly defined properties to rewind properly to initial state
	}
  });
})(jQuery);