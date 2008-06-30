/**
 * @author Clément GONNET
 * The slides main view
 *
 * @to-do:
 * + When resizing the slide, some pictures are not resized
 * + As drag and droping an element, it's not well positionned from the mouse coordinates
 */
NetShows.SlideView = function(presentation){
    this.presentation = presentation;
    this.slide = null;
    
    NetShows.SlideView.superclass.constructor.call(this, {
        id: 'slide-view',
        autoScroll: true,
        border: false,
        items: {
            html: '<div id="slide-wrap"></div>',
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
        if (e === true || Ext.get(e.target).parent() == Ext.get('slide-wrap') || Ext.get(e.target) == Ext.get('slide-wrap') || Ext.get(e.target) == Ext.get('slide-wrap').parent() || Ext.get(e.target) == Ext.get('slide-view)')) {
            this.setFocusElement(null);
        }
        this.presentation.updatePreview();
        NetShows.browserPanel.slideBrowser.refresh();
    },
    setFocusElement: function(element){
        //If there was a previous selected resizable element then it should be destroyed
        if (this.focusElement) {
        
            //But if its the same, we won't delete it
            if (element != this.focusElement) {
                //Remove the resizable class
                this.resizableElement.getEl().removeClass('x-resizable-pinned');
                this.resizableElement.destroy(false);
                if (this.focusElement.data.className == 'text') {
                    this.focusElement.el.dom.innerHTML = this.focusElement.data.c = this.focusElement.el.editor.getValue();
                    this.focusElement.el.editor.destroy();
                }
            }
            else {
                return false;
            }
        }
        
        
        //SetNoFocus
        if (element == null) {
            this.focusElement = null;
            return true;
        }
        
        var config = {
            pinned: true,
            handles: 'all',
            draggable: true,
            dynamic: true
        };
        switch (element.data.className) {
            case 'text':
                //msg_log("text");
                Ext.apply(config, {
                    preserveRatio: false,
                    wrap: false
                });
                
                element.el.editor = new Ext.ux.HtmlEditorUsingGlobalToolbar({
                    globalToolBar: NetShows.mainPanel.getTopToolbar(),
                    value: element.el.dom.innerHTML
                });
                element.el.hide();
                element.el.dom.innerHTML = '';
                element.el.editor.render(element.el.dom)
                element.el.show();
                break;
            case 'img':
                //msg_log("image");
                Ext.apply(config, {
                    preserveRatio: true,
                    wrap: false
                });
                break;
            case 'video':
                //msg_log("video");
                Ext.apply(config, {
                    preserveRatio: false,
                    wrap: false
                });
                break;
            case 'map':
                //msg_log("video");
                Ext.apply(config, {
                    preserveRatio: false,
                    wrap: false
                });
                break;
            default:
                msg_log("No class");
                return false;
        }
        
        var myResizableElement = new Ext.Resizable(element.el, config);
        
        this.focusElement = element;
        this.resizableElement = myResizableElement;
    },
    getFocusElement: function(){
        msg_log(this.focusElement);
    },
    saveSlide: function(){
        this.slide.save();
    },
    initialize: function(panel){
    
        //Initialization
        //this.setSlide({number: 0});
        
        
        //this.init.delay(200);
        
        Ext.EventManager.addListener(Ext.get('slide-view'), 'click', this.setNoFocus, this);
        
        this.dropZone = new Ext.dd.DropZone(panel.getEl(), {
            ddGroup: 'slide',
            
            //      If the mouse is over a target node, return that node. This is
            //      provided as the "target" parameter in all "onNodeXXXX" node event handling functions
            getTargetFromEvent: function(e){
                return e.getTarget('#slide-wrap');
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
				var imagesFileTypes = ['file-bmp','file-gif','file-jp2','file-jpeg','file-jpg','file-png','file-tga','file-tif','file-tiff'];
				if(data.node){
					var t = data.node.attributes.iconCls;
					data.elementData = {};
					if (imagesFileTypes.indexOf(t) != -1) {
						data.elementData.type = 'img';
					}
					
					else 
						if (t == 'file-mov' || t == 'file-mp4' || t == 'file-mpg' || t == 'file-rm' || t == 'file-wmv') {
							data.elementData.type = 'video';
						}
						else {
							return false;
						}
								
					
					data.elementData.url = '/user_doc/'+NetShows.user.username + data.node.attributes.id;
				}
                var LeftTop = panel.getLeftTop(e);
                var myElement = panel.slide.addElement({
                    t: data.elementData.type,
                    c: data.elementData.url,
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
            c: 'Text',
            p: {
                top: '45%',
                left: '45%',
                width: '38%',
                height: '20%'
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
				html: '<iframe id="draw-frame" style="border:0" width="100%" height="100%" src="/applet/draw?id=' + this.slide.id + '"></iframe>'
			});
			this.drawWindow.show();
		}
		else {
			Ext.get('draw-frame').set({
				src: '/applet/draw?id=' + this.slide.id
			});
			Ext.get('draw-frame').on('load', this.drawWindow.show, this.drawWindow);
		}
	},
    
    //Get the top left value of the mouse
    getLeftTop: function(e){
        var LeftTop = {};
        LeftTop.left = Math.round(((e.getXY()[0] - Ext.get("slide-wrap").getX()) * 100 / Ext.get('slide-wrap').getWidth()) * 100) / 100 + '%';
        LeftTop.top = Math.round(((e.getXY()[1] - Ext.get("slide-wrap").getY()) * 100 / Ext.get('slide-wrap').getHeight()) * 100) / 100 + '%';
        return LeftTop
    },
    
    setSlide: function(params){
        params = params ? params : {
            number: 0
        };
        
        if (this.slide) {
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
        Ext.get("slide-wrap").parent().setStyle("padding", '2px');
        
        Ext.get("slide-wrap").setWidth(width);
        Ext.get("slide-wrap").setHeight(height);
        //Ext.get("slide-wrap").scale(width, height);
        
        //Set the right measurments for each elements
        if (this.slide) 
            this.slide.resizeEvent();
        
        /*Ext.get("slide-wrap").animate({
         fontSize: {
         to: 200,
         unit: "%"
         }
         });*/
    }
});
