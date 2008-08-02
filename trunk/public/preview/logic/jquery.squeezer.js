jQuery(function() {	
	$('div.sldmPresentation').smoo(presentation1);
	
    $.sldm = {};
    //console.profile()
    // Build top level divs
	
	var $view = $('div.sldmView:first'),
	        $navBar = $('div.sldmNavBar:first'),
	        font_coefs = $('div.sldmFonts span').coef();
	    $view.view($navBar, font_coefs).trigger('resize');
	    $navBar.navBar($view);
    // Keep window dimensions to 4/3
    $.sldm.resizeTimer = null;
    $(window).resize(function(){
        if ($.sldm.resizeTimer)
            clearTimeout($.sldm.resizeTimer);
        $.sldm.resizeTimer = setTimeout(function(){
            $view.trigger('resize', 'slow');
        }, 100);
    });
    //console.profileEnd()
});