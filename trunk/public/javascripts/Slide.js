/**
 * @author cgonnet
 * 
 * Description of the class Slide which compose a presentation
 * TODO:
 *  + Fix the problem at initialisation, the slide is not properly rendered and the element cannot be positionned
 */

/* Presentation
 * 	- store //Contains the slides
 * 		- init() //Generate the Dom node for each elements
 * 		- data	//Data provided from the server
 * 			- content //Content object corresponding to the received JSON
 * 				- element
 * 					- createDom() //Generate the dom for the specific element
 * 					- type
 * 	
 * 			- html	//Corresponding HTML string of the content
 * 			- id //Id of the slide in the database
 */

Slide = function(data){
	/*
	 * Properties
	 */
	//Id in the database
	this.id = data.id;
	//Id for the dom element
	this.slideId = 'slide-wrap-' + this.id;
	
	this.data = data;
	this.elements = [];
	this.transitions = data.t?data.t:[{f:null},{f:null}];
	this.animations = data.a?data.a:[];
	
	//The generated dom corresponding to the slide
	this.el = null;
	
	/*
	 * Function
	 */
	//Generate slide content
	this.init = function(){
		//If the slide has elements
		if (this.data.e) {
			Ext.each(this.data.e, function(item){
				this.elements.push(new Element(item, this.slideId));
			}, this);
		}
	}
	
	this.init();
	
	//Create the dom element
	this.show = function(){
	
		//If it's the first time it generates the slide
		if (!this.el) {
			this.el = Ext.get('slide-wrap').createChild({
				tag: 'div',
				style: 'height: 100%;width: 100%;top:0px;left:0px;',
				id: this.slideId
			});
			
			//msg_log('slide.createDom');
			Ext.each(this.elements, function(item){
				item.createDom();
			}, this);
			
		//If the slide has already been generated
		}
		else {
			//Shows the slide
			this.el.setDisplayed(true);
		}
		
	//NetShows.mainPanel.getActiveTab().getComponent('slide-view').fireEvent('resize');
	}
	
	this.addElement = function(params){
		var element = new Element(params,this.slideId);
		this.elements.push(element);
		element.createDom();
		return element;
	}
	
	this.removeElement = function(resizable, element){
		//Remove the element from the elements table
		var index = this.elements.indexOf(element);
		this.elements.splice(index);
		
		//Destroy the element
		element.destroy();
		
		//Delete the element
		//resizable.getEl().remove();
		
		//Destroy the resizable element
		resizable.destroy();
		resizable = null;
		element = null;
	}
	
	this.getPreview = function(){
		var globalHtml = '';
		Ext.each(this.elements, function(item){
			globalHtml += item.getPreview();
		}, this);
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
		//Hide the slide
		this.el.setDisplayed(false);
	}
	
	//Send the JSON string of the actual slide
	this.save = function(callback,scope){
		//For each element, we get the object used to the JSON
		var elementJSON = [];
		Ext.each(this.elements, function(item){
			elementJSON.push(item.getJSON());
		}, this);
		
		this.json = Ext.util.JSON.encode({
			c: '',//Commentaires
			a: this.animations,
			t: this.transitions,
			e: elementJSON
		});
		
		msg_log(this.json);

		Ext.Ajax.request({
			url: '/slide/save',
			params: {
				authenticity_token: NetShows.key,
				id: this.id,
				content: this.json
			},
			callback: callback,
			scope: scope
		});
	};
}
