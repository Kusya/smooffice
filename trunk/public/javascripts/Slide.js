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
	this.properties = this.data.p || {};
	this.data.e = data.e || [];
	this.elements = [];
	
	//Flag for modification to save
	this.modified = false;
	
	//Index of the slide
	this.index = index;
	
	//Whether the slide is visible (used for saving action)
	this.isVisible = false;
	
	this.transition = data.t || [{
		f: null
	},{
		f: null
	}];
	this.animations = data.a || [];
	
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
		//The slide is modified
		this.fireEvent('modified');
		
		if (params.effect !== undefined) {
			this.transition = [{
				f: null
			}, {
				f: params.effect
			}];
		}
		if (params.direction != undefined) {
			this.transition[1].direction = parseInt(params.direction);
		}
		if (params.duration != undefined) {
			this.transition[1].duration = parseInt(params.duration);
		}
		if (params.o != undefined) {
			this.transition[1].o = params.o;
		}
		if (params.horizFirst != undefined) {
			this.transition[1].horizFirst = params.horizFirst;
		}
		NetShows.browserPanel.slideBrowser.setAnimationTransition(this.index);
		msg_log(this.transition);
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
	
	this.getThumbnail = function(){
		var globalHtml = '<div class="thumbnail-wrap" style="' + this.cssStyle + '">';
		
		Ext.each(this.elements, function(item){
			globalHtml += item.getPreview();
		}, this);
		globalHtml += '</div>'
		return globalHtml;
	}
	
	this.getInnerText = function(node, ignorewhitespace){
		var text = "";
		// if the node has children, loop through them
		if (node.hasChildNodes()) {
			var children = node.childNodes;
			for (var i = 0; i < children.length; i++) {
				// if node is a text node append it
				if (children[i].nodeName == "#text") {
					if (ignorewhitespace) {
						if (!/^\s+$/.test(children[i].nodeValue)) {
							text = text.concat(children[i].nodeValue);
						}
					}
					else {
						text = text.concat(children[i].nodeValue);
					}
				}
				// if node is a line break append \n
				else 
					if (children[i].nodeName == "BR") {
						text = text.concat("\n");
					}
					// otherwise call this function again to get the text
					else {
						text = text.concat(this.getInnerText(children[i]));
					}
			}
		}
		// it has no children, so get the text
		else {
			// if node is a text node append it
			if (node.nodeName == "#text") {
				text = text.concat(node.nodeValue);
			}
			// if node is a line break append \n
			else 
				if (node.nodeName == "BR") {
					text = text.concat("\n");
				}
		}
		return text;
	}
	
	this.getTitle = function(){
		var myTitle = false;
		//Loof for an element with type 'title'
		Ext.each(this.elements, function(elem){
			if (elem.data.t == 'title') {
				myTitle = elem;
				return true;
			}
		}, this);
		
		/*If not found, take the first text element
		if (myTitle === false) {
			Ext.each(this.elements, function(elem){
				if (elem.data.className == 'text') {
					myTitle = elem;
					return true;
				}
			}, this);
		}*/
		
		//If we finally get the title
		if (myTitle !== false) {
			var tmpElement = Ext.get('tmp').createChild({
				html: myTitle.data.c
			});
			var text = this.getInnerText(tmpElement.dom);
			tmpElement.remove();
		}
		else {
			var text = '';
		}
		return text;
	}
	
	this.getText = function(){
		var myText = false;
		//Loof for an element with type 'text'
		Ext.each(this.elements, function(elem){
			if (elem.data.t == 'text') {
				myText = elem;
				return true;
			}
		}, this);
		
		/*If not found, take the second text element
		if (myText === false) {
			var n = 0;
			Ext.each(this.elements, function(elem){
				if (elem.data.className == 'text') {
					n++;
					if (n == 2) {
						myText = elem;
						return true;
					}
				}
			}, this);
		}*/
		
		//If we finally get a text element
		if (myText !== false) {
			var tmpElement = Ext.get('tmp').createChild({
				html: myText.data.c
			});
			var text = this.getInnerText(tmpElement.dom);
			tmpElement.remove();
		}
		else {
			var text = '';
		}
		return text;
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
	
	/*
	 * create JSON object of the slide
	 * @return JSON string
	 */
	this.getJSON = function(){
		
			//Get properties if the slide is actually edited
			if(this.isVisible)
				this.getProperties();

			//For each element, we get the object used to the JSON
			var elementJSON = [];
			
			Ext.each(this.elements, function(item){
				elementJSON.push(item.getJSON());
			}, this);
			
			var json = {
				c: '',//Commentaires
				a: this.animations,
				t: this.transition,
				e: elementJSON,
				p: this.properties
			};
			
			msg_log(json);
			return json;
	}
	
	//Send the JSON string of the actual slide
	this.save = function(callbackFn){
		if (this.modified) {
			//Advise the presentation that one slide has to be saved
			this.presentation.nbToSave++;
			
			Ext.Ajax.request({
				url: '/slide/save',
				params: {
					authenticity_token: NetShows.key,
					id: this.id,
					content: Ext.util.JSON.encode(this.getJSON())
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
