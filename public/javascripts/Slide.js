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
	this.elements = data.e?data.e:{};
	
	//Number of elements
	this.nbElements = 0;
	
	//Min and max layer index
	this.minIndex = this.maxIndex = 2000;
	
	this.transitions = data.t ? data.t : [{
		f: null
	}, {
		f: null
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
		//If the slide has elements
		if (this.elements != {}) {
			var first = true;
			for (var i in this.elements) {
				if (first) {
					//Initialize min and max of z-index
					this.minIndex = this.maxIndex = this.elements[i].p.zIndex ? this.elements[i].p.zIndex : this.maxIndex;
					first = false;
				}
				if(this.elements[i].p.zIndex === undefined){
					this.elements[i].p.zIndex = this.maxIndex++;
				}
				this.elements[i] = new Element(this.elements[i], this.slideId, i);
				
				//Set the max and the min belong each zIndex properties
				if (this.elements[i].data.p.zIndex) {
					if (this.elements[i].data.p.zIndex > this.maxIndex) {
						this.maxIndex = this.elements[i].data.p.zIndex
					}
					else 
						if (this.elements[i].data.p.zIndex < this.minIndex) {
							this.minIndex = this.elements[i].data.p.zIndex
						}
				}
				this.nbElements++;
			}
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
			
			//msg_log('slide.createDom');	
			for (var i in this.elements) {
				this.elements[i].createDom();
			}
			
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
		if (this.el) {
			this.el.remove();
		}
	}
	this.setBackground = function(params){
		switch (params.type) {
			case 'color':
				this.properties.backgroundColor = params.p.color;
				this.el.applyStyles('background-color:'+params.p.color);
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
		//Set the z-index position to element
		this.maxIndex++;
		Ext.apply(params.p, {
			zIndex: this.maxIndex
		});
		
		this.nbElements++;
		
		//Creating element
		var element = new Element(params, this.slideId, this.nbElements);
		
		msg_log(this.elements);
		msg_log(element.index);
		
		//Create dom
		element.createDom();
		
		//Add element to slide elements object
		this.elements['e' + this.nbElements] = element;
		
		return element;
	}
	
	this.removeElement = function(resizable, element){
		//Remove the element from the elements table
		//var index = this.elements.indexOf(element);
		//this.elements.splice(index);
		
		//Destroy the element
		element.destroy();
		//Destroy the resizable element
		resizable.destroy();
		resizable = null;
		//this.elements[element.index] = null;
		element = null;
	}
	
	this.getPreview = function(){
		var globalHtml = '<div style="'+this.cssStyle+'width:100%;height:100%;position:absolute;">';
		for (var i in this.elements) {
			globalHtml += this.elements[i].getPreview();
		}
		globalHtml += '</div>'
		return globalHtml;
	}
	
	this.getProperties = function(){
		for (var i in this.elements) {
			this.elements[i].getProperties();
		}
	}
	
	this.resizeEvent = function(){
		//Resize only if the size changed
		if (this.lastSize != this.el.getWidth()) {
			
			for (var i in this.elements) {
				this.elements[i].resizeEvent();
			}
			
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
		var elementJSON = {};
		
		for (var i in this.elements) {
			elementJSON[i] = this.elements[i].getJSON();
		}
		
		msg_log(elementJSON);
		
		this.json = Ext.util.JSON.encode({
			c: '',//Commentaires
			a: this.animations,
			t: this.transitions,
			e: elementJSON,
			p: this.properties
		});
		
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
}
