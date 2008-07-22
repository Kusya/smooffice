/**
 * @author Clément GONNET
 * The slides main view
 * 
 * 
 * TODO : Layer management : add "element" class for all elements to avoid swap them with x-resizable-proxy
 */
NetShows.SlideView = function(presentation){
	this.presentation = presentation;
	this.slide = null;
	
	this.actionRemove = new Ext.Action({
		iconCls: 'icon-cross',
		text: (this.removeText) ? this.removeText : "Remove",
		handler: function(){
			if (this.focusElement) 
				this.slide.removeElement(this.resizableElement, this.focusElement);
				this.setFocusElement(null);
		},
		scope: this
	});
	
	this.actionMoveBack = new Ext.Action({
		iconCls: 'icon-move-back',
		text: (this.moveBackText) ? this.moveBackText : "Move back",
		handler: function(){
		
			//If focusElement is not the first
			if (this.focusElement.el.prev('.element')) {
				var parent = this.focusElement.el.parent();
				
				//Insert FocusElement to the first position
				parent.insertFirst(this.focusElement.el);
				
				//Changing slide elements array position
				var focusIndex = this.slide.elements.indexOf(this.focusElement);
				
				//Swap the two elements
				var tmpElement = this.slide.elements[0];
				this.slide.elements[0] = this.focusElement;
				this.slide.elements[focusIndex] = tmpElement;
			}
		},
		scope: this
	});
	
	this.actionMoveBackwards = new Ext.Action({
		iconCls: 'icon-move-backwards',
		text: (this.moveBackwardsText) ? this.moveBackwardsText : "Move backwards",
		handler: function(){
			//If focusElement is not the first one
			if (this.focusElement.el.prev('.element')) {
				//Changing DOM position
				//Insert FocusElement before the previous one
				this.focusElement.el.insertBefore(this.focusElement.el.prev('.element'));
				
				//Changing slide elements array position
				var focusIndex = this.slide.elements.indexOf(this.focusElement);
				
				//Swap the two elements
				var tmpElement = this.slide.elements[focusIndex-1];
				this.slide.elements[focusIndex-1] = this.focusElement;
				this.slide.elements[focusIndex] = tmpElement;
			}
		},
		scope: this
	});
	
	this.actionMoveFront = new Ext.Action({
		iconCls: 'icon-move-front',
		text: (this.moveFrontText) ? this.moveFrontText : "Move front",
		handler: function(){
			//If focusElement is not the last
			if (this.focusElement.el.next('.element')) {
				var parent = this.focusElement.el.parent();
				
				//Insert FocusElement after the last one
				this.focusElement.el.insertAfter(parent.last('.element'));
				
				//Remove the element from the elements table
				var index = this.slide.elements.indexOf(this.focusElement);
				this.slide.elements.splice(index,1);
				//Add the element at the end of the table
				this.slide.elements.push(this.focusElement);
			}
		},
		scope: this
	});
	
	this.actionMoveForwards = new Ext.Action({
		iconCls: 'icon-move-forwards',
		text: (this.moveForwardsText) ? this.moveForwardsText : "Move forwards",
		handler: function(){
			//If focusElement is not already the last node
			if (this.focusElement.el.next('.element')) {
				//Insert FocusElement after the next one
				this.focusElement.el.insertAfter(this.focusElement.el.next('.element'));
				
				//Changing slide elements array position
				var focusIndex = this.slide.elements.indexOf(this.focusElement);
				
				//Swap the two elements
				var tmpElement = this.slide.elements[focusIndex+1];
				this.slide.elements[focusIndex+1] = this.focusElement;
				this.slide.elements[focusIndex] = tmpElement;
			}
		},
		scope: this
	});
	
	NetShows.SlideView.superclass.constructor.call(this, {
		id: 'slide-view-'+this.presentation.id,
		cls:'slide-view',
		autoScroll: true,
		border: false,
		items: {
			border: false
		},
		listeners: {
			render: this.initialize,
			show: function(){
				this.loadMask = new Ext.LoadMask(this.body, {
					msg: this.loadingMsgText ? this.loadingMsgText : 'Loading. Please wait...'
				});
			},
			resize: this.resizeEvent,
			scope: this
		}
	});
}
Ext.extend(NetShows.SlideView, Ext.Panel, {
	setNoFocus: function(e){
		//If the target is "slide-wrap" or "slide-wrap-slide-{0}" or "slide-view"
		if (e === true || Ext.get(e.target).parent() == Ext.get('slide-wrap-' + this.presentation.id) || Ext.get(e.target) == Ext.get('slide-wrap-' + this.presentation.id) || Ext.get(e.target) == Ext.get('slide-wrap-' + this.presentation.id).parent() || Ext.get(e.target) == Ext.get('slide-view')) {
			this.setFocusElement(null);
		}
		this.presentation.updatePreview(this.slide);
	},
	removeResizable: function(){
		if (this.resizableElement) {
			//Remove the resizable class
			this.resizableElement.getEl().removeClass('x-resizable-pinned');
			this.resizableElement.destroy(false);
		}
	},
	setFocusElement: function(element){
		//If there was a previous selected resizable element then it should be destroyed
		if (this.focusElement) {
		
			//But if its the same, we won't delete it
			if (element != this.focusElement) {
				this.removeResizable();
				this.focusElement.blur();
			}
			else {
				return false;
			}
		}
		
		
		//SetNoFocus
		if (element == null) {
			//Disable buttons in toolbar
			Ext.getCmp('icon-remove').disable();
			Ext.getCmp('icon-move-back').disable();
			Ext.getCmp('icon-move-front').disable();
			Ext.getCmp('icon-move-backwards').disable();
			Ext.getCmp('icon-move-forwards').disable();
			this.focusElement = null;
			NetShows.accordion.setElement(null);
			return true;
		}
		
		//Enable buttons in toolbar
		Ext.getCmp('icon-remove').enable();
		Ext.getCmp('icon-move-back').enable();
		Ext.getCmp('icon-move-front').enable();
		Ext.getCmp('icon-move-backwards').enable();
		Ext.getCmp('icon-move-forwards').enable();
		
		var config = {
			pinned: true,
			draggable: true,
			handles: 'all',
			dynamic: true,
			minHeight: 10,
			minWidth:10,
			minX:0,
			minY:0//Ext.get('slide-view-' + this.presentation.id).getEl().getComputedWidth()
		};
		
		if (element.preserveRatio) {
			Ext.apply(config, {
				preserveRatio: true,
				handles: 'ne nw se sw'
			});
		}
		
		switch (element.data.className) {
			case 'text':
				var myResizableElement = new Ext.Resizable(element.el, config);
				break;
			case 'img':
				var myResizableElement = new Ext.Resizable(element.el, config);
				break;
			case 'video':
				var myResizableElement = new NetShows.Resizable(element.el, config);
				break;
			case 'map':
				var myResizableElement = new NetShows.Resizable(element.el, config);
				break;
			default:
				return false;
		}
		
		if (element.data.className == 'text' || element.data.className == 'video' || element.data.className == 'map') {
			myResizableElement.dd.endDrag = function(){
				element.endDrag = true;
			}
		}
		
		this.focusElement = element;
		this.resizableElement = myResizableElement;
		NetShows.accordion.setElement(element);
	},
	/*getFocusElement: function(){
	 msg_log(this.focusElement);
	 },*/
	saveSlide: function(){
		this.slide.save();
		NetShows.hideMsg(100);
	},
	initialize: function(panel){
	
		this.getComponent(0).html = '<div class="slide-wrap" id="slide-wrap-' + this.presentation.id + '"></div>';
		Ext.EventManager.addListener(Ext.get('slide-view-' + this.presentation.id), 'click', this.setNoFocus, this);
		Ext.EventManager.addListener(Ext.get('slide-view-' + this.presentation.id), 'contextmenu', function(e){
			e.preventDefault();
		}, this);
		
		this.dropZone = new Ext.dd.DropZone(panel.getEl(), {
			ddGroup: 'slide',
			
			//      If the mouse is over a target node, return that node. This is
			//      provided as the "target" parameter in all "onNodeXXXX" node event handling functions
			getTargetFromEvent: function(e){
				return e.getTarget('.slide-wrap');
			},
			
			//      On entry into a target node, highlight that node.
			onNodeEnter: function(target, dd, e, data){
				Ext.fly(target).addClass('slide-wrap-hover');
			},
			
			//      On exit from a target node, unhighlight that node.
			onNodeOut: function(target, dd, e, data){
				Ext.fly(target).removeClass('slide-wrap-hover');
			},
			
			//      While over a target node, return the default drop allowed class which
			//      places a "tick" icon into the drag proxy.
			onNodeOver: function(target, dd, e, data){
				return Ext.dd.DropZone.prototype.dropAllowed;
			},
			
			//      On node drop, we can interrogate the target node to find the underlying
			//      application object that is the real target of the dragged data.
			//      In this case, it is a Record in the GridPanel's Store.
			//      We can use the data set up by the DragZone's getDragData method to read
			//      any data we decided to attach.
			onNodeDrop: function(target, dd, e, data){
				var imagesFileTypes = ['file-bmp', 'file-gif', 'file-jp2', 'file-jpeg', 'file-jpg', 'file-png', 'file-tga', 'file-tif', 'file-tiff'];
				if (data.node) {
					var t = data.node.attributes.iconCls;
					data.elementData = {};
					if (imagesFileTypes.indexOf(t) != -1) {
						data.elementData.type = 'img';
						data.elementData.thumbnail = null;
					}
					
					else 
						if (t == 'file-mov' || t == 'file-mp4' || t == 'file-mpg' || t == 'file-rm' || t == 'file-wmv') {
							data.elementData.type = 'video';
							data.elementData.thumbnail = null;
						}
						else {
							return false;
						}
					data.elementData.url = '/user_doc/' + NetShows.user.username + data.node.attributes.id;
				}
				var LeftTop = panel.getLeftTop(e);
				var myElement = panel.slide.addElement({
					t: data.elementData.type,
					c: {
						src: data.elementData.url,
						img: data.elementData.thumbnail
					},
					p: {
						top: LeftTop.top,
						left: LeftTop.left
					}
				});
				
				panel.setFocusElement(myElement);
				
				return true;
			}
		});
	},
	newText: function(){
		var myElement = this.slide.addElement({
			t: 'p',
			c: '<p align="center"><font size="4" face="arial"><b>Text</b></font></p>',
			p: {
				top: '45%',
				left: '40%',
				width: '12%',
				height: '7%',
				fontClass: 'A'
			}
		});
		this.setFocusElement(myElement);
	},
	newMap: function(){
		var myElement = this.slide.addElement({
			t: 'map',
			c: {},
			p: {
				top: '10%',
				left: '10%',
				width: '80%',
				height: '80%'
			}
		});
		this.setFocusElement(myElement);
	},
	newDrawApplet: function(){
		if (!this.drawWindow) {
			this.drawWindow = new Ext.Window({
				title: (this.drawWindowTitle) ? this.drawWindowTitle : "Drawing",
				iconCls: 'icon-preview',
				width: 800,
				height: 600,
				resizable: true,
				plain: false,
				modal: true,
				autoScroll: true,
				closeAction: 'hide',
				bodyBorder: true,
				html: '<iframe id="draw-frame" style="border:0" width="100%" height="100%" src="/drawapplet/draw?id=' + this.slide.id + '"></iframe>'
			});
			this.drawWindow.show();
		}
		else {
			Ext.get('draw-frame').set({
				src: '/drawapplet/draw?id=' + this.slide.id
			});
			Ext.get('draw-frame').on('load', this.drawWindow.show, this.drawWindow);
		}
	},
	
	//Get the top left value in % of the mouse from the slide-wrap position
	getLeftTop: function(e){
		var LeftTop = {};
		LeftTop.left = Math.round(((e.getXY()[0] - Ext.get('slide-wrap-' + this.presentation.id).getX()) * 100 / Ext.get('slide-wrap-' + this.presentation.id).getWidth()) * 100) / 100 + '%';
		LeftTop.top = Math.round(((e.getXY()[1] - Ext.get('slide-wrap-' + this.presentation.id).getY()) * 100 / Ext.get('slide-wrap-' + this.presentation.id).getHeight()) * 100) / 100 + '%';
		return LeftTop
	},
	
	setSlide: function(params){
		params = params ? params : {
			number: 0
		};
		
		if (this.slide && params.savePrevious) {
			this.slide.saveDomState();
		}
		//Set the edited slide
		this.slide = this.presentation.slides[params.number];
		
		//Set to null the focus element
		this.setNoFocus(true);
		
		//msg_log("SlideView.setSlide : " + params.number);
		
		//Initialization
		this.slide.show();
		this.fireEvent('resize');
		
		
		//this.getEl().slideIn('c', {easing: 'easeOut'});
	},
	resizeEvent: function(){
		//Save the current measures before resizing
		if (this.slide) 
			this.slide.getProperties();
		
		var margin = 33;
		//var width = this.ownerCt.getEl().getWidth() - margin;
		//var height = this.ownerCt.getEl().getHeight() - margin;
		var width = this.ownerCt.getBox().width - margin;
		var height = this.ownerCt.getBox().height - margin;
		
		//msg_log('box size : ' + width + '/' + height + ' = ' + width / height);
		if (width / height < 4 / 3) {
			height = Math.round(width * 3 / 4);
		}
		else {
			width = Math.round(height * 4 / 3);
		}
		
		//Set the right margins to keep the slide centered
		Ext.get('slide-wrap-' + this.presentation.id).parent().setStyle("padding", '2px');
		
		Ext.get('slide-wrap-' + this.presentation.id).setWidth(width);
		Ext.get('slide-wrap-' + this.presentation.id).setHeight(height);
		//Ext.get("slide-wrap").scale(width, height);
		
		//Set the right measurments for each elements
		if (this.slide) 
			this.slide.resizeEvent();
		
		/*Ext.get('slide-wrap-'+this.presentation.id).animate({
		 fontSize: {
		 to: 200,
		 unit: "%"
		 }
		 });*/
	},
	
	//Right clic
	onContextMenu: function(e, element){
		e.preventDefault();
		if (!this.menuElement) { // create context menu on first right click
			this.menuElement = new Ext.menu.Menu({
				id: 'element-ctx',
				items: [this.actionRemove, '-',this.actionMoveBack, this.actionMoveBackwards, this.actionMoveForwards, this.actionMoveFront,'-', {
					text: this.preserveRatioText || 'Preserve ratio',
					checked: element.preserveRatio||false,
					id:'checkbox-preserve-ratio',
					checkHandler: function(item, checked){
						//if(this.focsuElement.preserveRatio != checked){
						var tmp = this.focusElement;
						this.setNoFocus(true);
						tmp.setPreserveRatio(checked);
						this.setFocusElement(tmp);
					},
					scope: this
				}]
			});
		}
		
		//Enable preserveRatio option only for images
		Ext.getCmp('checkbox-preserve-ratio').setDisabled(!element.className == 'img');
		Ext.getCmp('checkbox-preserve-ratio').setChecked(element.preserveRatio||false);
		//Show the right clic menu
		this.menuElement.showAt(e.getXY());
	}
});
