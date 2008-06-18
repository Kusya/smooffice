/**
 * @author Clément GONNET
 * 
 * Element which compose a slide
 * 
 * TODO:
 * 	- Put a header to videos and maps to perform resize and move
 *  + Make the resize event not from this.data.measures but from the reel state measures
 *  + When a new image is created, calculate its real dimensions top set them to the container div
 *  - Review the destroy function
 */

 Element = function(data, slideId){
 	/*
	 * Properties
	 */
		this.data = data;
		this.id = Ext.id();
		this.slideId = slideId;
		
	/*
	 * Functions
	 */
		this.getHTML = function(){
			var html= '';
			switch (this.data.type) {
				case 'text':
					html = this.data.content;
					break;
				case 'image':
					html = '<img src="' + this.data.url + '" alt="" title="" width="100%" height="auto" />';
					break;
				case 'video':
					//html = '<div class="mask" style="width:100%;height:100%;background-color:#bbb;z-index:3;opacity:.1;filter:alpha(opacity=10);"></div>';
					html = '<div class="move-corner">&nbsp;</div>';
					html += '<object width="100%" height="100%" style="z-index:1;position:absolute">';
					html += '<param name="movie" value="' + this.data.url + '&hl=en"></param>';
					html += '<param name="wmode" value="transparent"></param>';
					html += '<embed width="100%" height="100%" src="' + this.data.url + '&hl=en" type="application/x-shockwave-flash" wmode="transparent"></embed>';
					html += '</object>';
					break;
				case 'map':
					html = '<div class="move-corner">&nbsp;</div>';
					html += '<img src="/images/map.gif" alt="" title="" style="width:100%;height:auto;position:absolute;" />';
					break;
			}
			return html;
		}
		
		this.getPreview = function(){
			var html = '<div style="position: absolute;width:' + this.data.width + ';height:' + this.data.height + ';top:' + this.data.top + ';left:' + this.data.left + ';">';
			html += this.getHTML();
			html += '</div>';
			return html;
		}
		
		this.createDom = function(){
			//msg_log("element.createDom : " + this.data.type);
			
			//Append the new node to the slide-wrap
			this.el = Ext.get(slideId).createChild({
				id: this.id,
				style:'position: absolute;',
				html: this.getHTML()
			});
			
			if (this.data.type == 'map'){
				this.map = new GoogleMap(this.el.dom,this.data.params);
			}
			
			this.el.addClass(this.data.type);
			
			this.el.on('click', this.onClick, this);
			
			this.resizeEvent(true);
		}
		this.destroy = function(){
			this.el.remove();
		}
		this.resizeEvent = function(firstTime){
			if (firstTime) {
				switch (this.data.type) {
					case 'video':
						this.data.width = '50%';
						this.data.height = '50%';
				}
			}
			
			if(this.data.width && this.data.height){
				this.el.applyStyles('width:' + this.getPixelFromPercent(this.data.width,Ext.get(this.slideId).getWidth()) + 'px;');
				this.el.applyStyles('height:' + this.getPixelFromPercent(this.data.height,Ext.get(this.slideId).getHeight()) + 'px;');
			}else{
				this.el.applyStyles('width:80%;');
				this.el.applyStyles('height:auto;');
				this.el.first().addListener('load', function(){
					//msg_log('computed height ' + this.el.first().getComputedHeight());
					this.el.applyStyles('width:'+this.el.first().getComputedWidth()+'px;');
					this.el.applyStyles('height:'+this.el.first().getComputedHeight()+'px;');
				},this);
				
				
			}
			
			this.el.applyStyles('top:' + this.getPixelFromPercent(this.data.top,Ext.get(this.slideId).getHeight()) + 'px;');
			this.el.applyStyles('left:' + this.getPixelFromPercent(this.data.left,Ext.get(this.slideId).getWidth()) + 'px;');
		}
		
		this.getJSON = function(){
			this.getMeasures();
			switch (this.data.type) {
				case 'text':
					return {
						type: this.data.type,
						content: this.data.content,
						top: this.data.top,
						left: this.data.left,
						height: this.data.height,
						width: this.data.width
					};
					break;
				case 'image':
					return {
						type: this.data.type,
						url: this.data.url,
						top: this.data.top,
						left: this.data.left,
						height: this.data.height,
						width: this.data.width
					};
					break;
				case 'video':
					return {
						type: this.data.type,
						url: this.data.url,
						top: this.data.top,
						left: this.data.left,
						height: this.data.height,
						width: this.data.width
					};
					break;
				case 'map':
					return {
						type: this.data.type,
						top: this.data.top,
						left: this.data.left,
						height: this.data.height,
						width: this.data.width,
						params: this.map.getContent()
					};
					break;
			}
			
		}
		
		this.getMeasures = function(){
			//Get the left value
			var diffX = this.el.getX() - Ext.get(this.slideId).getX();
			this.data.left = this.getPercentOf(diffX, Ext.get(this.slideId).getComputedWidth());
			
			//Get the top value
			var diffY = this.el.getY() - Ext.get(this.slideId).getY();
			this.data.top = this.getPercentOf(diffY, Ext.get(this.slideId).getComputedHeight());
			
			//Get the height value
			this.data.height = this.getPercentOf(this.el.getComputedHeight(), Ext.get(this.slideId).getComputedHeight());
			
			//Get the width value
			this.data.width = this.getPercentOf(this.el.getComputedWidth(), Ext.get(this.slideId).getComputedWidth());
		}
		
		this.getPixelFromPercent = function(percent, base){
			return (parseFloat(percent) * base)/100;
		}
		
		this.getPercentOf = function(number, base){
			return Math.round((number * 100 / base) * 100) / 100 + '%';
		}
		
		this.remove = function(){
			this.el.remove();
		}
		
		this.onClick = function(e){
			NetShows.mainPanel.getActiveSlideView().setFocusElement(this);
		}
	}
