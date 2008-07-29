/**
 * @author cgonnet
 * Description of the class Slide which composes a presentation
 */

var Slide = function(data, presentation,index){
	/*
	 * Properties
	 */
	//Id in the database
	this.id = data.id;
	
	//Id for the dom element
	this.slideId = 'slide-wrap-' + this.id;
	this.presentation = presentation;
	this.presentation_id = this.presentation.id;
	
	this.data = data;
	this.properties = this.data.p ? this.data.p : {};
	this.data.e = data.e ? data.e : [];
	this.elements = [];
	
	//Flag for modification to save
	this.modified = false;
	
	//Index of the slide
	this.index = index;
	
	//Whether the slide is visible (used for saving action)
	this.isVisible = false;
	
	this.transition = data.t ? data.t : [{
		f: "null"
	},{
		t: "null"
	}];
	this.animations = data.a ? data.a : [];
	
	//The generated dom corresponding to the slide
	this.el = null;
	
	//css style to apply to the slide
	this.cssStyle = '';
	
	/*
	 * Function
	 */
	//Generate slide content
	this.init = function(){
		//Event on Modified
		this.on('modified', this.setModified,this);
		
		//If the slide has elements
		if (this.data.e.length > 0) {
		
			Ext.each(this.data.e, function(item){
				var element = new Element(item, this);
				element.on('modified',this.setModified,this);
				this.elements.push(element);
			}, this);
		}
		this.generateCSS();
	}
	
	this.setModified = function(){
		this.modified = true;
		this.presentation.modified = true;
	}
	
	this.generateCSS = function(){
		for (var l in this.properties) {
			this.cssStyle += l.replace(/[A-Z]/, function(match){
				return '-' + match.toLowerCase();
			}) +
			': ' +
			this.properties[l] +
			';';
		}
	}
	
	//Create the dom element
	this.show = function(){
	
		//If it's the first time it generates the slide
		if (!this.el) {
			this.el = Ext.get('slide-wrap-' + this.presentation_id).createChild({
				tag: 'div',
				style: 'height: 100%;width: 100%;top:0px;left:0px;',
				id: this.slideId
			});
			
			this.el.applyStyles(this.cssStyle);
			
			
			Ext.each(this.elements, function(item){
				item.createDom();
			}, this);
			
			//If the slide has already been generated
		}
		else {
			//Shows the slide
			this.el.setDisplayed(true);
			
			//Resize the elements from % values
			this.resizeEvent();
		}
		this.isVisible = true;
	}
	this.destroy = function(){
		//Destroy all elements
		Ext.each(this.elements, function(item){
			item.destroy();
		}, this);
		
		//Remove the slide from the DOM
		if (this.el) {
			this.el.remove();
		}
	}
	
	/*
	 * gets the first animation of element id with type 'type'
	 */
	this.getAnimIndex = function(id,type){
		this.tmpId = id;
		this.tmpType = type;
		this.tmpIndex = false;
		Ext.each(this.animations, function(a, index){
			if (a) {//Prevent bug with remove() function in array
				if (a.id == this.tmpId && a.type == this.tmpType) {
					this.tmpIndex = index
					return true
				}
			}
		}, this);
		
		return this.tmpIndex;
	}
	
	this.addAnimation = function(params){
		return (this.animations.push(params)-1);
	}
	
	this.removeAnimation = function(index){
		/*this.tmpId = id;
		this.tmpType = type;
		this.tmpIndex = false;
		Ext.each(this.animations, function(a, index){
			if (a) {//Prevent bug with remove() function in array
				if (a.id == this.tmpId && a.type == this.tmpType) {
					msg_log('removeAnimation : ' + id + ' - ' + type);
					//Remove animation from animations array
					this.animations.splice(index, 1);
					this.tmpIndex = index;
					return true
				}
			}
		}, this);*/
		
		this.animations.splice(index, 1);

		return true;
	}
	
	this.setTransition = function(params){
		//msg_log(params);
		if (params.effect != undefined) {
			this.transition = [{
				f: "null"
			}, {
				f: params.effect
			}];
		}
		if (params.direction != undefined) {
			this.transition[1].direction = params.direction;
		}
		if (params.duration != undefined) {
			this.transition[1].duration = params.duration;
		}
		if (params.o != undefined) {
			this.transition[1].o = params.o;
		}
		if (params.horizFirst != undefined) {
			this.transition[1].horizFirst = params.horizFirst;
		}
		NetShows.browserPanel.slideBrowser.setAnimationTransition(this.index);
	}
	
	this.setBackground = function(params){
		switch (params.type) {
			case 'color':
				this.properties.backgroundColor = params.p.color;
				this.el.applyStyles('background-color:' + params.p.color);
				this.generateCSS();
				break;
			case 'null':
				this.properties.backgroundColor = 'transparent';
				this.el.applyStyles('background:transparent');
				this.generateCSS();
				break;
			case 'gradient':
				break;
			case 'image':
				break;
			default:
				break;
		}
	}
	
	this.addElement = function(params){
		var element = new Element(params, this);
		this.elements.push(element);
		element.createDom();
		
		this.fireEvent('addelement');
		
		return element;
	}
	
	this.removeElement = function(resizable, element){
		//Remove the element from elements array
		var index = this.elements.indexOf(element);
		this.elements.splice(index, 1);
		
		//Find all corresponding animations
		this.toRemove = [];
		var currentAnim;
		for (var a in this.animations) {
			currentAnim = this.animations[a];
			if (currentAnim.constructor == Object) {
				if (element.id == currentAnim.id) {
					//Because it provokes bugs when deleting element in a parsed array, store the index to delete
					this.toRemove.push(parseInt(a));
				}
			}
		}
		
		//Reverse array to delete by descending order
		this.toRemove.reverse();
		//Delete corresponding animations
		for (var i in this.toRemove){
			if (this.toRemove[i].constructor == Number) {
				this.animations.splice(this.toRemove[i], 1);
			}
		}
		
		Ext.fly(element.el).switchOff({
			easing: 'easeOut',
			remove: true,
			callback: function(){
				//Destroy the element
				element.destroy();
				
				//Destroy the resizable element
				resizable.destroy();
				resizable = null;
				element = null;
			},
			scope: this
		});

		//Fire remove event, catched in NetShows.EditorAccordion.Animation.setSlide()
		this.fireEvent('removeelement');
	}
	
	this.getElById = function(id){
		Ext.each(this.elements, function(elem){
			if (elem.id == id) 
				this.e = elem
		}, this);
		return this.e || false;
	}
	
	this.getPreview = function(){
		var globalHtml = '<div style="' + this.cssStyle + 'width:100%;height:100%;position:absolute;">';
		
		Ext.each(this.elements, function(item){
			globalHtml += item.getPreview();
		}, this);
		globalHtml += '</div>'
		return globalHtml;
	}
	
	this.getProperties = function(){
		Ext.each(this.elements, function(item){
			item.getProperties();
		}, this);
	}
	
	this.resizeEvent = function(){
		//Resize only if the size changed
		if (this.lastSize != this.el.getWidth()) {
		
			Ext.each(this.elements, function(item){
				item.resizeEvent();
			}, this);
			
			//Save the last size of the slide
			this.lastSize = this.el.getWidth();
		}
	}
	
	this.saveDomState = function(){
		//Save the properties in %
		this.getProperties();
		//Hide the slide
		this.el.setDisplayed(false);
		this.isVisible = false;
	}
	
	//Send the JSON string of the actual slide
	this.save = function(callbackFn){
		if (this.modified) {
			//Get properties if the slide is actually edited
			if(this.isVisible)
				this.getProperties();

			this.presentation.nbToSave++;
			//For each element, we get the object used to the JSON
			var elementJSON = [];
			
			Ext.each(this.elements, function(item){
				elementJSON.push(item.getJSON());
			}, this);
			
			var json = Ext.util.JSON.encode({
				c: '',//Commentaires
				a: this.animations,
				t: this.transition,
				e: elementJSON,
				p: this.properties
			});
			
			msg_log(json);
			
			Ext.Ajax.request({
				url: '/slide/save',
				params: {
					authenticity_token: NetShows.key,
					id: this.id,
					content: json
				},
				callback: function(){
					callbackFn.call(this.presentation, this);
				},
				scope:this
			});
			
			//The slide is saved so no more modifications
			this.modified = false;
		}
	};
	
	Slide.superclass.constructor.call(this, {});
	this.addEvents({
		'addelement': true,
		'removeelement': true,
		'load': true
	});
	
	this.init();
}

Ext.extend(Slide, Ext.util.Observable, {});
