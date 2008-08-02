(function($) {
	$.fn.smoo = function(json) {		
		$presentation = $(this);
		for(var i in json.slide) {
			var $slide = $('<div class="sldmSlide"></div>').appendTo($presentation).css(json.slide[i].p || {}),
				zob = {};
			zob.transition = [json.slide[i-1]? json.slide[i-1].t[1] : null, json.slide[i].t[0]];
			for(var z in zob.transition) {
				if(zob.transition[z] && zob.transition[z].f == null) zob.transition[z] = null;
				else if(zob.transition[z]) zob.transition[z].effect = zob.transition[z].f;
			}				
			zob.animations = json.slide[i].a;
			
			var script = document.createElement( 'script' );
	        script.type = 'text/javascript';
			$slide[0].appendChild(script);
			$slide.children('script:first').text('j = '+JSON.stringify(zob))
			
	       
			for(var j in json.slide[i].e) {
				var $element,
					j = json.slide[i].e[j];
				switch(j.t) {
					case 'img':
						$element = $('<img src="'+j.c.src+'" title="'+(j.c.title || '')+'"/>').appendTo($slide);
						break;
					case 'video':
						$element = $('<div><img width="100%" height="100%" src="'+j.c.img+'" title="replacement image for a video"/></div>' ).appendTo($slide);
						break;
					case 'map':
						$element = $('<div style="overflow: hidden"><img src="layout/hearth.png" title="Replacement image for a map"/></div>').appendTo($slide);
	                    break;
					default:
						$element = $('<div class="sldmFont'+j.p.fontClass+'">'+j.c+'</div>').appendTo($slide);
						break;
				}
				$element.attr('id', j.i).addClass('sldmElement').css(j.p);
			}
			
			for(var q in zob.animations) {
				var anim = zob.animations[q];
				if(anim.type == 'show') $slide.children('#'+anim.id).hide();
			}
		}
	}
})(jQuery);