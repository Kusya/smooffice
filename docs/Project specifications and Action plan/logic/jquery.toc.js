/**
 * @author lrbabe
 */
// This plugin automates the generation of the table of content from $this.
jQuery.fn.toc = function(options){
    var opts = jQuery.extend({}, jQuery.fn.toc.defaults, options);
    // iterate and reformat each matched element
    return this.each(function(){
        var $this = jQuery(this);
        // build element specific options
        var o = jQuery.meta ? jQuery.extend({}, opts, $this.data()) : opts;
        
		// The toc is inserted before the first targeted header
        $this.children("h" + o.highest + ":first").before('<h' + o.highest + '>' + o.title + '<\/h' + o.highest + '><ul id="jToc" style="display:none"><\/ul>');
		// This index will keep a trace of the collected headers
		var index = new Array(0,0,0,0,0,0);
		// We "mark" every targeted header inorder to cellect them as they appear in the document later.
		for (var i = o.highest ; i <= o.lowest ; i++ ) {
			jQuery("h" + i).addClass("temp_header");
		}
		// The toc is generated for all the marked headers
		$this.children(".temp_header:gt(0)").each(function() {
			// We extract the level of the header
			var lvl = parseInt(this.nodeName.substr(1));
            for (var j = lvl - o.highest; j < index.length; j++) {
                if (j == lvl - o.highest) { 	// We increment the level of the current header
                    index[j]++;
                } else {					// We reset the level of the headers of a lower level
                    index[j] = 0;
                }
            }
			// We build the identifier of the header from its level and its position in the document
			var id = index.toString().substr(0,(lvl+1-o.highest)*2).replace(/,/g, "_");
	        var numbering = "&nbsp;";
			if (o.numbering == "full" || o.numbering == "yes") {
				numbering = id.replace(/_/g, ".")+" ";
				if (o.numbering == "yes") {
					numbering = numbering.substr(-3);
				}
			}	
			jQuery(this)
	          .prepend(
			  	'<span id="h' + id + '">' + numbering + '</span>'           
	          );
			var select = ">li>ul:last>li>ul:last>li>ul:last>li>ul:last>li>ul:last";
	        select = select.substr(0, (lvl-o.highest)*11);
			$("#jToc"+select).append('<li><a href="#h'+id+'">'+jQuery(this).text().replace(/<\/?.*?>/, '')+'<\/a><ul><\/ul><\/li>');
		});
		// SlideDown Animation of the toc
		if (o.slideDown) {
			jQuery("#jToc").slideDown(1500);
		}		
		// Scroll function, from learningjquery.com
		if (o.scroll) {
			jQuery('#jToc a[href*=#]').click(function() {
				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
				&& location.hostname == this.hostname
				&& this.hash.replace(/#/,'') ) {
				  var $targetId = jQuery(this.hash), $targetAnchor = jQuery('[name=' + this.hash.slice(1) +']');
				  var $target = $targetId.length ? $targetId : $targetAnchor.length ? $targetAnchor : false;
				   if ($target) {
					 var targetOffset = $target.offset().top;
					 jQuery('html, body').animate({scrollTop: targetOffset}, 400);
				  }
				}
				return false;
			});
		}
    });
};

jQuery.fn.toc.defaults = {
    highest: 2,
    lowest: 5,
    title: 'Table of content',
    scroll: true,
	slideDown : true,
	numbering: "full"
};
