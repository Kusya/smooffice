/*
 * TODO :
 * 1. implement graphical arrows
 * 2. implements 'jump to slide' feature
 * 3. implement 'slide browser' feature
 * 4. make it ARIA !!!
 * 5. make it serializable
 * 
 * BTW :
 * We have to prevent transitions and animations to be queued at the slide level, 
 * maybe by adding a wrapper for elements inside slide,
 * or by setting queue transition to 'none', always.
 * 
 * on element animations ('animate()'), we pass a function inside the hash of css properties,
 * we should take care that it doesn't break anything ! See last line of Slide.queue()
 * 
 * le settimeout des animations doit être référencé pour être annulé en cas de forward,
 * ce qui permet de passer rapidement les animations si besoin, et d'éviter de foutre la
 * merde dans tous les cas
 * on utilisera 'e' pour savoir d'où provient le clique. Si il vient d'un slide, c'est un vrai clique
 * => Il faut voir... laisser la queue au niveau des éléments pourrait marcher aussi, à condition d'interdir
 * de mettre un next_on à null avec une animation suivante sur le même élément
 * 
 * fix explode effect, improve scale effect (fontbox), fix effects problems in animations
 * 
 * Pour que le texte affiché corresponde toujours au texte édité il faut, à la sérialisation du
 * texte, enregistrer ou sont les sauts de ligne, plutôt que les largeurs et hauteur.
 * 
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
		 * Replace the current slide by the next
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
		 * Replace the current slide by the previous
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
			// Make a new reference to the actual scope since this will be replaced by jQuery
			var this_presentation = this;			
			// Bind keydown event to the Focus anchor
			$focus = $this.prev('a.smooFocus').keydown(function(e) {
				switch (e.which) {
					// On left arrow, go one step back in the current slide
					case 37:
						this_presentation.rewind();
						break;
					// On right arrow, go one step further in the current slide
					case 39:
						this_presentation.forward();							
						break;
					// On up arrow, go one step back in the presentation
					case 38:
						this_presentation.fastrewind();
						break;
					// On down arrow, go one step further in the presentation
					case 40:
						this_presentation.fastforward();
						break;
				}
			});
			// Bind click event to the presentation container
			return $this.bind('click', this_presentation, function() {
				this_presentation.forward();
				// Give focus back to the Focus anchor
				$focus.focus();
				return false;
			});
		};
		
		var title = json.title;
		var author = json.author;
		var description = json.description || '';
		var creation_date = json.creation_date;
		
		var $this = jQuerify.call(this, $this);
		
		// initialise the loader
		var load_percentage = 0; var load_step = 100 / json.slide.length;
		
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
							if (animation.next_on != undefined && animation.next_on.constructor == Number) 
								$.smoo.T = setTimeout(function(){
									$this.parent('.smooPresentation').trigger('keydown', {keyCode: forward? 39 : 37} );
								}, forward? animation.next_on : 0);
						};
					}
					if (initial) {
						animation['el'].show();
						$this.dequeue();
					} else if (animation['o'].f) 
						animation['el'].toggle(animation['o'].f, animation['o'])
					else
						animation['el'].animate(animation['o'], animation['o'].callback);
				}
			});
			// may help to handle the special, yet unimplemented case (see todo). 
			return true
		}
		
		function jQuerify($parent, id, css) {
			$parent.append('<div id="'+id+'" class="smooSlide" />');
			// Set percentage dimensions in javascript to ensure that they will always stay in percentage
			return $('#'+id).css($.extend({display: 'none', width: '100%', height: '100%', fontSize: '100%'}, css));
		};
		
		var title = json.title || '';
		var comment = json.comment || '';
		var transition = [ json.t[0] || master.t[0], json.t[1] || master.t[1]];
		
		var $this = jQuerify($parent, id, $.extend({}, master.p, json.p));
		
		this.animation = []; this.current_animation = -1;
		for (var i in json.a)
			this.animation.push(new $.smoo.Animation(json.a[i], master.a));
		
		this.element = [];
		for (var i in json.e)
			this.element.push(new $.smoo.Element(json.e[i], master.e, $this, id+'-e'+i));
		
		this.forward(true);
	},// end Slide class
	
	Animation : function(json, master) {
		var parameters = json.p || master;
		this.next_on = json.n || null;
		this.on_element = json.o;		
		
		this.forward = function(element, initial) {
			if (initial) parameters.f = null;
			return element.forward(parameters, this.next_on);
		};
		
		this.rewind = function(element) {
			return element.rewind(parameters, this.next_on);
		};
	},
	
	Element : function(json, master, $parent, id) {
		this.forward = function(parameters, next_on) {
			if(parameters.f === undefined)	properties.unshift(parameters);
			return {el: $this, next_on: next_on, o: parameters};
		};
		
		this.rewind = function(parameters, next_on) {
			if(parameters.f === undefined)	properties.shift();
			return {el: $this, next_on: next_on, o: parameters.f === undefined? properties[0] : parameters};
		};
		
		function jQuerify($parent, id) {			
			switch(type) {
				case 'img':
					$parent.append('<img id="'+id+'" class="smooElement" src="'+content.src+'" title="'+content.title || ''+'"/>');
					break;
				default:
					$parent.append('<'+type+' id="'+id+'" class="smooElement">'+content+'</'+type+'>');
					break;
			}
			return $('#'+id);
		};
		
		var type = json.t || 'ul';
		var content = json.c;
		
		var $this = jQuerify($parent, id);
		
		// TODO try the following :
		// var properties = []; properties[0] = $.extend({width: 'auto', height: 'auto'}, master, json.p);
		var properties = []; properties[0] = $.extend({}, master, json.p);
		$this.css(properties[0]);
		
	}
  });
})(jQuery);