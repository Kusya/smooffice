 /**
 * @author Clément GONNET
 * Panel which contain the data view of slides
*/
NetShows.SlideBrowser = function(){

	this.toggleTpl = function(m, pressed){
		if (!m) { // cycle if not a menu item click
			var tplMenu = Ext.menu.MenuMgr.get('tpl-menu');
			tplMenu.render();
			var items = tplMenu.items.items;
			var i = items[0], it = items[1], t = items[2];
			if (i.checked) {
				it.setChecked(true);
			}
			else 
				if (it.checked) {
					t.setChecked(true);
				}
				else 
					if (t.checked) {
						i.setChecked(true);
					}
			return;
		}
		if (pressed) {
			var btn = this.actionToggleTpl;
			switch (m.id) {
				case 'tpl-img':
					this.slideDataView.addClass('thumb-image');
					this.slideDataView.removeClass('thumb-imagentext');
					this.slideDataView.removeClass('thumb-text');
					btn.setIconClass('icon-tpl-i');
					break;
				case 'tpl-imgntext':
					this.slideDataView.removeClass('thumb-image');
					this.slideDataView.addClass('thumb-imagentext');
					this.slideDataView.removeClass('thumb-text');
					btn.setIconClass('icon-tpl-it');
					break;
				case 'tpl-text':
					this.slideDataView.removeClass('thumb-image');
					this.slideDataView.removeClass('thumb-imagentext');
					this.slideDataView.addClass('thumb-text');
					btn.setIconClass('icon-tpl-t');
					break;
			}
		}
	}
	
	this.actionToggleTpl = new Ext.SplitButton({
		split: true,
		//text: 'View',
		iconCls: 'icon-tpl-i',
		handler: this.toggleTpl.createDelegate(this, []),
		menu: {
			id: 'tpl-menu',
			width: 100,
			items: [{
				id: 'tpl-img',
				text: 'Image only',
				checked: true,
				group: 'tt-group',
				checkHandler: this.toggleTpl,
				scope: this,
				iconCls: 'icon-tpl-i'
			}, {
				id: 'tpl-imgntext',
				text: 'Image & Text',
				checked: false,
				group: 'tt-group',
				checkHandler: this.toggleTpl,
				scope: this,
				iconCls: 'icon-tpl-it'
			}, {
				id: 'tpl-text',
				text: 'Text only',
				checked: false,
				group: 'tt-group',
				checkHandler: this.toggleTpl,
				scope: this,
				iconCls: 'icon-tpl-t'
			}]
		}
	});
	
	this.actionNew = new Ext.Action({
		text: this.newSlideText || "New Slide",
		iconCls: 'icon-new-slide',
		handler: function(){
			NetShows.browserPanel.getTopToolbar().disable();
			Ext.Ajax.request({
				url: '/slide/create',
				params: {
					authenticity_token: NetShows.key,
					id: this.presentation.id
				},
				success: function(response){
					var savePrevious = true;
					var res = Ext.util.JSON.decode(response.responseText);
					//Create the new record
					var myRecord = new Ext.data.Record({
						'id': 'slide-' + res.id,
						'comment': ''
					});
					Ext.apply(myRecord.data, res.content);
					
					//Get the selected node to insert the record just after
					var node = this.slideDataView.getSelectedNodes()[0];
					//var index = 0;
					if (node) {
						index = this.presentation.store.indexOf(this.slideDataView.getRecord(node)) + 1;
						this.presentation.store.insert(index, myRecord);
						
						//Update slides array
						var mySlide = new Slide(myRecord.data, this.presentation, index);
						this.presentation.slides.splice(index, 0, mySlide);
						//msg_log(this.presentation.slides);
					}
					else {
						this.presentation.store.add(myRecord);
						//Update slides array
						this.presentation.slides.push(new Slide(myRecord.data, this.presentation, this.presentation.slides.length));
						//msg_log(this.presentation.slides);
						index = this.presentation.store.getCount() - 1;
						savePrevious = false;
					}
					
					//Set the modifications flag
					this.presentation.orderChanged = true;
					
					this.refresh();
					
					//Select and highlight the new slide
					var myNode = this.slideDataView.getNode(index);
					this.slideDataView.select(myNode);
					this.selectSlide(myNode, savePrevious);
					Ext.fly(myNode).highlight();
					
					NetShows.browserPanel.getTopToolbar().enable();
				},
				failure: function(){
					NetShows.browserPanel.getTopToolbar().enable();
				},
				scope: this
			});
		},
		scope: this
	});
	
	this.actionRemove = new Ext.Action({
		id: 'remove',
		iconCls: 'icon-delete-slide',
		text: (this.removeText) ? this.removeText : 'Remove',
		handler: function(){
			NetShows.browserPanel.getTopToolbar().disable();
			var node = this.slideDataView.getSelectedNodes()[0];
			if (node) {
				this.tmpRecord = this.slideDataView.getRecord(node);
				
				//Get the index of the record before deleting
				var index = this.presentation.store.indexOf(this.tmpRecord);
				
				//Efect to make disappear the slide
				Ext.fly(node).switchOff({
					duration: .2,
					callback: function(){
						//Remove the record
						this.presentation.store.remove(this.tmpRecord);
						
						this.presentation.slides[index].destroy();
						this.presentation.slides.splice(index, 1);
						
						if (this.presentation.store.getCount() == 0) {
							this.actionNew.execute();
						}
						else {
							this.refresh();
							//Select the previous slide or the next one
							index = (index == this.presentation.store.getCount()) ? index - 1 : index;
							var myNode = this.slideDataView.getNode(index);
							this.slideDataView.select(myNode);
							
							this.selectSlide(myNode, false);
							
							//Set the modifications flag
							this.presentation.orderChanged = true;
						}
						
						NetShows.browserPanel.getTopToolbar().enable();
					},
					scope: this
				});
			}
		},
		scope: this
	});
	
	this.reader = new Ext.data.JsonReader({
		root: 'slides'
	});
	
	
	var tpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap" id="preview-{id}" rnd="{rnd}">', '<div class="index">{index}</div>', '<div class="thumbnail">{thumbnail}</div>', '<div class="title">{title}</div>', '<div class="text">{text}</div>', '<div class="animation">&nbsp;</div>', '<div class="transition">&nbsp;</div>', '<div class="thumb-mask">&nbsp;</div>', '</div>', '</tpl>', '<div class="x-clear"></div>');
	
	this.slideDataView = new Ext.DataView({
		id: 'slide-data-view',
		tpl: tpl,
		cls: 'thumb-image',
		loadingText: this.loadingSlidesText || 'Loading slides...',
		singleSelect: true,
		overClass: 'x-view-over',
		itemSelector: 'div.thumb-wrap',
		listeners: {
			click: function(dataview, index, node, e){
				this.selectSlide(node, true);
			},
			'drop': this.sortDataView,
			scope: this
		},
		plugins: new net.drasill.plugins.SortableDataView()
	});
	
	NetShows.SlideBrowser.superclass.constructor.call(this, {
		id: 'slides-preview',
		border: false,
		items: this.slideDataView
	});
	this.hide();
	this.actionToggleTpl.hide();
	this.actionRemove.hide();
	this.actionNew.hide();
};

