/**
 * @author Clément GONNET
 * 
 * Element which compose a slide
 */

 Element = function(data, slideId, index){
 	/*
	 * Properties
	 */
		this.data = data;
		this.id = Ext.id();
		this.slideId = slideId;
		this.index = "e" + index;
		
		//Generate CSS string
		this.cssStyle = '';
		
		/*
	 * Functions
	 */
		this.generateCSS = function(){
			for (var l in this.data.p) {
				this.cssStyle += l.replace(/[A-Z]/, function(match){
					return '-' + match.toLowerCase();
				}) +
				': ' +
				this.data.p[l] +
				';';
			}
		}
		
		this.getPreview = function(){
			this.generateCSS();
			var html = '<div style="' + this.cssStyle + 'position: absolute;">';
			html += this.getHTML();
			html += '</div>';
			return html;
		}
		
		this.getHTML = function(){
			var html = '';
			this.data.className = this.data.t;
			/*new Ext.ux.Media({mediaCfg:{
		 mediaType   : 'SWF'
		 ,url    : 'clock.swf'
		 ,id     :  'inlineClock'
		 ,style: {display:'inline', width:'100px',height:'80px'}
		 ,start    : true
		 ,loop     : true
		 ,controls :false
		 ,params: {
		 wmode     :'opaque'
		 ,scale     :'exactfit'
		 ,salign    :'t'
		 }
		 }})*/
			switch (this.data.t) {
				case 'img':
					html += '<img src="' + this.data.c.src + '" alt="" title="" width="100%" height="auto" />';
					break;
				case 'video':
					var e = this.data.c.src.substring(this.data.c.src.length - 3, this.data.c.src.length);
					if (e == 'swf' || e == 'flv') {
						html += '<object width="100%" height="100%" style="z-index:1;position:absolute">';
						html += '<param name="movie" value="' + this.data.c.src + '"></param>';
						html += '<param name="wmode" value="transparent"></param>';
						html += '<embed width="100%" height="100%" src="' + this.data.c.src + '" type="application/x-shockwave-flash" wmode="transparent"></embed>';
						html += '</object>';
					}
					else 
						if (e == 'wmv' || e == 'wma' || e == 'asx' || e == 'asf') {
							html += '<embed style="z-index:1;position:absolute" width="100%" height="100%" src="' + this.data.c.src + '" autostart="0" showcontrols="1" type="application/x-mplayer2" pluginspage="http://www.microsoft.com/windows/windowsmedia/download/"></embed>';
							
						}
						else 
							if (e == 'mov' || e == 'mp4') {
								html += '<embed style="z-index:1;position:absolute" width="100%" height="100%" src="' + this.data.c.src + '" autoplay="false" controller="true" type="video/quicktime" scale="tofit" pluginspage="http://www.apple.com/quicktime/download/"></embed>';
								
							}
							else 
								if (e == '.rm') {
									html += '<embed type="audio/x-pn-realaudio-plugin" style="z-index:1;position:absolute" width="100%" height="100%" src="' + this.data.c.src + '" autostart="false" controls="imagewindow" nojava="true" console="c1212599607702" pluginspage="http://www.real.com/"></embed>';
									html += '<br><embed type="audio/x-pn-realaudio-plugin"  style="z-index:1;position:absolute" width="100%" height="26" src="' + this.data.c.src + '" autostart="false" nojava="true" controls="ControlPanel" console="c1212599607702"></embed>';
								}
								else {
									html = '<object width="100%" height="100%" style="z-index:1;position:absolute">';
									html += '<param name="movie" value="' + this.data.c.src + '"></param>';
									html += '<param name="wmode" value="transparent"></param>';
									html += '<embed width="100%" height="100%" src="' + this.data.c.src + '" type="application/x-shockwave-flash" wmode="transparent"></embed>';
									html += '</object>';
								}
					
					html += '<div class="move-corner">&nbsp;</div>';
					break;
					
				case 'map':
					html += '<img src="/images/map.gif" alt="" title="" style="width:100%;height:auto;position:absolute;" />';
					html += '<div class="move-corner">&nbsp;</div>';
					break;
					
				default:
					html += '<' + this.data.t + '>' + this.data.c + '</' + this.data.t + '>';
					this.data.className = 'text';
			}
			return html;
		}
		
		this.createDom = function(){
			//msg_log("element.createDom : " + this.data.t);
			
			//Append the new node to the slide-wrap
			this.el = Ext.get(slideId).createChild({
				id: this.id,
				style: 'position: absolute;',
				html: this.getHTML()
			});
			
			//Apply CSS style to the element
			this.generateCSS();
			this.el.applyStyles(this.cssStyle);
			
			//Add the proper class belonging the type of element
			this.el.addClass(this.data.className);
			
			
			if (this.data.t == 'map') {
				this.data.c = !this.data.c ? {} : this.data.c;
				this.map = new GoogleMap(this.el.dom, this.data.c);
				this.el.on('load', this.resizeEvent, this);
			}
			
			//Add listeners
			this.el.on('click', this.onClick, this);
			this.el.on('contextmenu', this.onContextMenu, this);
			
			//Set the right measurements and position
			this.resizeEvent();
		}
		this.destroy = function(){
			this.el.remove();
			this.map = null;//A revoir pour détruire la map
		}
		this.resizeEvent = function(){
			//msg_log('resize ' + this.data.t)
			if (this.data.p.width && this.data.p.height) {
				this.el.applyStyles('width:' + this.getPixelFromPercent(this.data.p.width, Ext.get(this.slideId).getWidth()) + 'px;');
				this.el.applyStyles('height:' + this.getPixelFromPercent(this.data.p.height, Ext.get(this.slideId).getHeight()) + 'px;');
			}
			else {
				this.el.applyStyles('width:80%;');
				var heightValue = (this.data.t == 'video') ? '80%' : 'auto'
				this.el.applyStyles('height:' + heightValue + ';');
				this.el.first().addListener('load', function(){
					msg_log('computed height ' + this.el.first().getComputedHeight());
					this.el.applyStyles('width:' + this.el.first().getComputedWidth() + 'px;');
					this.el.applyStyles('height:' + this.el.first().getComputedHeight() + 'px;');
				}, this);
			}
			
			this.el.applyStyles('top:' + this.getPixelFromPercent(this.data.p.top, Ext.get(this.slideId).getHeight()) + 'px;');
			this.el.applyStyles('left:' + this.getPixelFromPercent(this.data.p.left, Ext.get(this.slideId).getWidth()) + 'px;');
		}
		
		this.getJSON = function(){
			this.getProperties();
			return {
				t: this.data.t,
				c: this.data.c,
				p: this.data.p
			};
		}
		
		this.setIndex = function(zIndex){
			this.el.applyStyles('z-index:' + zIndex);
			this.data.p.zIndex = zIndex;
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
			
			if (this.data.t == 'map') {
				this.data.c = this.map.getContent();
			}
			else 
				if (this.data.className == 'text') {
					this.data.p.fontSize = '100%';
				}
		}
		
		this.getPixelFromPercent = function(percent, base){
			return (parseFloat(percent) * base) / 100;
		}
		
		this.getPercentOf = function(number, base){
			return Math.round((number * 100 / base) * 100) / 100 + '%';
		}
		
		this.remove = function(){
			this.el.remove();
		}
		
		this.onClick = function(e){
			if (this.data.className == 'text') {
				if (this.mode == null) {
					this.mode = 'focus';
					NetShows.mainPanel.getActiveSlideView().setFocusElement(this);
				}
				else 
					if (this.mode == 'focus' && !this.endDrag) {
						//Remove the resizable element
						NetShows.mainPanel.getActiveSlideView().removeResizable();
						this.mode = 'editor';
						this.el.addClass('text-editor');
						this.editor = new Ext.ux.HtmlEditorUsingGlobalToolbar({
							globalToolBar: NetShows.mainPanel.getTopToolbar(),
							value: this.el.dom.innerHTML
						});
						this.el.hide();
						this.el.dom.innerHTML = '';
						this.editor.render(this.el.dom);
						this.el.show();
					}
			}
			else {
				NetShows.mainPanel.getActiveSlideView().setFocusElement(this);
			}
			this.endDrag = false;
		}
		this.blur = function(){
			if (this.data.className == 'text') {
				if (this.mode == 'editor') {
					this.endDrag = false;
					this.el.removeClass('text-editor');
					this.el.dom.innerHTML = this.data.c = this.editor.getValue();
					this.editor.destroy();
				}
				this.mode = null;
			}
		}
		this.onContextMenu = function(e){
			NetShows.mainPanel.getActiveSlideView().setFocusElement(this);
			NetShows.mainPanel.getActiveSlideView().onContextMenu(e, this);
		}
	}
