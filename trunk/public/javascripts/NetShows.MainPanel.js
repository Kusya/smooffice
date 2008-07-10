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
        autoDestroy: true,
        region: 'center',
        margins: '0 5 5 0',
        tabWidth: 150,
        minTabWidth: 120,
        enableTabScroll: true,
        plugins: new Ext.ux.TabCloseMenu(),
		listeners:{
			render:function(){
				this.getTopToolbar().tb.disable();
			}
		},
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
        keys: [{
            // Delete Key = Delete
            key: 46,
            stopEvent: true,
            scope: this
            //fn: this.getActiveTab().getTopToolbar().fireEvent('remove')
        }],
        
        items: {
            id: 'main-view',
            title: (this.generalText) ? this.generalText : 'General',
            cls: 'preview',
            closable: false,
            border: true,
            html: NetShows.getHomeTemplate().apply({
                introTitle: (this.introTitleText) ? this.introTitleText : 'Introduction',
                introContent: (this.introContentText) ? this.introContentText : "Welcome to NetShows, the new presentation maker. We hope you'll enjoy the wide set of hudge features such as amazing transitions, aesthetically pleasing elements animation, and much more..."
            }),
            listeners: {
                'render': this.doLayout
            },
            tbar: [this.actionEdit, '-', this.actionFullScreen]
        }
    });
    //Prevent tab change bug on startup
    this.tabclosed = false;
    
    
    //this.on('render', this.load, this);
    this.on('tabchange', this.onTabChange, this);
    
};

Ext.extend(NetShows.MainPanel, Ext.TabPanel, {

    load: function(){
        this.el.mask(this.loadingText, 'x-mask-loading');
    },
    
    removeTab: function(id){
        var tab = this.getItem('tab-' + id);
        if (tab) {
            this.remove(tab);
        }
    },
    
    setSlide: function(params){
        this.getActiveTab().getComponent('slide-view-'+this.getActiveTab().presentation.id).setSlide(params);
		NetShows.accordion.setSlide(params);
    },
    
    onTabChange: function(TabPanel, tab){
        //Prevent bug while loading the page
        if (this.tabclosed || TabPanel.items.getCount() > 1) {
            if (tab.id == 'main-view') {
                msg_log("TabPanel - Preview");
                this.fireEvent('previewview', tab.presentation);
            }
            else {
                msg_log("TabPanel - Editor");
                this.fireEvent('editorview', tab.presentation);
            }
        }
        else {
            this.tabclosed = true;
        }
    },
    
    onTabClose: function(){
        msg_log('deleting slides data store');
        this.getActiveTab().presentation.store = null;
        Ext.MessageBox
        Ext.Msg.show({
            title: this.saveChangesText ? this.saveChangesText : 'Save changes',
            msg: this.closeMsgText ? this.closeMsgText : 'You have closed a tab that has unsaved changes. Would you like to save your changes ?',
            buttons: Ext.Msg.YESNOCANCEL,
            fn: function(btn){
                msg_log(btn);
            }
        });
    },
    //Load a presentation in the General tab
    loadPresentation: function(presentation){
        var tab = Ext.getCmp("main-tabs").getItem("main-view");
        tab.setTitle((this.generalText) ? this.generalText : 'General' + " - " + presentation.text);
        tab.presentation = presentation;
        NetShows.getPreviewTemplate().overwrite(tab.body, presentation);
        this.setActiveTab(tab);
        
        this.actionEdit.enable();
        this.actionFullScreen.enable();
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
                    render: function(){
						this.doLayout();
						var slideView = tab.getComponent(0);
						
				        //slideView.resizeEvent.call(slideView);
						
				        tab.on('resize', slideView.resizeEvent, slideView);
				        
        
                        tab.getTopToolbar().on('save', slideView.saveSlide, slideView);
                        tab.getTopToolbar().on('newtext', slideView.newText, slideView);
                        tab.getTopToolbar().on('newmap', slideView.newMap, slideView);
                        tab.getTopToolbar().on('newdrawapplet', slideView.newDrawApplet, slideView);
                        tab.getTopToolbar().on('remove', function(){
							slideView.actionRemove.execute();
						}, this);
                        tab.getTopToolbar().on('play', function(){
							slideView.setNoFocus(true);
							slideView.slide.save(function(){
								window.open('/presentation/show?id=' + id);
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
										bodyStyle:'z-index:10000',
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
                            }, this);
                            
                        }, this);
                    },
                    close: this.onTabClose,
                    scope: this
                }
            });
        }
		//Define the presentation to use with the accordion
        NetShows.accordion.setPresentation(presentation);
		
        tab.show();
    }
});