Ext.extend(NetShows.SlideBrowser, Ext.Panel, {
	sortDataView: function(oldIndex, newIndex, record){
		//Updating slides Array
		var removed = this.presentation.slides.splice(oldIndex, 1);
		this.presentation.slides.splice(newIndex, 0, removed[0]);
		
		this.refresh();
		
		this.presentation.orderChanged = true;
		this.slideDataView.select(newIndex);
		this.selectSlide(this.slideDataView.getNode(newIndex), true);
	},
	updateSlideIndexes: function(){
		Ext.each(this.presentation.slides, function(slide, index){
			slide.index = index
			this.presentation.updateSlideData(slide);
		}, this);
	},
	selectSlide: function(selectedNode, savePrevious){
		if (selectedNode) {
			var record = this.slideDataView.getRecord(selectedNode);
			//Change the slide in the tab view
			msg_log("select slide #" + this.presentation.store.indexOf(record));
			//Event catched in NetShows.js
			this.fireEvent('selectslide', {
				number: this.presentation.store.indexOf(record),
				savePrevious: savePrevious
			});
		}
	},
	refresh: function(){
		//Keep selected index before refreshing
		var selected = this.slideDataView.getSelectedIndexes();
		
		this.updateSlideIndexes();
		this.slideDataView.refresh();
		
		//Refresh selected slide in the DataView
		if (selected.length > 0) {
			this.slideDataView.refreshNode(selected[0]);
			
			//Set previous selected slide
			this.slideDataView.select(selected[0]);
			
			this.setAnimationTransition(selected[0]);
		}
	},
	setAnimationTransition: function(index){
		var slides;
		//Update all slide
		if (index === undefined || index.constructor != Number) {
			slides = this.presentation.slides;
		}
		//Update slides[index]
		else {
			var slides = this.presentation.slides[index];
		}
		
		Ext.each(slides, function(slide){
			if (slide.transition[0].f === "null" && slide.transition[1].f === "null") {
				Ext.get('preview-' + slide.id).removeClass('thumb-transition');
			}
			else {
				Ext.get('preview-' + slide.id).addClass('thumb-transition');
			}
			if (slide.animations.length == 0) {
				Ext.get('preview-' + slide.id).removeClass('thumb-animation');
			}
			else {
				Ext.get('preview-' + slide.id).addClass('thumb-animation');
			}
		}, this);
	},
	savePreviousState: function(){
		this.presentation.selectedSlides = this.slideDataView.getSelectedIndexes();
	},
	setPresentation: function(presentation){
		//Set the new presentation
		this.presentation = presentation;
		
		//Update the dataview
		this.slideDataView.setStore(this.presentation.store);
		this.refresh();
		
		//Select the first slide or the previous one
		if (!this.presentation.selectedSlides || this.presentation.selectedSlides.length == 0) {
			//Select the first slide
			var myNode = this.slideDataView.getNode(0);
		}
		else {
			this.slideDataView.select(this.presentation.selectedSlides);
			var myNode = this.slideDataView.getNode(this.presentation.selectedSlides[0]);
		}
		if (myNode) {
			this.slideDataView.select(myNode);
			var record = this.slideDataView.getRecord(myNode);
			//Change the slide in the tab view
			//msg_log("select slide number : " + this.presentation.store.indexOf(record));
			//Event catched in NetShows.js
			this.fireEvent('selectslide', {
				number: this.presentation.store.indexOf(record)
			});
		}
	}
	/*	resizeEvent : function(){
	 if (this.slideDataView.getNodes()[0]) {
	 if (this.slideDataView.getNodes().length >= 1) {
	 var margin = 10;
	 var width = 153 - margin;//this.getEl().getWidth(true) - margin;
	 var height = Math.round(width * 3.0 / 4.0);
	 Ext.each(this.slideDataView.getNodes(), function(item){
	 //msg_log(item);
	 //Ext.get(item).setWidth(width);
	 //Ext.get(item).setHeight(height);
	 }, this);
	 }
	 }
	 }*/
});