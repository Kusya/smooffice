/**
 * @author Clément GONNET
 * 
 * TODO:
 * - When click on the collapse button, the accordion disappears
 */

NetShows.EditorAccordion = function(){
	// Transitions
	var effectsStore = new Ext.data.SimpleStore({
		fields: ['code', 'effect'],
		data: [['null','None'],['bind', 'Bind'], ['drop', 'Drop'], ['slideIn', 'Slide in'], ['slideOut', 'Slide out']]
	});
	var directionsStore = new Ext.data.SimpleStore({
		fields: ['code', 'name'],
		data: [['left','From left'],['right', 'From right'], ['up', 'From top'], ['down', 'From bottom'], ['', 'From center']]
	});
	
	this.transitionspanel = new Ext.Panel({
		title: 'Transitions',
		bodyStyle: 'padding:5px',
		border: false,
		iconCls: 'transitions-icon',
		items: [new Ext.FormPanel({
			border: false,
			labelAlign: 'top',
			items: [new Ext.form.ComboBox({
				width: 150,
				listWidth: 150,
				store: effectsStore,
				hideLabel: true,
				displayField: 'effect',
				forceSelection: true,
				typeAhead: true,
				mode: 'local',
				editable: false,
				shadow: 'drop',
				triggerAction: 'all',
				emptyText: (this.effectNameText) ? this.effectNameText : 'Select an effect...',
				selectOnFocus: true
			}), {
				xtype: 'textfield',
				fieldLabel: 'Duration (ms)',
				value: '1000',
				name: 'duration'
			}]
		})]
	});
	
	
	
	
	//Animations
	
	//Define the Grid data and create the Grid
    var myData = [
        ['Slide 1','null',1000,200,'click','top'],
        ['This is the title of our presentation','drop',1000,100,100,''],
        ['Image 1','slideIn',400,0,200,'right']
    ];

    var ds = new Ext.data.Store({
        reader: new Ext.data.ArrayReader({}, [
               {name: 'element'},
               {name: 'effect'},
               {name: 'duration', type: 'float'},
               {name: 'delay', type: 'float'},
               {name: 'trigger'}
          ])
    });
    ds.loadData(myData);
	
   	// the DefaultColumnModel expects this blob to define columns. It can be extended to provide
    // custom or reusable ColumnModels
    var colModel = new Ext.grid.ColumnModel([
        {id:'element',header: "Element", sortable: false, locked:true, dataIndex: 'element'},
        {header: "Effect", sortable: false, dataIndex: 'effect'},
        {header: "Duration", sortable: false, dataIndex: 'duration'},
        {header: "Delay", sortable: false, dataIndex: 'delay'},
        {header: "Trigger", sortable: false, dataIndex: 'trigger'},
        {header: "Driection", sortable: false, dataIndex: 'direction'}
    ]);
	
	this.optionsAnimationsWindow = new Ext.Window({
		id: 'options-window',
		title: (this.optionWindowTitle) ? this.optionWindowTitle : 'Animation order',
		iconCls: 'icon-preview',
		width: 200,
		height: 500,
		resizable: false,
		plain: false,
		modal: true,
		autoScroll: true,
		closeAction: 'hide',
		bodyBorder: true,
		items: {
			xtype: 'grid',
			ds: ds,
			cm: colModel,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true,
				listeners: {
					rowselect: function(sm, row, rec){
						Ext.getCmp("animation-form").getForm().loadRecord(rec);
					}
				}
			}),
			autoExpandColumn: 'element',
			listeners: {
				render: function(g){
					g.getSelectionModel().selectRow(0);
				},
				delay: 10 // Allow rows to be rendered before select the first
			}
		}
	});
	
	this.animationspanel = new Ext.Panel({
		title: 'Animations',
		id: 'animation-form',
		iconCls: 'animations-icon',
		border: false,
		bbar: new Ext.StatusBar({
	        items: [{
	            text: 'More options',
				enableToggle:true,
				toggleHandler: function(b,state){
					if (state) {
						this.optionsAnimationsWindow.getEl().slideIn('r', {
							easing: 'easeOut',
							scope: this
						});
					}
					else {
						this.optionsAnimationsWindow.getEl().ghost('l', {
							easing: 'easeOut',
							scope: this
						});
					}
				},
				scope:this
	        }]
        }),
		items: [{
			html:'<div style="margin:5%;width:90%;height:120px;background-color:black;">&nbsp;</div>',
			border:false
		}, {
            xtype:'tabpanel',
			border:false,
            activeTab: 0,
            defaults:{bodyStyle:'padding:10px'},
            items:[{
				title: 'In',
				layout: 'form',
				autoHeight: true,
				labelAlign:'top',
				defaultType: 'textfield',
				items: [{
					xtype: 'combo',
					name: 'effect',
					displayField:'effect',
					width: 140,
					listWidth: 140,
					store: new Ext.data.SimpleStore({
						fields: ['code', 'effect'],
						data: [['null','None'],['bind', 'Bind in'], ['drop', 'Drop in'], ['slideIn', 'Slide in']]
					}),
					fieldLabel: (this.effectText) ? this.effectText : 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.effectEmptyText) ? this.effectEmptyText : 'Select an effect...',
					selectOnFocus: true
				},{
					xtype: 'combo',
					name: 'direction',
					displayField:'name',
					width: 140,
					listWidth: 140,
					store: directionsStore,
					fieldLabel:(this.directionText) ? this.directionText : 'Direction',
					forceSelection: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
					selectOnFocus: true
				}, {
					fieldLabel: 'Duration',
					value: '1.00 s',
					name: 'duration'
				}]
			},{
                title:'Out',
                layout:'form',
				autoHeight:true,
				labelAlign:'top',
                defaultType: 'textfield',

                items: [{
					xtype: 'combo',
					name: 'effect',
					displayField:'effect',
					width: 140,
					listWidth: 140,
					store: new Ext.data.SimpleStore({
						fields: ['code', 'effect'],
						data: [['null','None'],['bind', 'Bind out'], ['drop', 'Drop out'], ['slideOut', 'Slide out']]
					}),
					fieldLabel: (this.effectText) ? this.effectText : 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.effectEmptyText) ? this.effectEmptyText : 'Select an effect...',
					selectOnFocus: true
				},{
					xtype: 'combo',
					name: 'direction',
					displayField:'name',
					width: 140,
					listWidth: 140,
					store: directionsStore,
					fieldLabel:(this.directionText) ? this.directionText : 'Direction',
					forceSelection: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
					selectOnFocus: true
				}, {
					fieldLabel: 'Duration',
					value: '1.00 s',
					name: 'duration'
				}]
            },{
                title:'Other',
                layout:'form',
				autoHeight:true,
				labelAlign:'top',
                defaultType: 'textfield',

               items: [{
					xtype: 'combo',
					name: 'effect',
					displayField:'effect',
					width: 140,
					listWidth: 140,
					store: new Ext.data.SimpleStore({
						fields: ['code', 'effect'],
						data: [['null','None'],['move', 'Move'], ['opacity', 'Opacity'], ['scale', 'Scale']]
					}),
					fieldLabel: (this.effectText) ? this.effectText : 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.effectEmptyText) ? this.effectEmptyText : 'Select an effect...',
					selectOnFocus: true
				},{
					xtype: 'combo',
					name: 'direction',
					displayField:'name',
					width: 140,
					listWidth: 140,
					store: directionsStore,
					fieldLabel:(this.directionText) ? this.directionText : 'Direction',
					forceSelection: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
					selectOnFocus: true
				}, {
					fieldLabel: 'Duration',
					value: '1.00 s',
					name: 'duration'
				}]
            }]
        }]
	});
	
	//My Folder
	var filetreepanel = new Ext.ux.FileTreePanel({
		border: false,
		autoScroll: true,
		autoHeight:true,
		id: 'filetreepanel',
		rootPath: 'root',
		rootVisible: true,
		url: '/file/do',
		topMenu: false,
		autoScroll: true,
		maxFileSize: 1048576,
		singleUpload:true,
		enableProgress:false,
		rootText: NetShows.user.username,
		ddGroup:'slide',
		baseParams: {
			authenticity_token: NetShows.key
		}
	});

	this.myFolder = new Ext.Panel({
		title: this.myFolderText ? this.myFolderText : 'My Folder',
		border: false,
		iconCls: 'icon-my-folder',
		autoHeight:true,
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
	var youtubeTpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">', //'<img src="{thumbnail}" title="{title}">',
	'<object width="130" height="97"><param name="movie" value="{url}&hl=en"></param><param name="wmode" value="transparent"></param><embed src="{url}&hl=en" type="application/x-shockwave-flash" wmode="transparent" width="130" height="97"></embed></object>', '<div class="title">{title:ellipsis(25)}</div>', '</div>', '</tpl>', '<div class="x-clear"></div>');
	
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
			sequence: true
		},
		items: [this.animationspanel,this.transitionspanel, this.myFolder, this.flickr, this.youtube, this.charts]
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
