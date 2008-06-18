;(function($) {
  	
	jQuery.fn.toggleAnimate = function(o) {
		return this.each(function() {
			var $this = $(this);
			o.mode = $this.css('display') == 'none'? 'show' : 'hide';
			o.queue = 'jssv';
			o.fx? $.jssv[o.fx].call(this, o) : $this[o.mode]();
		});
	};
	
	$.jssv.blind = function(o) {
		$.jssv.fade.call(this, o);
	};
	
	$.jssv.clip = function(o) {
		$.jssv.fade.call(this, o);
	};
	
	$.jssv.drop = function(o) {
		o.fade = true;
		$.jssv.slide.call(this, o);
	};
	
	$.jssv.explode = function(o) {
		$.jssv.fade.call(this, o);
	};
	
	$.jssv.fade = function(o) {
		$(this).animate({opacity: o.mode || 'toggle' }, o);
	};
	
	$.jssv.fold = function(o) {
		$.jssv.fade.call(this, o);
	};
	
	$.jssv.scale = function(o) {
		$.jssv.fade.call(this, o);
	};
	
	$.jssv.slide = function(o) {
		var $this = $(this);
		
		// il faut un wrapper !!
		
		if(!o.fade)	$this.parent().css('overflow', 'hidden');
		$this.show();
		o.complete = function() {
			$this.parent().css('overflow', 'visible');
			if(o.mode == 'hide') $this.hide(); 
		};
		
		var direction = o.direction || 'left';
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
		var distance = o.distance || (ref == 'top' ? $this.outerHeight({margin:true}) : $this.outerWidth({margin:true}));
		if (o.mode == 'show') $this.css(ref, motion == 'pos' ? -distance : distance); // Shift
		
		// Animation
		var animation = {};
		animation[ref] = (o.mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;
		if(o.fade) animation['opacity'] = o.mode;
		
		// Animate
		$this.animate(animation, o);
	};
	
})(jQuery);