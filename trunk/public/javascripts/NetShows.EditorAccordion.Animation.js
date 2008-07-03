NetShows.EditorAccordion.Animation = function(){

    var directionsStore = new Ext.data.SimpleStore({
        fields: ['code', 'name'],
        data: [['left', 'From left'], ['right', 'From right'], ['up', 'From top'], ['down', 'From bottom'], ['', 'From center']]
    });
	//Define the Grid data and create the Grid
    var myData = [[1, 'Slide 1', 'in', 'null', 1000, 200, 'click', 'top'], [2, 'This is the title of our presentation', 'out', 'dropOut', 1000, 100, 100, ''], [3, 'Image 1', 'in', 'slideIn', 400, 0, 200, 'right']];
    
    var ds = new Ext.data.Store({
        reader: new Ext.data.ArrayReader({}, [{
            name: 'index'
        }, {
            name: 'element'
        }, {
            name: 'type'
        }, {
            name: 'effect'
        }, {
            name: 'duration',
            type: 'float'
        }, {
            name: 'delay',
            type: 'float'
        }, {
            name: 'trigger'
        }])
    });
    ds.loadData(myData);
    
    // the DefaultColumnModel expects this blob to define columns. It can be extended to provide
    // custom or reusable ColumnModels
    var colModel = new Ext.grid.ColumnModel([{
        id: 'index',
        header: "N°",
        sortable: false,
        locked: true,
        dataIndex: 'index',
        resizable: false,
        width: 30,
        fixed: true,
        hideable: false,
        menuDisabled: true
    }, {
        header: "Element",
        sortable: false,
        dataIndex: 'element',
        hideable: false,
        menuDisabled: true,
        resizable: true
    }, {
        header: "Type",
        sortable: false,
        dataIndex: 'type',
        hideable: false,
        menuDisabled: true,
        resizable: true,
        width: 40
    }]);
	
	 this.optionsAnimationsWindow = new Ext.Window({
	 	id: 'options-window',
	 	title: (this.optionWindowTitle) ? this.optionWindowTitle : 'Animation order',
	 	iconCls: 'icon-preview',
	 	width: 200,
	 	height: 350,
	 	resizable: false,
	 	plain: true,
	 	autoScroll: false,
	 	closeAction: 'hide',
	 	bodyBorder: false,
	 	border: false,
	 	shadow: false,
	 	listeners: {
	 		beforehide: function(){
	 			this.getBottomToolbar().items.first().toggle(false);
	 			return false
	 		},
	 		scope: this
	 	},
	 	items: [new Ext.FormPanel({
	 		bodyBorder: false,
	 		items: [{
	 			xtype: 'grid',
	 			height: 215,
	 			viewConfig: {
	 				forceFit: true
	 			},
	 			border: false,
	 			ds: ds,
	 			cm: colModel,
	 			sm: new Ext.grid.RowSelectionModel({
	 				singleSelect: true,
	 				listeners: {
	 					rowselect: function(sm, row, rec){
	 						msg_log(Ext.getCmp("options-window-form"));
	 						//Ext.getCmp("options-window-form").getForm().loadRecord(rec);
							}
						}
					}),
					//autoExpandColumn: 'element',
					listeners: {
						render: function(g){
							g.getSelectionModel().selectRow(0);
						},
						delay: 10 // Allow rows to be rendered before select the first
					}
				}, {
					id: 'options-window-form',
					layout: 'form',
					labelAlign: 'top',
					defaultType: 'textfield',
					defaults: {
						labelSeparator: ''
					},
					border: false,
					height: 98,
					bodyStyle: 'margin-top:5px;margin-left:5px;background:transparent',
					
					items: [{
						xtype: 'combo',
						name: 'trigger',
						displayField: 'trigger',
						width: 140,
						listWidth: 140,
						store: new Ext.data.SimpleStore({
							fields: ['trigger'],
							data: [['On mouse clic'], ['After last animation'], ['With last animation']]
						}),
						fieldLabel: (this.triggerText) ? this.triggerText : 'Trigger',
						forceSelection: true,
						typeAhead: true,
						mode: 'local',
						editable: false,
						shadow: 'drop',
						triggerAction: 'all',
						emptyText: (this.triggerEmptyText) ? this.triggerEmptyText : 'Select a trigger...',
						selectOnFocus: true
					}, new Ext.ux.form.Spinner({
						fieldLabel: 'Delay (ms)',
						value: 0,
						width: 50,
						style: 'text-align:right',
						name: 'delay',
						strategy: new Ext.ux.form.Spinner.NumberStrategy({
							minValue: 0,
							maxValue: 60,
							incrementValue: .5,
							alternateIncrementValue: 10
						})
					})]
				}]
			})]
		});
	NetShows.EditorAccordion.Animation.superclass.constructor.call(this, {
		title: 'Animation',
		id: 'animation-form',
		iconCls: 'animation-icon',
		border: false,
		autoScroll: true,
		bbar: new Ext.StatusBar({
			items: [{
				id: 'more-options-btn',
				text: 'More options',
				enableToggle: true,
				toggleHandler: function(b, state){
					if (state) {
						this.optionsAnimationsWindow.show();
						this.optionsAnimationsWindow.getEl().alignTo(this.getEl(), 'tl', [-200, 0]);
						Ext.fly(this.optionsAnimationsWindow.getEl()).slideIn('r', {
							easing: 'easeOut',
							scope: this
						});
					}
					else {
						Ext.fly(this.optionsAnimationsWindow.getEl()).slideOut('r', {
							easing: 'easeOut',
							scope: this
						});
					}
				},
				scope: this
			}]
		}),
		listeners: {
			beforecollapse: function(){
				if (this.optionsAnimationsWindow.rendered) {
					this.getBottomToolbar().items.first().toggle(false)
				}
			},
			scope: this
		},
		items: [{
			html: '<div style="margin:5%;width:90%;height:120px;background-color:black;">&nbsp;</div>',
			border: false
		}, {
			xtype: 'tabpanel',
			border: false,
			activeTab: 0,
            plain:true,
			defaults: {
				bodyStyle: 'padding:10px'
			},
			items: [{
				title: 'In',
				layout: 'form',
				autoHeight: true,
				labelAlign: 'top',
				defaults: {
					labelSeparator: ''
				},
				defaultType: 'textfield',
				items: [{
					xtype: 'combo',
					name: 'effect',
					displayField: 'effect',
					width: 140,
					listWidth: 140,
					store: new Ext.data.SimpleStore({
						fields: ['code', 'effect'],
						data: [['null', 'None'], ['bind', 'Bind in'], ['drop', 'Drop in'], ['slideIn', 'Slide in']]
					}),
					fieldLabel: (this.effectText) ? this.effectText : 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.effectEmptyText) ? this.effectEmptyText : 'Select an effect...',
					selectOnFocus: true
				}, {
					xtype: 'combo',
					name: 'direction',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: directionsStore,
					fieldLabel: (this.directionText) ? this.directionText : 'Direction',
					forceSelection: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
					selectOnFocus: true
				}, new Ext.ux.form.Spinner({
						fieldLabel: 'Duration (s)',
						value: 0,
						width: 50,
						style: 'text-align:right',
						name: 'duration',
						strategy: new Ext.ux.form.Spinner.NumberStrategy({
							minValue: 0,
							maxValue: 60,
							incrementValue: .5,
							alternateIncrementValue: 10
						})
					})]
			}, {
				title: 'Out',
				layout: 'form',
				autoHeight: true,
				labelAlign: 'top',
				defaultType: 'textfield',
				defaults: {
					labelSeparator: ''
				},
				items: [{
					xtype: 'combo',
					name: 'effect',
					displayField: 'effect',
					width: 140,
					listWidth: 140,
					store: new Ext.data.SimpleStore({
						fields: ['code', 'effect'],
						data: [['null', 'None'], ['bind', 'Bind out'], ['drop', 'Drop out'], ['slideOut', 'Slide out']]
					}),
					fieldLabel: (this.effectText) ? this.effectText : 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.effectEmptyText) ? this.effectEmptyText : 'Select an effect...',
					selectOnFocus: true
				}, {
					xtype: 'combo',
					name: 'direction',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: directionsStore,
					fieldLabel: (this.directionText) ? this.directionText : 'Direction',
					forceSelection: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
					selectOnFocus: true
				}, new Ext.ux.form.Spinner({
						fieldLabel: 'Duration (s)',
						value: 0,
						width: 50,
						style: 'text-align:right',
						name: 'duration',
						strategy: new Ext.ux.form.Spinner.NumberStrategy({
							minValue: 0,
							maxValue: 60,
							incrementValue: .5,
							alternateIncrementValue: 10
						})
					})]
			}, {
				title: 'Operation',
				layout: 'form',
				autoHeight: true,
				labelAlign: 'top',
				defaultType: 'textfield',
				defaults: {
					labelSeparator: ''
				},
				
				items: [{
					xtype: 'combo',
					name: 'effect',
					displayField: 'effect',
					width: 140,
					listWidth: 140,
					store: new Ext.data.SimpleStore({
						fields: ['code', 'effect'],
						data: [['null', 'None'], ['move', 'Move'], ['opacity', 'Opacity'], ['scale', 'Scale']]
					}),
					fieldLabel: (this.effectText) ? this.effectText : 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.effectEmptyText) ? this.effectEmptyText : 'Select an effect...',
					selectOnFocus: true
				}, {
					xtype: 'combo',
					name: 'direction',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: directionsStore,
					fieldLabel: (this.directionText) ? this.directionText : 'Direction',
					forceSelection: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
					selectOnFocus: true
				}, new Ext.ux.form.Spinner({
						fieldLabel: 'Duration (s)',
						value: 0,
						width: 50,
						style: 'text-align:right',
						name: 'duration',
						strategy: new Ext.ux.form.Spinner.NumberStrategy({
							minValue: 0,
							maxValue: 60,
							incrementValue: .5,
							alternateIncrementValue: 10
						})
					}), {
					xtype: 'button',
					text: 'Add action',
					handler: function(){
					
					},
					scope: this
				}]
			}]
		}]
	});
}
Ext.extend(NetShows.EditorAccordion.Animation, Ext.Panel, {
	
});