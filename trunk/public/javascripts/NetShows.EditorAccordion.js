/**
 * @author Clément GONNET
 * 
 * TODO:
 * - When click on the collapse button, the accordion disappears
 */

NetShows.EditorAccordion = function(){
	/*
	// add a combobox to the toolbar
	this.fontstore = new Ext.data.SimpleStore({
		fields: ['name', 'preview'],
		data: NetShows.fonts //from FontType.js
	});
	this.fontscombo = new Ext.form.ComboBox({
		store: this.fontstore,
		displayField: 'name',
		typeAhead: true,
		mode: 'local',
		triggerAction: 'all',
		emptyText: this.emptyText,
		selectOnFocus: true,
		width: 135
	});
	this.textFormat = new Ext.Panel({
		title: this.textFormatTitle ? this.textFormatTitle : 'Text &amp; Formats',
		cls: 'empty',
		iconCls: 'icon-text-format',
		bodyStyle: "padding:5px",
		border: false,
		items: [{id:'editorToolbar'}]
	});
	*/
	var filetreepanel = new Ext.ux.FileTreePanel({
		 border:false,
		 //autoWidth:true,
		 id:'filetree',
		 rootPath:'root',
		 rootVisible: true,
		 topMenu:true,
		 autoScroll:true,
		 enableProgress:false
		 //baseParams:{additional:'haha'},
		 //singleUpload:true
	});

	this.myFolder = new Ext.Panel({
		title: this.myFolderText ? this.myFolderText : 'My Folder',
		border: false,
		iconCls: 'icon-my-folder',
		//autoHeight:true,
		bodyStyle: "padding:0px",
		items: [filetreepanel
		/*, {
			xtype: 'uploadpanel',
			buttonsAt: 'tbar',
			id: 'uppanel',
			url: '/file/do',
			path: 'root',
			maxFileSize: 1048576,
			enableProgress: true,
			//singleUpload:true
		}*/
		]
	});
	
	var flickrTpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">', '<div class="thumb"><img src="{thumbnail}" title="{title}"></div>', '<div class="title">{title:ellipsis(25)}</div></div>', '</tpl>', '<div class="x-clear"></div>');
	
	this.flickr = new NetShows.EditorAccordion.External({
		id: 'flickr-view',
		type: 'image',
		tpl: flickrTpl,
		url: '/flickr/search',
		fields: ['thumbnail', 'url', 'title'],
		root: 'images',
		loadingText: (this.loadingFlickrText) ? this.loadingFlickrText : 'Loading images...',
		noElements: (this.noElementsFlickrText) ? this.noElementsFlickrText : 'No images available',
		title: 'Flickr',
		limit: 6,
		iconCls: 'flickr-icon'
	});
	
	
	var youtubeTpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">', //'<img src="{thumbnail}" title="{title}">',
	'<object width="130" height="97"><param name="movie" value="{url}&hl=en"></param><param name="wmode" value="transparent"></param><embed src="{url}&hl=en" type="application/x-shockwave-flash" wmode="transparent" width="130" height="97"></embed></object>', '<div class="title">{title:ellipsis(25)}</div>', '</div>', '</tpl>', '<div class="x-clear"></div>');
	
	this.youtube = new NetShows.EditorAccordion.External({
		id: 'youtube-view',
		tpl: youtubeTpl,
		type: 'video',
		url: '/youtube/search',
		fields: ['thumbnail', 'url', 'title'],
		root: 'videos',
		loadingText: (this.loadingYoutubeText) ? this.loadingYoutubeText : 'Loading videos...',
		noElements: (this.noElementsYoutubeText) ? this.noElementsYoutubeText : 'No videos available',
		title: 'Youtube',
		limit: 6,
		iconCls: 'youtube-icon'
	});
	
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
			sequence: true
		},
		items: [this.myFolder, this.flickr, this.youtube, this.charts]
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
	}
});
