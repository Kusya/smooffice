Ext.GlobalHtmlEditorMngr = {
	htmleditors: []
	,add: function(){
		
	}
	,remove: function(){
		
	}
	,setFocus: function(){
		
	}
}

Ext.ux.GlobalHtmlEditorMngr = {
	activeEditor: null
}

Ext.ux.HtmlEditorToolbar = function(config){
	if(!config) config = {};
	
	Ext.apply(config,{
		enableFormat : true,
	    enableFontSize : true,
	    enableColors : true,
	    enableAlignments : true,
	    enableLists : true,
	   	enableSourceEdit : true,
	    enableLinks : true,
	   	enableFont : true,
	    createLinkText : 'Please enter the URL for the link:',
	    defaultLinkValue : 'http:/'+'/',
	    fontFamilies : [
	        'Arial',
	        'Courier New',
	        'Tahoma',
	        'Times New Roman',
	        'Verdana'
	    ],
	    defaultFont: 'tahoma'
	})
   
		this.config = config;
		Ext.apply(this, config);

}
Ext.ux.HtmlEditorToolbar.prototype = {
	btn : function(id, toggle, handler, ico){
        return {
            itemId : id
            ,cls : 'x-btn-icon x-edit-'+id
            ,enableToggle:toggle !== false
            ,scope: this
            ,handler: handler || this.relayBtnCmd
            ,clickEvent: 'mousedown',
            tabIndex:-1
        };
    }
	,addBtn: function(){
		
	}
	,relayBtnCmd: function(btn){
		this.editor.relayBtnCmd(btn);
	}
	,relayCmd: function(a, b){
		this.editor.relayCmd(a, b);
	}
	,execCmd: function(a, b){
		this.editor.execCmd(a, b);
	}
	,deferFocus: function(){
		this.editor.deferFocus();
	}
	,createFontOptions : function(){
        var buf = [], fs = this.fontFamilies, ff, lc;
        for(var i = 0, len = fs.length; i< len; i++){
            ff = fs[i];
            lc = ff.toLowerCase();
            buf.push(
                '<option value="',lc,'" style="font-family:',ff,';"',
                    (this.defaultFont == lc ? ' selected="true">' : '>'),
                    ff,
                '</option>'
            );
        }
        return buf.join('');
    },
	render: function(container,position){
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
		
		 if(this.enableFont && !Ext.isSafari){
            this.fontSelect = tb.el.createChild({
                tag:'select',
                cls:'x-font-select',
                html: this.createFontOptions()
            });
            this.fontSelect.on('change', function(){
                var font = this.fontSelect.dom.value;
                this.relayCmd('fontname', font);
                this.editor.deferFocus();
            }, this);
            tb.add(
                this.fontSelect.dom,
                '-'
            );
        };

        if(this.enableFormat){
            tb.add(
            '-',
	           this.btn('justifyleft')
	           ,this.btn('justifycenter')
	           ,this.btn('justifyright')
			   //,this.btn('justify')
	        );
        };

        if(this.enableFontSize){
            tb.add(
                '-',
                this.btn('increasefontsize', false, function(btn){this.editor.adjustFont(btn)}),
            	this.btn('decreasefontsize', false, function(btn){this.editor.adjustFont(btn)})
            );
        };

        if(this.enableColors){
            tb.add(
                '-', {
                    itemId:'forecolor',
                    cls:'x-btn-icon x-edit-forecolor',
                    clickEvent:'mousedown',
                    //tooltip: this.editor.buttonTips['forecolor'] || undefined,
                    tabIndex:-1,
                    menu : new Ext.menu.ColorMenu({
                        allowReselect: true,
                        focus: Ext.emptyFn,
                        value:'000000',
                        plain:true,
                        selectHandler: function(cp, color){
                            this.execCmd('forecolor', Ext.isSafari || Ext.isIE ? '#'+color : color);
                            this.deferFocus();
                        },
                        scope: this,
                        clickEvent:'mousedown'
                    })
                }, {
                    itemId:'backcolor',
                    cls:'x-btn-icon x-edit-backcolor',
                    clickEvent:'mousedown',
                    //tooltip: editor.buttonTips['backcolor'] || undefined,
                    tabIndex:-1,
                    menu : new Ext.menu.ColorMenu({
                        focus: Ext.emptyFn,
                        value:'FFFFFF',
                        plain:true,
                        allowReselect: true,
                        selectHandler: function(cp, color){
                            if(Ext.isGecko){
                                this.execCmd('useCSS', false);
                                this.execCmd('hilitecolor', color);
                                this.execCmd('useCSS', true);
                                this.deferFocus();
                            }else{
                                this.execCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', Ext.isSafari || Ext.isIE ? '#'+color : color);
                                this.deferFocus();
                            }
                        },
                        scope:this,
                        clickEvent:'mousedown'
                    })
                }
            );
        };

        if(this.enableAlignments){
            tb.add(
                '-',
                this.btn('bold'),
            	this.btn('italic'),
            	this.btn('underline')
            );
        };

        if(!Ext.isSafari){
            tb.add(
                '-',
                this.btn('createlink', false, function(btn){this.editor.createLink(btn)})
            );

            tb.add(
                '-',
                this.btn('insertorderedlist'),
                this.btn('insertunorderedlist')
            );
            if(this.enableSourceEdit){
                tb.add(
                    '-',
                    this.btn('sourceedit', true, function(btn){
                        this.editor.toggleSourceEdit(btn.pressed);
                    })
                );
            }
        }
		
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
	}
	,onEditorEvent : function(e){
		this.fireEvent('focus', this);
        this.updateToolbar();
    }
	,onResize : function(w, h){
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
    }
	,updateToolbar: function(){

        if(!this.activated){
            this.onFirstFocus();
            return;
        }

        var btns = this.tb.items.map, doc = this.doc;

        if(this.enableFont && !Ext.isSafari){
            var name = (this.doc.queryCommandValue('FontName')||this.defaultFont).toLowerCase();
            if(name !=  this.globalToolBar.fontSelect.dom.value){
                this.globalToolBar.fontSelect.dom.value = name;
            }
        }
        if(this.enableFormat){
            btns.bold.toggle(doc.queryCommandState('bold'));
            btns.italic.toggle(doc.queryCommandState('italic'));
            btns.underline.toggle(doc.queryCommandState('underline'));
        }
        if(this.enableAlignments){
            btns.justifyleft.toggle(doc.queryCommandState('justifyleft'));
            btns.justifycenter.toggle(doc.queryCommandState('justifycenter'));
            btns.justifyright.toggle(doc.queryCommandState('justifyright'));
        }
        if(!Ext.isSafari && this.enableLists){
            btns.insertorderedlist.toggle(doc.queryCommandState('insertorderedlist'));
            btns.insertunorderedlist.toggle(doc.queryCommandState('insertunorderedlist'));
        }
        
        Ext.menu.MenuMgr.hideAll();

        this.syncValue();
    }
});