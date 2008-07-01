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
    //this.actionEdit.hide();
    
    this.actionFullScreen = new Ext.Action({
        text: (this.fullScreenText) ? this.fullScreenText : 'Full screen',
        iconCls: 'icon-full',
        handler: function(){
            window.open('/presentation/show?id=' + this.getActiveTab().presentation.id);
        },
        scope: this
    });
    //this.actionFullScreen.hide();
    //this.editortoolbar = new NetShows.EditorToolbar();
    
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
        this.getActiveTab().getComponent("slide-view").setSlide(params);
    },
    
    onTabChange: function(TabPanel, tab){
        //Prevent bug while loading the page
        if (this.tabclosed || TabPanel.items.getCount() > 1) {
            if (tab.id == 'main-view') {
                msg_log("TabPanel - Preview");
                this.fireEvent('previewview', tab.presentation);
                //this.getTopToolbar().show();
            }
            else {
                msg_log("TabPanel - Editor");
                this.fireEvent('editorview', tab.presentation);
                //this.getTopToolbar().hide();
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
        
        this.actionEdit.show();
        this.actionFullScreen.show();
    },
    //Return the actual edited slide
    getActiveSlide: function(){
        return this.getActiveTab().getComponent('slide-view').slide;
    },
    //Return the actual slide-view
    getActiveSlideView: function(){
        return this.getActiveTab().getComponent('slide-view');
    },
    removeElement: function(){
        if (this.getActiveTab().getComponent('slide-view').focusElement) 
            this.getActiveTab().getComponent('slide-view').slide.removeElement(this.getActiveTab().getComponent('slide-view').resizableElement, this.getActiveTab().getComponent('slide-view').focusElement);
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
                        tab.getTopToolbar().on('save', this.getActiveTab().getComponent('slide-view').saveSlide, this.getActiveTab().getComponent('slide-view'));
                        tab.getTopToolbar().on('newtext', this.getActiveTab().getComponent('slide-view').newText, this.getActiveTab().getComponent('slide-view'));
                        tab.getTopToolbar().on('newmap', this.getActiveTab().getComponent('slide-view').newMap, this.getActiveTab().getComponent('slide-view'));
                        tab.getTopToolbar().on('newdrawapplet', this.getActiveTab().getComponent('slide-view').newDrawApplet, this.getActiveTab().getComponent('slide-view'));
                        tab.getTopToolbar().on('remove', this.removeElement, this);
                        tab.getTopToolbar().on('play', function(){
							tab.getComponent("slide-view").setNoFocus(true);
							tab.getComponent("slide-view").slide.save(function(){
								window.open('/presentation/show?id=' + this.getActiveTab().presentation.id);
							}, this);
						}, this);
                        tab.getTopToolbar().on('print', function(){
                            msg_log('print');
                        }, this);
                        tab.getTopToolbar().on('preview', function(){
							tab.getComponent("slide-view").setNoFocus(true);
                            tab.getComponent("slide-view").slide.save(function(){
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
                                        html: '<iframe id="preview-frame" style="border:0" width="100%" height="100%" src="/presentation/show?id=' + tab.presentation.id + '&slide_id=' + tab.getComponent("slide-view").slide.id + '"></iframe>'
                                    });
                                    this.previewWindow.show();
                                }
                                else {
                                    Ext.get('preview-frame').set({
                                        src: '/presentation/show?id=' + tab.presentation.id + '&slide_id=' + tab.getComponent("slide-view").slide.id
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
        //Refreshes the panel
        tab.on('resize', tab.getComponent("slide-view").resizeEvent, tab.getComponent("slide-view"));
        
        tab.show();
    }
});
