/**
 * @author Clément GONNET
 * Show a list o presentation owned by a user in the west side of the application
*/
NetShows.PresentationBrowser = function(){
	/*
	 * Define the Actions
	 */
	this.actionNew = new Ext.Action({
		id: 'new-presentation',
		text: (this.newText)?this.newText:"New",
		iconCls: 'icon-plus',
		handler: function(){
			this.WindowPresentation();
		},
		scope: this
	});
	this.actionNewFolder = new Ext.Action({
		id: 'new-folder',
		text: (this.newFolderText)?this.newFolderText:"New folder",
		iconCls: 'icon-folder-add',
		handler: function(){
			this.WindowFolder();
		},
		scope: this
	});
	
	this.actionRemove = new Ext.Action({
		id:'remove-presentation',
        iconCls:'icon-cross',
        text: (this.removeText)?this.removeText:"Remove",
        handler: function(){
			var elem = (this.ctxNode)?this.ctxNode:this.getSelectionModel().getSelectedNode();
            if(elem){
                this.fireEvent('removeelement', this, elem.parentNode, elem);
            }
        },
        scope: this
	});
	this.actionRemove.disable();
	
	this.actionModify = new Ext.Action({
        text: (this.modifyText)?this.modifyText:"Modify",
        iconCls:'modify-icon',
        scope: this,
        handler:function(){
			if (this.ctxNode.isLeaf()) {
				this.WindowPresentation(this.ctxNode);
			}else{
				this.WindowFolder(this.ctxNode);
			}
        }
	});
	
	this.actionEmptyTrash = new Ext.Action({
		text: (this.emptyTrashText)?this.emptyTrashText:"Empty trash",
		iconCls:'trash-empty-icon',
		scope: this,
		handler: this.emptyTrash
	});
	
	this.actionEdit = new Ext.Action({
		text: (this.editText)?this.editText:"Edit",
		iconCls:'edit-icon',
		scope: this,
		handler: this.openPresentation
	});
	
	this.actionDetails = new Ext.Action({
		text: (this.detailsText)?this.detailsText:"Details",
		iconCls:'details-icon',
		scope: this,
		handler: this.detailsPresentation
	});
	
    NetShows.PresentationBrowser.superclass.constructor.call(this, {
        id:'presentation-tree',
        lines:false,
		layout: 'fit',
		border: false,
        containerScroll: true,
        animate:true,
        enableDD:true,
        collapseFirst:false,
        rootVisible:false,
        root: new Ext.tree.AsyncTreeNode({
        	text: 'Presentation Viewer',
        	draggable:false,
        	allowDrop:false,
        	id:'root'
    	}),
        loader: new Ext.tree.TreeLoader({
            url:  '/folder/get_all',
			baseParams: {authenticity_token: NetShows.key},
			preloadChildren: false,
			listeners: {
				'load': this.ready,
				scope: this
			}
        })
    });
	
	/* Mais à quoi ça sert ce truc de merde ça change rien !!!! */
    this.addEvents({presentationselect:true,presentationopen:true});
	
	this.on('dblclick', this.openPresentation, this);
	this.on('click', this.onClick, this);
    this.on('contextmenu', this.onContextMenu, this);
	
	this.on('removeelement', this.onRemove, this);
	this.on('new', this.onNew, this);
	this.on('movenode', this.onMoveNode, this);
	
	//Manage the click event delay before showing the details
	this.delay = new Ext.util.DelayedTask(this.detailsPresentation, this);
};

