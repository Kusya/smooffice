/*
 * TODO :
 * 1. replace enchants effects
 * 2. implements element animation
 * 3. implements 'master slide' feature
 * 4. implements 'jump to slide' feature
 * 5. implement 'slide browser' feature
 * 6. reduce content size
 * 7. remove contextmenu
 * 8. test, test, test & comment
 */

;(function($) {

  $.jssv = $.jssv || {}; //Add the 'jssv' scope

  $.extend($.jssv, {
	
	/*
	 * class Presentation
	 */
	Presentation : function(json, $this) {
		/* privileged method forward
		 * Go one step further in the current slide
		 * or in the presentation if impossible.
		 */			
		this.forward = function() {
			if (!this.slide[this.current_slide].forward())
				this.fastforward();
		}
		/* privileged method fastforward
		 * Go one step further in the presentation.
		 */
		this.fastforward = function() {				
			// If it isn't the last slide
			if (this.current_slide < this.slide.length -1) {
				// hide the current slide
				this.slide[this.current_slide].toggleTransition(1);
				this.current_slide += 1;
				// Go one step further in the slide if no animation has been played in it
				if (this.slide[this.current_slide].current_animation == -1) {
					this.slide[this.current_slide].forward();
				}					
				// show the current slide
				this.slide[this.current_slide].toggleTransition(0);
			}
		}
		
		/* privileged method rewind
		 * Go one step back in the current slide
		 * or in the presentation if impossible.
		 */			
		this.rewind = function() {
			if (!this.slide[this.current_slide].rewind())
				this.fastrewind();
		}
		
		/* privileged method fastrewind
		 * Go one step back in the presentation
		 */
		this.fastrewind = function() {
			// if it isn't the first slid
			if (this.current_slide > 0) {
				this.slide[this.current_slide].toggleTransition(0);
				this.current_slide -= 1;
				this.slide[this.current_slide].toggleTransition(1);
			}
		}			
		
		/*
		 * 
		 */
		function jQuerify() {
			// make a new reference to the actual scope since this will be replaced by jQuery
			var this_presentation = this;
			// On left-click, give the focus to the hidden input 
			// and go one step further in the current slide				
			$this.bind('click', this_presentation, function(){
				this_presentation.forward();
				$(this).find('input.jssvInput').focus();
				return false;
			// On right-click, go one step back in the current slide
			}).bind('contextmenu', this_presentation, function(e){
				this_presentation.rewind();
				$(this).find('input.jssvHiddenInput').focus();
				return false;		
			// On keypress
			}).find('input.jssvInput').keydown(function(e) {
				switch (e.keyCode) {
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
		}
		
		/* private method prepareLoader
		 * unused
		 */
		function prepareLoader(length) {
			load_step = 100 / length;
		};
		
		/* private method updateLoader
		 * unused
		 */
		function updateLoader() {
			load_percentage += load_step;
		}			
		
		/* constructor of the class Presentation 
		 */
		var title = json.title;
		var author = json.author;
		var description = json.description || '';
		var creation_date = json.creation_date;		
		
		var load_percentage = 0;
		var load_step;						
		
		jQuerify.call(this);
		
		prepareLoader(json.slide.length);
		this.slide = [];
		this.current_slide = 0;
		for(var i in json.slide) {
			this.slide.push(new $.jssv.Slide(json.slide[i], $this.attr('id'), '-s'+i));
			updateLoader();
		}
		
		this.slide[this.current_slide].toggleTransition(0);
	},// end Presentation class
	
	/*
	 * class Slide
	 */
	Slide : function(json, parent_id, id) {				
		/* privileged method forward
		 * Try to go one step further in the slide
		 * @param initial	indicate wether the slide is being initialised
		 * @return			true if possible else, false
		 */
		this.forward = function(initial) {
			// If this is not the last animation of the slide
			if (this.current_animation < this.animation.length -1) {
				do {
					this.current_animation += 1;
					// Play the animation on its related element
					this.animation[this.current_animation].forward(this.element[this.animation[this.current_animation].on_element], initial);
					// If the slide is being initialised, mark the animation to prevent them to be rewinded
					if (initial) {
						this.animation[this.current_animation].initial = true;
					}						
				} while (this.current_animation < this.animation.length -1 && (initial? this.animation[this.current_animation].next_on === null : this.animation[this.current_animation].next_on != 'click'));
				return true;
			} else {
				return false;
			}				
		}
		
		this.rewind = function() {
			// If this is not the first animation of the slide
			if (this.current_animation > -1 && !this.animation[this.current_animation].initial) {
				do {
					this.animation[this.current_animation].rewind(this.element[this.animation[this.current_animation].on_element]);						
					this.current_animation -= 1;
				} while (this.current_animation > -1 && !this.animation[this.current_animation].initial && this.animation[this.current_animation].next_on  != 'click');
				return true;
			} else {
				return false;
			}
		}
		
		this.toggleTransition = function(i) {
			$this.toggleAnimate(transition[i]);
		};
		
		function jQuerify(parent_id, id) {
			$('#'+parent_id).append('<div id="'+parent_id+id+'" class="jssvSlide" />');
			// Set percentage dimensions in javascript to circumnavigate a major drawback of ui's effects
			$this = $('#'+parent_id+id).css('width', '100%').css('height', '100%').css('fontSize', '100%');
		}
		
		var title = json.title || '';
		var comment = json.comment || '';
		var transition = [ json.transition[0], json.transition[1] ];
		transition[0].queue = transition[1].queue = 'jssv';
		
		var $this;
		jQuerify(parent_id, id);
		
		this.animation = [];
		this.current_animation = -1;
		for (var i in json.animation)
			this.animation.push(new $.jssv.Animation(json.animation[i]));
		
		this.element = [];
		for (var i in json.element)
			this.element.push(new $.jssv.Element(json.element[i], parent_id+id, '-e'+i));
		
		this.forward(true);
	},// end Slide class
	
	Animation : function(json) {
		var parameters = json.parameters || {};
		this.on_element = json.on_element;
		this.next_on = json.next_on || null;
		
		this.forward = function(element, initial) {
			if(initial)
				parameters.fx = false;
			element.forward(parameters);
		};
		
		this.rewind = function(element) {
			element.rewind(parameters);
		};
	},// end Animation class
	
	Element : function(json, parent_id, id) {
		this.forward = function(parameters) {
			if(parameters.fx !== undefined)
				$this.toggleAnimate(parameters);
			else {
				property.unshift(parameters);
				$this.animate(parameters);
			}
		};
		
		this.rewind = function(parameters) {
			if(parameters.fx !== undefined)
				$this.toggleAnimate(parameters);
			else {
				property.shift();
				$this.animate(property[0]);
			}
		};
		
		function jQuerify(parent_id, id) {
			$('#'+parent_id).append('<div id="'+parent_id+id+'" class="jssvElement" />');
			switch(type) {
				case 'presentation_title':
					$('#'+parent_id+id).append(content);
					break;
				case 'presentation_subtitle':
					$('#'+parent_id+id).append(content);
					break;
				case 'slide_title':
					$('#'+parent_id+id).append('<h3>'+content+'</h3>');
					break;
				case 'text':
					$('#'+parent_id+id).append(content);
					break;				
			}			
			$this = $('#'+parent_id+id);
		}
		
		var type = json.type || 'text';
		var content = json.content || '';
		
		var $this;
		jQuerify(parent_id, id);
		
		var property = [];
		property[0] = $.extend({
			width: 0, 
			height: 0,
			top: 0,
			left: 0,
			color: '000',
			opacity: 1,
			visibility: 'visible',
			zIndex: 1
		}, json.property);
		
		for (var attr in property[0]) {
			$this.css(attr, property[0][attr]+((attr == 'width' || attr == 'height' || attr == 'top' || attr == 'left')? '%' : ''));
		}
		
	}// end Element class
  });
})(jQuery);