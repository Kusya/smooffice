/**
 * @author cgonnet
 * Description of the class Slide which composes a presentation
 */

var Slide = function(data, p_id){
	/*
	 * Properties
	 */
	//Id in the database
	this.id = data.id;
	
	//Id for the dom element
	this.slideId = 'slide-wrap-' + this.id;
	this.presentation_id = p_id;
	
	this.data = data;
	this.properties = this.data.p ? this.data.p : {};
	this.data.e = data.e ? data.e : [];
	this.elements = [];
	
	//Number of elements
	//this.nbElements = 0;
	
	//Min and max layer index
	//this.minIndex = this.maxIndex = 2000;
	
	this.transition = data.t ? data.t : [null];
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
		//If the slide has elements
		if (this.data.e.length > 0) {
		
			Ext.each(this.data.e, function(item){
				var element = new Element(item, this.slideId);
				
				this.elements.push(element);
			}, this);
		}
		this.generateCSS();
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
	this.getIndexAnimByElId = function(id){
		this.tmpId = id;
		Ext.each(this.animations, function(a, index){
			if (a.o == this.tmpId) {
				this.elIndex = index
				return true
			}
		}, this);
		
		return this.elIndex;
	}
	this.setAnimation = function(element, type, params){
	
		if (params.effect != undefined) {
			this.animations = {
				f: params.effect
			};
		}
		if (params.direction != undefined) {
			this.animations.direction = params.direction;
		}
		if (params.duration != undefined) {
			this.transition.duration = params.duration;
		}
	}
	
	this.setTransition = function(params){
		//msg_log(params);
		if (params.effect != undefined) {
			this.transition = {
				f: params.effect
			};
		}
		if (params.direction != undefined) {
			this.transition.direction = params.direction;
		}
		if (params.duration != undefined) {
			this.transition.duration = params.duration;
		}
		if (params.o != undefined) {
			this.transition.o = params.o;
		}
		if (params.horizFirst != undefined) {
			this.transition.horizFirst = params.horizFirst;
		}
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
		/*Set the z-index position to element
		 this.maxIndex++;
		 Ext.apply(params.p, {
		 zIndex: this.maxIndex
		 });*/
		var element = new Element(params, this.slideId);
		this.elements.push(element);
		element.createDom();
		
		this.animations.push({
			o: element.id
		});
		
		this.fireEvent('addelement');
		
		return element;
	}
	
	this.removeElement = function(resizable, element){
		//Remove the element from the elements table
		var index = this.elements.indexOf(element);
		this.elements.splice(index, 1);
		
		//Delete all corresponding animations
		Ext.each(this.animations, function(a){
			if (a.o == element.id) {
				var index = this.animations.indexOf(a);
				this.animations.splice(index, 1);
			}
		}, this);
		
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
	}
	
	//Send the JSON string of the actual slide
	this.save = function(callbackFn, scopeFn){
		//For each element, we get the object used to the JSON
		var elementJSON = [];
		
		Ext.each(this.elements, function(item){
			elementJSON.push(item.getJSON());
		}, this);
		
		this.json = Ext.util.JSON.encode({
			c: '',//Commentaires
			a: this.animations,
			t: this.transition,
			e: elementJSON,
			p: this.properties
		});
		
		msg_log(this.json);
		
		Ext.Ajax.request({
			url: '/slide/save',
			params: {
				authenticity_token: NetShows.key,
				id: this.id,
				content: this.json
			},
			callback: callbackFn,
			scope: scopeFn
		});
	};
	
	this.init();
	
	Slide.superclass.constructor.call(this, {});
	this.addEvents({
		'addelement': true,
		'removeelement': true
	});
}

Ext.extend(Slide, Ext.util.Observable, {});
