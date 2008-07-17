 /**
 * @author Clément GONNET
 * Panel which contain the data view of slides
*/
NetShows.SlideBrowser = function(){
	this.actionNew = new Ext.Action({
		text: (this.newSlideText) ? this.newSlideText : "New Slide",
		iconCls: 'icon-new-slide',
		handler: function(){
			Ext.Ajax.request({
				url: '/slide/create',
				params: {
					authenticity_token: NetShows.key,
					id: this.presentation.id
				},
				success: function(response){
					//Create the new record
					var myRecord = new Ext.data.Record({
						'id': 'slide-' + response.responseText,
						'comment': ''
					});
					
					//Get the selected node to insert the record just after
					var node = this.slideDataView.getSelectedNodes()[0];
					//var index = 0;
					if (node) {
						index = this.presentation.store.indexOf(this.slideDataView.getRecord(node)) + 1;
						this.presentation.store.insert(index, myRecord);
						
						//Update slides array
						var mySlide = new Slide(myRecord.data, this.presentation.id);
						this.presentation.slides.splice(index, 0, mySlide);
						//msg_log(this.presentation.slides);
					}
					else {
						this.presentation.store.add(myRecord);
						//Update slides array
						this.presentation.slides.push(new Slide(myRecord.data));
						//msg_log(this.presentation.slides);
						index = this.presentation.store.getCount() - 1;
					}
					this.slideDataView.refresh();
					
					//Save the actual state of the slides and its order
					this.presentation.saveState();
					
					//Select and highlight the new slide
					var myNode = this.slideDataView.getNode(index);
					this.slideDataView.select(myNode);
					
					this.selectSlide(myNode);
					Ext.fly(myNode).highlight();
				},
				scope: this
			});
		},
		scope: this
	});
	this.actionNew.hide();
	
	this.actionRemove = new Ext.Action({
		id: 'remove',
		iconCls: 'icon-delete-slide',
		text: (this.removeText) ? this.removeText : 'Remove',
		handler: function(){
			var node = this.slideDataView.getSelectedNodes()[0];
			if (node) {
				this.tmpRecord = this.slideDataView.getRecord(node);
				
				//Get the index of the record before deleting
				var index = this.presentation.store.indexOf(this.tmpRecord);
				
				//Make an effect to disappear the slide
				Ext.fly(node).switchOff({
					duration: .2,
					callback: function(){
						//Remove the record
						this.presentation.store.remove(this.tmpRecord);
						
						this.presentation.slides[index].destroy();
						this.presentation.slides.splice(index, 1);
						//msg_log(this.presentation.slides);
						
						if (this.presentation.store.getCount() == 0) {
							this.actionNew.execute();
						}
						else {
							//Select the previous slide or the next one
							index = (index == this.presentation.store.getCount()) ? index - 1 : index;
							var myNode = this.slideDataView.getNode(index);
							this.slideDataView.select(myNode);
							
							
							this.selectSlide(myNode);
							
							//Save the actual state of the slides and its order
							this.presentation.saveState();
						}
					},
					scope: this
				});
			}
		},
		scope: this
	});
	this.actionRemove.hide();
	
	this.reader = new Ext.data.JsonReader({
		root: 'slides'
	});
	
	var tpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap" id="preview-{id}">', '<div class="thumb-mask">&nbsp;</div>', '<div class="wrap-under">{html}</div>', '</div>', '</tpl>', '<div class="x-clear"></div>');
	
	this.slideDataView = new Ext.DataView({
		id:'slide-data-view',
		//reader: this.reader,
		tpl: tpl,
		loadingText: this.loadingSlidesText || 'Loading slides...',
		singleSelect: true,
		overClass: 'x-view-over',
		itemSelector: 'div.thumb-wrap',
		listeners: {
			click: function(dataview, index, node, e){
				this.selectSlide(node);
			},
			scope: this
		}
	});
	
	NetShows.SlideBrowser.superclass.constructor.call(this, {
		id: 'slides-preview',
		border: false,
		items: this.slideDataView
	});
	this.hide();
};

Ext.extend(NetShows.SlideBrowser, Ext.Panel, {
	selectSlide:function(selectedNode){
		if (selectedNode) {
			var record = this.slideDataView.getRecord(selectedNode);
			//Change the slide in the tab view
			msg_log("select slide number : " + this.presentation.store.indexOf(record));
			//Event catched in NetShows.js
			this.fireEvent('selectslide', {
				number: this.presentation.store.indexOf(record)
			});
		}
	},
	refresh:function(){
		//Keep selected index before refreshing
		var selected = this.slideDataView.getSelectedIndexes();
		
		//Refresh selected slide in the DataView
		if(selected.length>0)
			this.slideDataView.refreshNode(selected[0]);
	
		//Set previous selected slide
		this.slideDataView.select(selected);
		
		this.doLayout();
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
		if (this.presentation.selectedSlides === undefined) {
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