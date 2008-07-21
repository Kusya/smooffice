/**
 * @author Clément GONNET
 * The main part of the application : preview and edit presentations
 */
NetShows.MainPanel = function(){
    this.actionEdit = new Ext.Action({
        text: (this.editText) ? this.editText : 'Edit',
        iconCls: 'edit-icon',
        handler: function(){
            this.fireEvent('presentationopen', this.getActiveTab().presentation);
        },
        scope: this
    });
    this.actionEdit.disable();
    
    this.actionFullScreen = new Ext.Action({
        text: (this.fullScreenText) ? this.fullScreenText : 'Full screen',
        iconCls: 'icon-full',
        handler: function(){
            window.open('/presentation/show?id=' + this.getActiveTab().presentation.id);
        },
        scope: this
    });
    this.actionFullScreen.disable();
    
    NetShows.MainPanel.superclass.constructor.call(this, {
        id: 'main-tabs',
        activeTab: 0,
        resizeTabs:true,
        region: 'center',
        margins: '0 5 5 0',
        tabWidth: 150,
        minTabWidth: 120,
        enableTabScroll: true,
		listeners:{
			'render':function(){
				this.getTopToolbar().tb.disable();
			}
		},
        plugins: new Ext.ux.TabCloseMenu(),
        tbar: new Ext.ux.HtmlEditorToolbar({
            enableFormat: true,
            enableFontSize: true,
            enableColors: true,
            enableAlignments: true,
            enableLists: true,
            enableSourceEdit: true,
            enableLinks: true,
            enableFont: true
        }),
        /*keys: [{
            //Delete Key = Delete
            key: 46,
            stopEvent: true,
            scope: this
            fn: this.getActiveTab().getTopToolbar().fireEvent('remove')
        }],*/
        
        items: {
            id: 'main-view',
            title: this.generalText || 'General',
            cls: 'preview',
            closable: false,
			border:true,
            html: NetShows.getHomeTemplate().apply({
                introTitle: this.introTitleText || 'Introduction',
                introContent: this.introContentText || "Welcome to NetShows, the new presentation maker. We hope you'll enjoy the wide set of hudge features such as amazing transitions, aesthetically pleasing elements animation, and much more..."
            }),
            listeners: {
                'show': this.doLayout
            },
            tbar: [this.actionEdit, '-', this.actionFullScreen]
        }
    });
    //Prevent tab change bug on startup
    this.tabclosed = false;
    
    this.on('tabchange', this.onTabChange, this);
    
};

