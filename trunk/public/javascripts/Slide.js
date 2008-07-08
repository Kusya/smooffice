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
	this.properties = data.p ? data.p : {};
	this.elements = data.e?data.e:{};
	
	//Number of elements
	this.nbElements = 0;
	
	this.transitions = data.t ? data.t : [{
		f: null
	}, {
		f: null
	}];
	this.animations = data.a ? data.a : [];
	
	//The generated dom corresponding to the slide
	this.el = null;
	
	/*
	 * Function
	 */
	//Generate slide content
	this.init = function(){
		//If the slide has elements
		if (this.elements != {}) {
			for (var i in this.elements) {
				this.elements[i] = new Element(this.elements[i],this.slideId, i);
			}
			this.nbElements = i;
		}
		//Apply css style to the slide
		this.cssStyle = '';
		for (var l in this.properties) {
			this.cssStyle += l.replace(/[A-Z]/, function(match){
				return '-' + match.toLowerCase();
			}) +
			': ' +
			this.data.p[l] +
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
	
	this.addElement = function(params){
		var element = new Element(params, this.slideId, this.nbElements++);
		element.createDom();
		eval("this.elements.e" + this.nbElements + " = element;");
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
