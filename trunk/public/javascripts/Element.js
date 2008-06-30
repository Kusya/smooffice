/**
 * @author Clément GONNET
 * 
 * Element which compose a slide
 * 
 * TODO:
 * 	- Put a header to videos and maps to perform resize and move
 *  + Make the resize event not from this.data.measures but from the reel state measures
 *  + When a new image is created, calculate its real dimensions top set them to the container div
 *  + Review the destroy function
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
		
		this.getPreview = function(){
			var html = '<div style="position: absolute;width:' + this.data.p.width + ';height:' + this.data.p.height + ';top:' + this.data.p.top + ';left:' + this.data.p.left + ';">';
			html += this.getHTML();
			html += '</div>';
			return html;
		}
		
		this.getHTML = function(){
			var html = '';
			this.data.className = this.data.t;
			switch (this.data.t) {
				case 'img':
					html = '<img src="' + this.data.c + '" alt="" title="" width="100%" height="auto" />';
					break;
				case 'video':
					var e = this.data.c.substring(this.data.c.length - 3, this.data.c.length);
					if (e == 'swf' || e == 'flv') {
						html = '<object width="100%" height="100%" style="z-index:1;position:absolute">';
						html += '<param name="movie" value="' + this.data.c + '&hl=en"></param>';
						html += '<param name="wmode" value="transparent"></param>';
						html += '<embed width="100%" height="100%" src="' + this.data.c + '&hl=en" type="application/x-shockwave-flash" wmode="transparent"></embed>';
						html += '</object>';
					}
					else 
						if (e == 'wmv' || e == 'wma' || e == 'asx' || e == 'asf') {
							html += '<embed style="z-index:1;position:absolute" width="100%" height="100%" src="' + this.data.c + '" autostart="0" showcontrols="1" type="application/x-mplayer2" pluginspage="http://www.microsoft.com/windows/windowsmedia/download/"></embed>';
							
						}
						else 
							if (e == 'mov' || e == 'mp4') {
								html += '<embed style="z-index:1;position:absolute" width="100%" height="100%" src="' + this.data.c + '" autoplay="false" controller="true" type="video/quicktime" scale="tofit" pluginspage="http://www.apple.com/quicktime/download/"></embed>';
								
							}
							else 
								if (e == '.rm') {
									html += '<embed type="audio/x-pn-realaudio-plugin" style="z-index:1;position:absolute" width="100%" height="100%" src="' + this.data.c + '" autostart="false" controls="imagewindow" nojava="true" console="c1212599607702" pluginspage="http://www.real.com/"></embed>';
									html += '<br><embed type="audio/x-pn-realaudio-plugin"  style="z-index:1;position:absolute" width="100%" height="26" src="' + this.data.c + '" autostart="false" nojava="true" controls="ControlPanel" console="c1212599607702"></embed>';
								}
								else {
									html = '<object width="100%" height="100%" style="z-index:1;position:absolute">';
									html += '<param name="movie" value="' + this.data.c + '&hl=en"></param>';
									html += '<param name="wmode" value="transparent"></param>';
									html += '<embed width="100%" height="100%" src="' + this.data.c + '&hl=en" type="application/x-shockwave-flash" wmode="transparent"></embed>';
									html += '</object>';
								}
					
					html += '<div class="move-corner">&nbsp;</div>';
					break;
					
				case 'map':
					html = '<div class="move-corner">&nbsp;</div>';
					html += '<img src="/images/map.gif" alt="" title="" style="width:100%;height:auto;position:absolute;" />';
					break;
					
				default:
					html = '<' + this.data.t + '>' + this.data.c + '</' + this.data.t + '>';
					this.data.className = 'text';
			}
			return html;
		}
		
		this.createDom = function(){
			//msg_log("element.createDom : " + this.data.t);
			
			//Append the new node to the slide-wrap
			this.el = Ext.get(slideId).createChild({
				id: this.id,
				style:'position: absolute;',
				html: this.getHTML()
			});
			
			this.el.applyStyles(Ext.util.JSON.encode(this.data.p));
			
			this.el.addClass(this.data.className);
			
			if (this.data.t == 'map') {
				this.data.c = !this.data.c?{}:this.data.c;
				this.map = new GoogleMap(this.el.dom, this.data.c);
				this.el.on('load', this.resizeEvent, this);
			}
			this.el.on('click', this.onClick, this);
			
			this.resizeEvent();
		}
		this.destroy = function(){
			this.el.remove();
			this.map = null;//A revoir pour détruire la map
		}
		this.resizeEvent = function(){
			//msg_log('resize ' + this.data.t)
			if(this.data.p.width && this.data.p.height){
				this.el.applyStyles('width:' + this.getPixelFromPercent(this.data.p.width,Ext.get(this.slideId).getWidth()) + 'px;');
				this.el.applyStyles('height:' + this.getPixelFromPercent(this.data.p.height,Ext.get(this.slideId).getHeight()) + 'px;');
			}else{
				this.el.applyStyles('width:80%;');
				var heightValue = (this.data.t == 'video')?'80%':'auto'
				this.el.applyStyles('height:' + heightValue +';');
				this.el.first().addListener('load', function(){
					msg_log('computed height ' + this.el.first().getComputedHeight());
					this.el.applyStyles('width:'+this.el.first().getComputedWidth()+'px;');
					this.el.applyStyles('height:'+this.el.first().getComputedHeight()+'px;');
				},this);
			}
			
			this.el.applyStyles('top:' + this.getPixelFromPercent(this.data.p.top,Ext.get(this.slideId).getHeight()) + 'px;');
			this.el.applyStyles('left:' + this.getPixelFromPercent(this.data.p.left,Ext.get(this.slideId).getWidth()) + 'px;');
		}
		
		this.getJSON = function(){
			this.getProperties();
			return {
				t: this.data.t,
				c: this.data.c,
				p: this.data.p
			};
		}
		
		this.getProperties = function(){
			//Get the left value
			var diffX = this.el.getX() - Ext.get(this.slideId).getX();
			this.data.p.left = this.getPercentOf(diffX, Ext.get(this.slideId).getComputedWidth());
			
			//Get the top value
			var diffY = this.el.getY() - Ext.get(this.slideId).getY();
			this.data.p.top = this.getPercentOf(diffY, Ext.get(this.slideId).getComputedHeight());
			
			//Get the height value
			this.data.p.height = this.getPercentOf(this.el.getComputedHeight(), Ext.get(this.slideId).getComputedHeight());
			
			//Get the width value
			this.data.p.width = this.getPercentOf(this.el.getComputedWidth(), Ext.get(this.slideId).getComputedWidth());
			
			if(this.data.t == 'map'){
				this.data.c = this.map.getContent();
			}else if(this.data.className == 'text'){
				this.data.p.fontSize = '100%';
			}
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
