/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

PresentationPanel = function() {
    PresentationPanel.superclass.constructor.call(this, {
        id:'presentation-tree',
        region:'west',
        title:'Presentations',
        split:true,
        width: 200,
        minSize: 100,
        maxSize: 400,
        collapsible: true,
        margins:'0 0 5 5',
        cmargins:'0 5 5 5',
        rootVisible:true,
        lines:false,
        autoScroll:true,
        root: new Ext.tree.TreeNode('Presentation Viewer'),
        collapseFirst:false,

        tbar: [{
            iconCls:'new-presentation',
            text:'New',
            handler: this.showWindow,
            scope: this
        },{
            iconCls:'new-folder',
            text:'New Folder',
            handler: this.showWindow,
            scope: this
        },{
            id:'delete',
            iconCls:'delete-icon',
            text:'Remove',
            handler: function(){
                var s = this.getSelectionModel().getSelectedNode();
                if(s){
                    this.removePresentation(s.attributes.title);
                }
            },
            scope: this
        }]
    });
	
	this.root.expanded = true;
	
    this.presentations = this.root.appendChild(
        new Ext.tree.TreeNode({
            text:'My Presentations',
            cls:'presentations-node',
            expanded:true
        })
    );

    this.trash = this.root.appendChild(
        new Ext.tree.TreeNode({
            text:'Trash',
            cls:'trash-node',
            expanded:true
        })
    );

    this.getSelectionModel().on({
        'beforeselect' : function(sm, node){
             //return node.isLeaf();
        },
        'selectionchange' : function(sm, node){
            if(node){
                this.fireEvent('presentationselect', node.attributes);
            }
            this.getTopToolbar().items.get('delete').setDisabled(!node);
        },
        scope:this
    });

    this.addEvents({presentationselect:true});

    this.on('contextmenu', this.onContextMenu, this);
};

Ext.extend(PresentationPanel, Ext.tree.TreePanel, {
	//Right clic
    onContextMenu : function(node, e){
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'presentations-ctx',
                items: [{
                    id:'load',
                    iconCls:'open-icon',
                    text:'Open',
                    scope: this,
                    handler:function(){
                        this.ctxNode.select();
                    }
                },{
                    text:'Remove',
                    iconCls:'delete-icon',
                    scope: this,
                    handler:function(){
                        this.ctxNode.ui.removeClass('x-node-ctx');
                        this.removePresentation(this.ctxNode.attributes.title);
                        this.ctxNode = null;
                    }
                },'-',{
                    iconCls:'new-presentation',
                    text:'New Presentation',
                    handler: this.showWindow,
                    scope: this
                }]
            });
            this.menu.on('hide', this.onContextHide, this);
        }
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
        if(node.isLeaf()){
            this.ctxNode = node;
            this.ctxNode.ui.addClass('x-node-ctx');
            this.menu.items.get('load').setDisabled(node.isSelected());
            this.menu.showAt(e.getXY());
        }
    },

    onContextHide : function(){
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
    },

    showWindow : function(btn){
        if(!this.win){
            this.win = new PresentationWindow();
            this.win.on('validpresentation', this.addPresentation, this);
        }
        this.win.show(btn);
    },

    selectPresentation: function(title){
        this.getNodeById(title).select();
    },

    removePresentation: function(title){
        var node = this.getNodeById(title);
        if(node){
            node.unselect();
            Ext.fly(node.ui.elNode).ghost('l', {
                callback: node.remove, scope: node, duration: .4
            });
        }
    },

    addPresentation : function(attrs, inactive, preventAnim){
        var exists = this.getNodeById(attrs.title);
        if(exists){
            if(!inactive){
                exists.select();
                exists.ui.highlight("ffff9c", {
				    attr: "background-color",
				    endColor: 'ffffff',
				    easing: 'easeIn',
				    duration: 1
				});
            }
            return;
        }
        Ext.apply(attrs, {
            iconCls: 'presentation-icon',
            leaf:true,
            cls:'presentation',
            id: attrs.title,
			text: attrs.title
        });
        var node = new Ext.tree.TreeNode(attrs);
        this.presentations.appendChild(node);
        if(!inactive){
            if(!preventAnim){
                Ext.fly(node.ui.elNode).slideIn('l', {
                    callback: node.select, scope: node, duration: .9
                });
            }else{
                node.select();
            }
        }
        return node;
    },

    // prevent the default context menu when you miss the node
    afterRender : function(){
        PresentationPanel.superclass.afterRender.call(this);
        this.el.on('contextmenu', function(e){
            e.preventDefault();
        });
    }
});