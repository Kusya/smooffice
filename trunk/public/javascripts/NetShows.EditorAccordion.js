/**
 * @author Clément GONNET
 * Right side of the application. Offers all the tools to change settings of slides or animations and to add external content.
 */
NetShows.EditorAccordion = function(){
	this.presentation = null;
	this.slide = null;
	
    // Slide transition and appearance
    this.slidepanel = new NetShows.EditorAccordion.Slide();
    
    //Animations
    this.animationpanel = new NetShows.EditorAccordion.Animation();
    
    //My Folder
    var filetreepanel = new Ext.ux.FileTreePanel({
        border: false,
        autoScroll: true,
        autoHeight: true,
        id: 'filetreepanel',
        rootPath: 'root',
        rootVisible: true,
        url: '/file/do',
        topMenu: false,
        autoScroll: true,
        maxFileSize: 1048576,
        singleUpload: true,
        enableProgress: false,
        rootText: NetShows.user.username,
        ddGroup: 'slide',
        baseParams: {
            authenticity_token: NetShows.key
        }
    });
    
    this.myFolder = new Ext.Panel({
        title: this.myFolderText ? this.myFolderText : 'My Folder',
        border: false,
        iconCls: 'icon-my-folder',
        autoHeight: true,
        bodyStyle: "padding:0px",
        items: filetreepanel
    });
    
    
    //Flickr
    var flickrTpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">', '<div class="thumb"><img src="{thumbnail}" title="{title}"></div>', '<div class="title">{title:ellipsis(25)}</div></div>', '</tpl>', '<div class="x-clear"></div>');
    
    this.flickr = new NetShows.EditorAccordion.External({
        id: 'flickr-view',
        type: 'img',
        ext: 'jpg',
        tpl: flickrTpl,
        url: '/flickr/search',
        fields: ['thumbnail', 'url', 'title'],
        root: 'images',
        loadingText: (this.loadingFlickrText) ? this.loadingFlickrText : 'Loading images...',
        noElements: (this.noElementsFlickrText) ? this.noElementsFlickrText : 'No images',
        title: 'Flickr',
        limit: 6,
        iconCls: 'flickr-icon'
    });
    
    
    
    
    //Youtube
    var youtubeTpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">', '<img src="{thumbnail}" title="{title}">',
 //'<object width="130" height="97"><param name="movie" value="{url}&hl=en"></param><param name="wmode" value="transparent"></param><embed src="{url}&hl=en" type="application/x-shockwave-flash" wmode="transparent" width="130" height="97"></embed></object>',
 '<div class="title">{title:ellipsis(25)}</div>', '</div>', '</tpl>', '<div class="x-clear"></div>');
    
    this.youtube = new NetShows.EditorAccordion.External({
        id: 'youtube-view',
        tpl: youtubeTpl,
        type: 'video',
        ext: 'swf',
        url: '/youtube/search',
        fields: ['thumbnail', 'url', 'title'],
        root: 'videos',
        loadingText: (this.loadingYoutubeText) ? this.loadingYoutubeText : 'Loading videos...',
        noElements: (this.noElementsYoutubeText) ? this.noElementsYoutubeText : 'No videos',
        title: 'Youtube',
        limit: 6,
        iconCls: 'youtube-icon'
    });
    
    
    
    //Charts
    this.charts = new Ext.Panel({
        title: 'Charts',
        bodyStyle: "padding:5px",
        border: false,
        iconCls: 'icon-charts'
    });
    
    
    
    
    NetShows.EditorAccordion.superclass.constructor.call(this, {
        title: 'Toolbox',
        bodyBorder: true,
        margins: '0 5 5 0',
        cmargins: '0 5 5 0',
        region: 'east',
        width: 180,
        split: true,
        collapsible: true,
        collapsed: true,
        layout: 'accordion',
        layoutConfig: {
			animate: true,
			hideCollapseToolbar: false,
			autoWidth: true,
			fill: true,
			sequence: true
		},
        items: [this.slidepanel, this.animationpanel, this.myFolder, this.flickr, this.youtube, this.charts]
    });
    
    //A voir si utile ou plutot pollue l'utilisateur
    //NetShows.mainPanel.on('focuselement', this.setTab, this);
}

Ext.extend(NetShows.EditorAccordion, Ext.Panel, {
    setTab: function(element){
        msg_log(element);
        switch (element.data.type) {
            case 'text':
                this.textFormat.expand();
                break;
            case 'presentation_title':
                this.textFormat.expand();
                break;
            case 'image':
                this.flickr.expand();
                break;
            case 'video':
                this.youtube.expand();
                break;
            default:
                msg_log("No type");
                return false;
        }
    },
	setPresentation: function(presentation){
		this.presentation = presentation;
	},
	setSlide:function(params){
		this.slide =  this.presentation.slides[params.number];
		this.animationpanel.slide = this.slide;
		this.slidepanel.setSlide(this.slide);
	}
});