Ext.extend(NetShows.PresentationBrowser, Ext.tree.TreePanel, {	
	onMoveNode : function(tree, node, oldParent, newParent, index){
		if (oldParent != newParent) {
			var myUrl = (node.isLeaf()) ? '/presentation/move' : '/folder/move';
			Ext.Ajax.request({
				url: myUrl,
				params: {
					authenticity_token: NetShows.key,
					id: node.id,
					parent_id: newParent.id
				}
			});
		}
	},
	
	onRemove : function(tree, parent, node){
		//Fire the event to delete the associate tab if it's open
		if(node.isLeaf()){
			this.fireEvent('removepresentation', node.id);
		}
		node.unselect();
		
		//Choose the next node to be selected. First : the next one, if not the previous, if not the parent
		var nextNode = (node.nextSibling)?node.nextSibling:(node.previousSibling)?node.previousSibling:parent;
		nextNode.select();
		
		//If the node is not in the trash bin then it goes
		if(node.isAncestor(this.presentations)){
			//If the node contains many other files we do an effect for them
			if(!node.isLeaf()){
				if(node.childNodes){
					node.eachChild(function(me){
						Ext.fly(me.ui.elNode).ghost('l', {
				        	duration: .4
				    	});
					})
				}
			}
	        Ext.fly(node.ui.elNode).ghost('l', {
	            callback: function(){
					//node.remove();
					this.trash.appendChild(node);
					
					//If the node contains many other files we do an effect for them
					if(!node.isLeaf()){
						if(node.childNodes){
							node.eachChild(function(me){
								Ext.fly(me.ui.elNode).slideIn('l', {
						        	duration: .8
						    	});
							})
						}
					}
					Ext.fly(node.ui.elNode).slideIn('l', {
			        	duration: .8, concurrent: false
			    	});
					//this.fireEvent('new', node, node.parentNode);
				}, scope: this, duration: .4, concurrent: false
	        });
			//node = new Ext.tree.TreeNode({text: 'test'});
			
		}else{
			var myUrl = (node.isLeaf())?'/presentation/delete':'/folder/delete';
			Ext.Ajax.request({
				url: myUrl,
				params: { 
					authenticity_token: NetShows.key,
					id: node.id
				}
			});
			
			//If the node contains many other files we do an effect for them
			if(!node.isLeaf()){
				if(node.childNodes){
					node.eachChild(function(me){
						Ext.fly(me.ui.elNode).ghost('l', {
				        	duration: .4
				    	});
					})
				}
			}
	        Ext.fly(node.ui.elNode).ghost('l', {
	            callback: node.remove, scope: node, duration: .4, concurrent: false
	        });
		}		
	},
	
	onModify : function(attrs){
		var node = attrs.node;
		node.setText(attrs.text);
		if (node.isLeaf()) {
			node.attributes.description = attrs.description;
			node.attributes.tags = attrs.tags;
			node.attributes.updated_at = attrs.updated_at;

			Ext.Ajax.request({
				url: '/presentation/modify',
				params: {
					authenticity_token: NetShows.key,
					id: node.id,
					title: attrs.text,
					description: attrs.description,
					tags: attrs.tags
				}
			});
		}else{
			Ext.Ajax.request({
				url: '/folder/modify',
				params: {
					authenticity_token: NetShows.key,
					id: node.id,
					title: attrs.text
				}
			});
		}
		Ext.fly(node.ui.elNode).highlight();
	},
	
	onNew : function(node, parent){
		parent.expand();
		
		//If it's a presentation
		if(node.isLeaf()){
			Ext.Ajax.request({
				url: '/presentation/add',
				params: {
					authenticity_token: NetShows.key,
					parent_id: parent.id,
					title: node.text,
					description: node.attributes.description,
					tags: node.attributes.tags
				},
				success: function(response){
					node.id = 'presentation-' + response.responseText;
					
					//Append the new presentation in the tree view and shows it
        			parent.appendChild(node);
					Ext.fly(node.ui.elNode).slideIn('l', {
			        	callback: node.select, scope: node, duration: .8, concurrent: false
			    	});
					//Hilighting the new presentation
					Ext.fly(node.ui.elNode).highlight("ffff9c",{
						callback: function(){
							msg_log("opening : " + node.id);
							//Open the presentation after its creation
							this.fireEvent('presentationopen', node);
						},
						scope: this
					});
				}, 
				scope: this
			});
			
		//If it's a folder
		}else{
			Ext.Ajax.request({
				url: '/folder/add',
				params: {
					authenticity_token: NetShows.key,
					title: node.text,
					parent_id: parent.id
				},
				success: function(response){
					node.id = 'folder-' + response.responseText;
					//Append the new presentation in the tree view and shows it
        			parent.appendChild(node);
					Ext.fly(node.ui.elNode).slideIn('l', {
			        	callback: node.select, scope: node, duration: .8, concurrent: false
			    	});
					//Hilighting the new presentation
					Ext.fly(node.ui.elNode).highlight();
				},
				scope: this
			});
		}
	},
	
	//Initialize the nodes
	ready : function(){
		this.presentations = this.root.childNodes[0];
		this.trash = this.root.childNodes[1];
		this.parentNode = this.presentations;
	    this.presentations.select(0);
		this.presentations.setText((this.myPresentationsText)?this.myPresentationsText:"My presentations");
		this.trash.setText((this.trashText)?this.trashText:"Trash");
	},
	
	openPresentation: function(){
		//Cancel the timeout to show the editor
		this.delay.cancel();
		
		var node = (this.ctxNode)?this.ctxNode:this.getSelectionModel().getSelectedNode();
		if(node.isLeaf()){
			this.fireEvent('presentationopen', node);
		}
	},
	
	detailsPresentation : function(){
		var node = (this.ctxNode)?this.ctxNode:this.getSelectionModel().getSelectedNode();
		
		//Diable details view for folders
		if(node.isLeaf())
		this.fireEvent('presentationselect', node.attributes);
	},

	onClick : function(node){
		this.setActionStates(node);
		if(node){
    		//Set the parent node for future file creating
    		if(node.isLeaf()){
				this.parentNode = node.parentNode;
        	}else{
				this.parentNode = node;
			}
		}else{
			this.parentNode = this.presentations;
		}
		//Catch a timeout to show the details
		this.delay.delay(200);
	},
	
	setActionStates : function (n){
		var node = (n)?n:(this.ctxNode)?this.ctxNode:this.getSelectionModel().getSelectedNode();

		//Disable function for a folder
		this.actionEdit.setDisabled(!node.isLeaf());
		this.actionDetails.setDisabled(!node.isLeaf());
		
		//Disable the remove button from the bottom toolbar when the trash or the presentation folder are selected
    	var removeDisabled = (node.id == 'my-presentations' || node.id == 'trash-node')?true:false;
		this.actionRemove.setDisabled(removeDisabled);
		
		//Disable the new button when the trash is selected
    	var newDisabled = (node.isAncestor(this.trash) || node == this.trash)?true:false;
		this.actionNew.setDisabled(newDisabled);
		this.actionNewFolder.setDisabled(newDisabled);
	},
	
	//Right clic
    onContextMenu : function(node, e){		
        if(!this.menuPresentation){ // create context menu on first right click
            this.menuPresentation = new Ext.menu.Menu({
                id:'presentations-ctx',
                items: [this.actionEdit, '-', this.actionDetails, this.actionModify, '-', this.actionRemove]
            });
            this.menuPresentation.on('hide', this.onContextHide, this);
        }
        if(!this.menuTrash){ // create context menu on first right click
            this.menuTrash = new Ext.menu.Menu({
                id:'presentations-ctx',
                items: [this.actionEmptyTrash]
            });
            this.menuTrash.on('hide', this.onContextHide, this);
        }
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
        
        //Show the right clic menu for the trash bin
        if(node.id == "trash-node"){
            this.ctxNode = node;
            this.ctxNode.ui.addClass('x-node-ctx');
           	this.menuTrash.items.itemAt(0).setDisabled(!this.trash.childNodes.length);
            this.menuTrash.showAt(e.getXY());
			
		//Disable the right click on my-presentations folder
        }else if(node.id == 'my-presentations'){
        	return;
			
        //Show the right clic menu for a presentation or a folder
        }else{
            this.ctxNode = node;
            this.ctxNode.ui.addClass('x-node-ctx');
            this.menuPresentation.showAt(e.getXY());
        }
		
		this.setActionStates();
    },

    onContextHide : function(){
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
		this.setActionStates();
    },
	
	emptyTrash : function(){
		msg_log(this.trash.childNodes);
		Ext.each(this.trash.childNodes, function(item){
			this.fireEvent('removeelement', this, item.parentNode, item);
		}, this);
	},
	
    WindowPresentation : function(btn){
        if(!this.presentationwin){
            this.presentationwin = new NetShows.PresentationWindow();
            this.presentationwin.on('createpresentation', this.addPresentation, this);
            this.presentationwin.on('modifypresentation', this.onModify, this);
        }
        this.presentationwin.show(btn);
    },

    WindowFolder : function(btn){
        if(!this.folderwin){
            this.folderwin = new NetShows.FolderWindow();
            this.folderwin.on('createfolder', this.addFolder, this);
            this.folderwin.on('modifyfolder', this.onModify, this);
        }
		this.folderwin.show(btn);
    },
	
	addFolder : function(attrs){
        Ext.apply(attrs, {
            leaf:false,
			text: attrs.name,
			expanded: false
        });
        var node = new Ext.tree.TreeNode(attrs);
		this.fireEvent('new', node, this.parentNode);
        return node;
    },
	
    addPresentation : function(attrs){
        Ext.apply(attrs, {
            iconCls: 'presentation-icon',
            leaf: true,
			allowDrop: false,
			author: (this.authorMeText)?this.authorMeText:"Me",
			description: attrs.description
        });
        var node = new Ext.tree.TreeNode(attrs);
		this.fireEvent('new', node, this.parentNode);
        return node;
    }
});