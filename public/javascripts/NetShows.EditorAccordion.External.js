 /**
 * @author Clément GONNET
 * Plugin for the Editor Accordion to load elements from an external site
 */
 
 
NetShows.EditorAccordion.External = function(config){
	//If we have to deal with video, image, sound
	Ext.apply(this,config);
	this.searchField = new Ext.form.SearchField({
		width: 173
	});
	
	this.store = new Ext.data.JsonStore({
		url: this.url,
		fields: this.fields,
		root: this.root,
		totalProperty: 'totalCount',
		listeners: {
			'beforeload': function(){
				this.dataView.enable();
			},
			'loadexception': function(){
				msg_log('Error while loading from server');
				this.dataView.override({loadingText: (this.errorText)?this.errorText:'Error while loading from the server. Your request is not valid. Please try something else.'});
				this.dataView.fireEvent('show');
				this.dataView.disable();
			},
			scope: this
		},
		baseParams: {
			limit: this.limit,
			tags: this.searchField.getValue(),
			authenticity_token: NetShows.key
		}
	});
	
	this.searchField.override({
		store: this.store
	});

    this.dataView = new Ext.DataView({
		tpl: this.tpl,
		store: this.store,
		deferEmptyText: true,
		border: true,
		loadingText: this.loadingText,
		singleSelect: true,
		overClass:'x-view-over',
		itemSelector:'div.thumb-wrap',
		emptyText:  this.noElements,
		listeners: {
			render: this.initializeDragZone,
			scope: this
		}
	});

    NetShows.EditorAccordion.External.superclass.constructor.call(this, {
		id: this.id,
		iconCls: this.iconCls,
		autoScroll: true,
		title: this.title,
		border: false,
		tbar: [this.searchField],
		bbar: new Ext.PagingToolbar({
			store: this.store,
            pageSize: this.limit
        }),
        items: this.dataView
	});
}
Ext.extend(NetShows.EditorAccordion.External, Ext.Panel, {
	load: function(){
		if (!this.store.getCount()) {
			this.store.reload({
				params: {
					start: 0,
					tags: 'flower',
					limit: this.limit
				}
			});
		}
	},
	
	
	/*
	 * Here is where we "activate" the DataView.
	 * We have decided that each node with the class "patient-source" encapsulates a single draggable
	 * object.
	 *
	 * So we inject code into the DragZone which, when passed a mousedown event, interrogates
	 * the event to see if it was within an element with the class "patient-source". If so, we
	 * return non-null drag data.
	 *
	 * Returning non-null drag data indicates that the mousedown event has begun a dragging process.
	 * The data must contain a property called "ddel" which is a DOM element which provides an image
	 * of the data being dragged. The actual node clicked on is not dragged, a proxy element is dragged.
	 * We can insert any other data into the data object, and this will be used by a cooperating DropZone
	 * to perform the drop operation.
	 */
	initializeDragZone: function(dataView){
		dataView.dragZone = new Ext.dd.DragZone(dataView.getEl(), {
			ddGroup: 'slide',
		
			//      On receipt of a mousedown event, see if it is within a draggable element.
			//      Return a drag data object if so. The data object can contain arbitrary application
			//      data, but it should also contain a DOM element in the ddel property to provide
			//      a proxy to drag.
			getDragData: function(e){
				var sourceEl = e.getTarget(dataView.itemSelector, 10);
				if (sourceEl) {
					var d = sourceEl.cloneNode(true);
					return dataView.dragData = {
						repairXY: Ext.fly(sourceEl).getXY(),
						ddel: d,
						elementData: {
							url: dataView.getRecord(sourceEl).data.url,
							type: dataView.ownerCt.type,
							thumbnail: dataView.getRecord(sourceEl).data.thumbnail
						}
					}
				}
			},
			
			//      Provide coordinates for the proxy to slide back to on failed drag.
			//      This is the original XY coordinates of the draggable element.
			getRepairXY: function(){
				return this.dragData.repairXY;
			}
		});
	}
	
});