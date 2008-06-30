Ext.GlobalHtmlEditorMngr = {
    htmleditors: [],
    add: function(){
    
    },
    remove: function(){
    
    },
    setFocus: function(){
    
    }
}

Ext.ux.GlobalHtmlEditorMngr = {
    activeEditor: null
}

Ext.ux.HtmlEditorToolbar = function(config){
    if (!config)
        config = {};
    
    Ext.apply(config, {
        enableFormat: true,
        enableFontSize: true,
        enableColors: true,
        enableAlignments: true,
        enableLists: true,
        enableSourceEdit: true,
        enableLinks: true,
        enableFont: true,
        createLinkText: 'Please enter the URL for the link:',
        defaultLinkValue: 'http:/' + '/',
        fontFamilies: ['Arial', 'Courier New', 'Tahoma', 'Times New Roman', 'Verdana'],
        defaultFont: 'tahoma'
    })
    
    this.config = config;
    Ext.apply(this, config);
    
}
Ext.ux.HtmlEditorToolbar.prototype = {
    btn: function(id, toggle, handler, ico){
        return {
            itemId: id,
            cls: 'x-btn-icon x-edit-' + id,
            enableToggle: toggle !== false,
            scope: this,
            handler: handler || this.relayBtnCmd,
            clickEvent: 'mousedown',
            tabIndex: -1
        };
    },
    addBtn: function(){
    
    },
    relayBtnCmd: function(btn){
        this.editor.relayBtnCmd(btn);
    },
    relayCmd: function(a, b){
        this.editor.relayCmd(a, b);
    },
    execCmd: function(a, b){
        this.editor.execCmd(a, b);
    },
    deferFocus: function(){
        this.editor.deferFocus();
    },
    createFontOptions: function(){
        var buf = [], fs = this.fontFamilies, ff, lc;
        for (var i = 0, len = fs.length; i < len; i++) {
            ff = fs[i];
            lc = ff.toLowerCase();
            buf.push('<option value="', lc, '" style="font-family:', ff, ';"', (this.defaultFont == lc ? ' selected="true">' : '>'), ff, '</option>');
        }
        return buf.join('');
    },
    render: function(container, position){
        // build the toolbar
        var tb = new Ext.Toolbar({
            renderTo: container
        });
        
        Ext.get(container).addClass('x-html-editor-tb')
        
        // stop form submits
        tb.el.on('click', function(e){
            e.preventDefault();
        });
        
        // **************************
        
        if (this.enableFont) {//&& !Ext.isSafari){
            this.fontSelect = tb.el.createChild({
                tag: 'select',
                cls: 'x-font-select',
                html: this.createFontOptions()
            });
            this.fontSelect.on('change', function(){
                var font = this.fontSelect.dom.value;
                this.relayCmd('fontname', font);
                this.editor.deferFocus();
            }, this);
            tb.add(this.fontSelect.dom);
        };
        
        if (this.enableFormat) {
            tb.add('-', this.btn('justifyleft'), this.btn('justifycenter'), this.btn('justifyright')            //,this.btn('justify')
            );
        };
        
        if (this.enableFontSize) {
            tb.add('-', this.btn('increasefontsize', false, function(btn){
                this.editor.adjustFont(btn)
            }), this.btn('decreasefontsize', false, function(btn){
                this.editor.adjustFont(btn)
            }));
        };
        
        if (this.enableColors) {
            tb.add('-', {
                itemId: 'forecolor',
                cls: 'x-btn-icon x-edit-forecolor',
                clickEvent: 'mousedown',
                //tooltip: this.editor.buttonTips['forecolor'] || undefined,
                tabIndex: -1,
                menu: new Ext.menu.ColorMenu({
                    allowReselect: true,
                    focus: Ext.emptyFn,
                    value: '000000',
                    plain: true,
                    selectHandler: function(cp, color){
                        this.execCmd('forecolor', Ext.isSafari || Ext.isIE ? '#' + color : color);
                        this.deferFocus();
                    },
                    scope: this,
                    clickEvent: 'mousedown'
                })
            }, {
                itemId: 'backcolor',
                cls: 'x-btn-icon x-edit-backcolor',
                clickEvent: 'mousedown',
                //tooltip: editor.buttonTips['backcolor'] || undefined,
                tabIndex: -1,
                menu: new Ext.menu.ColorMenu({
                    focus: Ext.emptyFn,
                    value: 'FFFFFF',
                    plain: true,
                    allowReselect: true,
                    selectHandler: function(cp, color){
                        if (Ext.isGecko) {
                            this.execCmd('useCSS', false);
                            this.execCmd('hilitecolor', color);
                            this.execCmd('useCSS', true);
                            this.deferFocus();
                        }
                        else {
                            this.execCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', Ext.isSafari || Ext.isIE ? '#' + color : color);
                            this.deferFocus();
                        }
                    },
                    scope: this,
                    clickEvent: 'mousedown'
                })
            });
        };
        
        if (this.enableAlignments) {
            tb.add('-', this.btn('bold'), this.btn('italic'), this.btn('underline'));
        };
        
        //if(!Ext.isSafari){
        tb.add('-', this.btn('createlink', false, function(btn){
            this.editor.createLink(btn)
        }));
        
        tb.add('-', this.btn('insertorderedlist'), this.btn('insertunorderedlist'));
        if (this.enableSourceEdit) {
            tb.add('-', this.btn('sourceedit', true, function(btn){
                this.editor.toggleSourceEdit(btn.pressed);
            }));
        }
        //}
        
        this.tb = tb;
    }
}
Ext.ux.HtmlEditorUsingGlobalToolbar = Ext.extend(Ext.form.HtmlEditor, {
    createToolbar: function(editor){
        editor.addEvents({
            focus: true
        })
        Ext.apply(editor, this.globalToolBar.config);
        this.tb = this.globalToolBar.tb;
        editor.on('focus', function(editor){
            this.globalToolBar.editor = editor;
        }, this);
    },
    onEditorEvent: function(e){
        this.fireEvent('focus', this);
        this.updateToolbar();
    }    /*,onResize : function(w, h){
     Ext.form.HtmlEditor.superclass.onResize.apply(this, arguments);
     if(this.el && this.iframe){
     if(typeof w == 'number'){
     var aw = w - this.wrap.getFrameWidth('lr');
     this.el.setWidth(this.adjustWidth('textarea', aw));
     this.iframe.style.width = aw + 'px';
     }
     if(typeof h == 'number'){
     //var ah = h - this.wrap.getFrameWidth('tb') - this.tb.el.getHeight();
     var ah = h;
     this.el.setHeight(this.adjustWidth('textarea', ah));
     this.iframe.style.height = ah + 'px';
     if(this.doc){
     this.getEditorBody().style.height = (ah - (this.iframePad*2)) + 'px';
     }
     }
     }
     }*/
    , // private
    onRender: function(ct, position){
        Ext.form.HtmlEditor.superclass.onRender.call(this, ct, position);
        this.el.dom.style.border = '0 none';
        this.el.dom.setAttribute('tabIndex', -1);
        this.el.addClass('x-hidden');
        if (Ext.isIE) { // fix IE 1px bogus margin
            this.el.applyStyles('margin-top:-1px;margin-bottom:-1px;')
        }
        this.wrap = this.el.wrap({
            cls: 'x-html-editor-wrap',
            cn: {
                cls: 'x-html-editor-tb'
            }
        });
        
        this.createToolbar(this);
        
        this.tb.items.each(function(item){
            if (item.itemId != 'sourceedit') {
                item.disable();
            }
        });
        
        var iframe = document.createElement('iframe');
        iframe.name = Ext.id();
        iframe.frameBorder = 'no';
        
        iframe.src = (Ext.SSL_SECURE_URL || "javascript:false");
        
        this.wrap.dom.appendChild(iframe);
        
        this.iframe = iframe;
        
        if (Ext.isIE) {
            iframe.contentWindow.document.designMode = 'on';
            this.doc = iframe.contentWindow.document;
            this.win = iframe.contentWindow;
        }
        else {
            this.doc = (iframe.contentDocument || window.frames[iframe.name].document);
            this.win = window.frames[iframe.name];
            this.doc.designMode = 'on';
        }
        this.doc.open();
        this.doc.write(this.getDocMarkup())
        this.doc.close();
        
        var task = { // must defer to wait for browser to be ready
            run: function(){
                if (this.doc.body || this.doc.readyState == 'complete') {
                    Ext.TaskMgr.stop(task);
                    this.doc.designMode = "on";
                    this.initEditor.defer(10, this);
                }
            },
            interval: 10,
            duration: 10000,
            scope: this
        };
        Ext.TaskMgr.start(task);
        
		this.wrap.applyStyles("width:100%;height:100%;");
		Ext.get(this.iframe).applyStyles("width:100%;height:96%;");
        /*if (!this.width) {
            this.setSize(this.el.getSize());
        }*/
    },
	

    getDocMarkup : function(){

        return '<html><head><style type="text/css">'+
		'html, body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, input, p, blockquote, th, td {'+
        '        margin: 0;'+
        '        padding: 0;'+
        '        border: 0;'+
        '    }'+
		'html,body{height:98%;cursor:text;}'+
		'</style></head><body></body></html>';

    },
	    // private

    /*adjustFont: function(btn){
        var adjust = btn.itemId == 'increasefontsize' ? 10 : -10;

        var v = parseInt(this.doc.queryCommandValue('FontSize') || 100, 10);
        if(Ext.isSafari3 || Ext.isAir){
            // Safari 3 values
            // 1 = 10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px
            if(v <= 10){
                v = 1 + adjust;
            }else if(v <= 13){
                v = 2 + adjust;
            }else if(v <= 16){
                v = 3 + adjust;
            }else if(v <= 18){
                v = 4 + adjust;
            }else if(v <= 24){
                v = 5 + adjust;
            }else {
                v = 6 + adjust;
            }
            v = v.constrain(1, 6);
        }else{
            if(Ext.isSafari){ // safari
                adjust *= 2;
            }
            v = Math.max(60, v+adjust) + (Ext.isSafari ? 'px' : 0);
        }
        this.execCmd('FontSize', v+'%');
    },*/
    onDestroy: function(){
        if (this.rendered) {
            /*this.tb.items.each(function(item){
             if(item.menu){
             item.menu.removeAll();
             if(item.menu.el){
             item.menu.el.destroy();
             }
             }
             item.destroy();
             });*/
            this.globalToolBar.tb.setDisabled(true);
            this.globalToolBar.editor = null;
            this.wrap.dom.innerHTML = '';
            this.wrap.remove();
        }
    },
    updateToolbar: function(){
    
        if (!this.activated) {
            this.onFirstFocus();
            return;
        }
        
        var btns = this.tb.items.map, doc = this.doc;
        
        if (this.enableFont) {// && !Ext.isSafari){
            var name = (this.doc.queryCommandValue('FontName') || this.defaultFont).toLowerCase();
            if (name != this.globalToolBar.fontSelect.dom.value) {
                this.globalToolBar.fontSelect.dom.value = name;
            }
        }
        if (this.enableFormat) {
            btns.bold.toggle(doc.queryCommandState('bold'));
            btns.italic.toggle(doc.queryCommandState('italic'));
            btns.underline.toggle(doc.queryCommandState('underline'));
        }
        if (this.enableAlignments) {
            btns.justifyleft.toggle(doc.queryCommandState('justifyleft'));
            btns.justifycenter.toggle(doc.queryCommandState('justifycenter'));
            btns.justifyright.toggle(doc.queryCommandState('justifyright'));
        }
        if (!Ext.isSafari && this.enableLists) {
            btns.insertorderedlist.toggle(doc.queryCommandState('insertorderedlist'));
            btns.insertunorderedlist.toggle(doc.queryCommandState('insertunorderedlist'));
        }
        
        Ext.menu.MenuMgr.hideAll();
        
        this.syncValue();
    }
});
