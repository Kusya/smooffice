(function($) {
    /*
     * Use me on a collection of span with different font-families and the intended width for the span
     * and I'll tell you what coefficient to apply on fontSize for element with this fontFamily :)
     */
    $.fn.coef = function() {
        var font_coefs = {};
        // for each font family (see style.css)
        this.each(function() {
            var $this = $(this);
            font_coefs[$this.attr('class')] = $this.attr('data-width') / $this.width();
        });
        return font_coefs;
    };

    /*
     * Use me and I'll store your values for useful css properties in your css_store.
     * I'll make sure to return values in % where applicable :)
     */
    $.fn.cssStore = function() {
        return this.each(function() {
            var $this = $(this),
                css_store = {},
                tmp_css,
				percent = ['width', 'height', 'top', 'left'];
            for(var i in percent) {
                tmp_css = $this.css(percent[i]);
                // make sure dimensions are in percent
                if (!/%$/.test(tmp_css)) {
                        // Cache dimensions
                        var p_width = p_width || $this.parent().width(),
                            p_height = p_height || $this.parent().height();
						// TODO : if it happens too often, consider precalculating parent dimensions.
                        console.error('non percent value found in '+$this.attr('id')+' : '+percent[i]+'='+tmp_css);
                        tmp_css = Math.round(100 * (parseInt(tmp_css) / parseInt(/^t|h/.test(i) ? p_height : p_width))) +'%';
                        
                }
                css_store[percent[i]] = tmp_css;
            }
            // Finger in the noze for those
            for (var j in ['color', 'opacity', 'fontSize', 'display'])
                css_store[j] = $this.css(j);
            $this.data('css_store', css_store);
        })
    }
})(jQuery);