Ext.extend(NetShows.MainPanel, Ext.TabPanel, {

    load: function(){
        this.el.mask(this.loadingText, 'x-mask-loading');
	},
    
	//When deleting a node in the treeview, the corresponding tab, if opened, is deleted as well
	removeTab : function(id){
		if(tab = this.getItem('tab-' + id)){
			this.remove(tab);
		}
	},
	
    setSlide: function(params){
		this.getActiveTab().getComponent('slide-view-' + this.getActiveTab().presentation.id).setSlide(params);
		NetShows.accordion.setSlide(params);
	},
    
    onTabChange: function(TabPanel, tab){
        //Prevent bug while loading the page
        if (this.tabclosed || TabPanel.items.getCount() > 1) {
            if (tab.id == 'main-view') {
                //msg_log("TabPanel - Preview");
                this.fireEvent('previewview', tab.presentation);
            }
            else {
                //msg_log("TabPanel - Editor");
                this.fireEvent('editorview', tab.presentation);
            }
        }
        else {
            this.tabclosed = true;
        }
    },
    
    onCloseTab: function(){
        Ext.Msg.show({
            title: this.saveChangesText ? this.saveChangesText : 'Save changes',
            msg: this.closeMsgText ? this.closeMsgText : 'You have closed a tab that has unsaved changes. Would you like to save your changes ?',
            buttons: Ext.Msg.YESNOCANCEL,
            fn: function(btn){
                msg_log(btn);
				
        		msg_log('deleting slides data store');
        		this.getActiveTab().presentation.store = null;
            }
        });
    },
    //Load a presentation in the General tab
    loadPresentation: function(node, notEditable, isLeaf){
        var tab = Ext.getCmp("main-tabs").getItem("main-view");
		if (isLeaf) {
			tab.setTitle((this.generalText) ? this.generalText : 'General' + " - " + node.text);
			tab.presentation = node;
			NetShows.getPreviewTemplate().overwrite(tab.body, {
				created_at: node.created_at,
				updated_at: node.updated_at,
				text: node.text,
				author: node.author,
				description: node.description||this.noDescriptionText||'No description',
				tags: node.tags||this.noTagsText||'No tags',
				updatedText: this.updatedText||'Last modification on',
				createdText: this.createdText||'Created on',
				byText:this.byText||'by',
				tagsText:this.tagsText||'Tags',
				descriptionTitle:this.descriptionTitle||'Description'
			});
        	this.actionEdit.setDisabled(notEditable);
        	this.actionFullScreen.setDisabled(notEditable);
		}else{
			tab.setTitle(this.generalText || 'General');
			NetShows.getHomeTemplate().overwrite(tab.body,{
                introTitle: this.introTitleText || 'Introduction',
                introContent: this.introContentText || "Welcome to NetShows, the new presentation maker. We hope you'll enjoy the wide set of hudge features such as amazing transitions, aesthetically pleasing elements animation, and much more..."
            });
        	this.actionEdit.disable();
        	this.actionFullScreen.disable();
		}
        this.setActiveTab(tab);
    },
    //Return the actual edited slide
    getActiveSlide: function(){
        return this.getActiveTab().getComponent('slide-view-'+this.getActiveTab().presentation.id).slide;
    },
    //Return the actual slide-view
    getActiveSlideView: function(){
        return this.getActiveTab().getComponent('slide-view-'+this.getActiveTab().presentation.id);
    },
    //open a presentation in a new tab
    openPresentation: function(presentation){
        var id = !presentation.id ? Ext.id() : presentation.id;
        var tab;
        if (!(tab = this.getItem('tab-' + id))) {
            tab = this.add({
                id: 'tab-' + id,
                cls: 'editor',
                title: presentation.text,
                tabTip: presentation.text,
                closable: true,
                autoScroll: true,
                border: true,
                tbar: new NetShows.EditorToolbar(),
                presentation: presentation,
                items: new NetShows.SlideView(presentation),
                listeners: {
					'resize':function(){
						tab.getComponent(0).resizeEvent();
					},
                    'render': function(){
						this.doLayout();
						var slideView = tab.getComponent(0);
				        
                        tab.getTopToolbar().on('save', slideView.saveSlide, slideView);
                        tab.getTopToolbar().on('newtext', slideView.newText, slideView);
                        tab.getTopToolbar().on('newmap', slideView.newMap, slideView);
                        tab.getTopToolbar().on('newdrawapplet', slideView.newDrawApplet, slideView);
                        tab.getTopToolbar().on('remove', function(){
							slideView.actionRemove.execute();
						}, this);
						
						//Layer management
                        tab.getTopToolbar().on('moveback', function(){
							slideView.actionMoveBack.execute();
						}, this);
                        tab.getTopToolbar().on('movefront', function(){
							slideView.actionMoveFront.execute();
						}, this);
                        tab.getTopToolbar().on('movebackwards', function(){
							slideView.actionMoveBackwards.execute();
						}, this);
                        tab.getTopToolbar().on('moveforwards', function(){
							slideView.actionMoveForwards.execute();
						}, this);
                        tab.getTopToolbar().on('play', function(){
							slideView.setNoFocus(true);
							slideView.slide.save(function(){
								window.open('/presentation/show?id=' + id);
								//Hide message
								NetShows.hideMsg(100);
							}, this);
						}, this);
                        tab.getTopToolbar().on('print', function(){
                            msg_log('print');
                        }, this);
                        tab.getTopToolbar().on('preview', function(){
							slideView.setNoFocus(true);
                            slideView.slide.save(function(){
                                if (!this.previewWindow) {
                                    this.previewWindow = new Ext.Window({
                                        title: (this.previewWindowTitle) ? this.previewWindowTitle : "Presentation preview",
                                        iconCls: 'icon-preview',
                                        width: 500,
                                        height: 400,
                                        resizable: true,
                                        plain: false,
                                        modal: true,
                                        autoScroll: true,
                                        closeAction: 'hide',
                                        bodyBorder: true,
                                        html: '<iframe id="preview-frame" style="border:0" width="100%" height="100%" src="/presentation/show?id=' + tab.presentation.id + '&slide_id=' + slideView.slide.id + '"></iframe>'
                                    });
                                    this.previewWindow.show();
                                }
                                else {
                                    Ext.get('preview-frame').set({
                                        src: '/presentation/show?id=' + tab.presentation.id + '&slide_id=' + slideView.slide.id
                                    });
                                    Ext.get('preview-frame').on('load', this.previewWindow.show, this.previewWindow);
                                }
								
								//Hide message
								NetShows.hideMsg(400);
                            }, this);
                            
                        }, this);
                    },
                    'close': function(){
						msg_log('close');
					},//this.onCloseTab,
                    scope: this
                }
            });
        }
		//Define the presentation to use with the accordion
        NetShows.accordion.setPresentation(presentation);
		
        tab.show();
    }
});
