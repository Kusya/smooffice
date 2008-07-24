/**
 * @author Clément GONNET
 * 
 * TODO : Check link between slide view and selectrow : too much recursion
 */
NetShows.EditorAccordion.Animation = function(){
	/*var i = {
		type:"show/hide/animate",
		o:{
			delay:200,
			duration:200,
			effect:"fade"
		},
		trigger:'click/after/with'
	}*/

	this.effectsShow = [{
		code: 'null',
		name: this.effectNullText || 'None',
		direction: false,
		duration: false,
		horizFirst: false
	}, {
		code: 'show',
		name: this.effectShowText || 'Show',
		direction: false,
		duration: false,
		horizFirst: false
	}, {
		code: 'blind',
		name: this.effectBlindText || 'Blind',
		direction: [['vertical', 'Vertical'], ['horizontal', 'Horizontal']],
		duration: true,
		horizFirst: false
	}, {
		code: 'clip',
		name: this.effectClipText || 'Clip',
		direction: [['vertical', 'Vertical'], ['horizontal', 'Horizontal']],
		duration: true,
		horizFirst: false
	}, {
		code: 'drop',
		name: this.effectDropText || 'Drop',
		duration: true,
		direction: [['left', 'Left'], ['right', 'Right'], ['up', 'Up'], ['down', 'Down']],
		horizFirst: false
	}, {
		code: 'fade',
		name: this.effectFadeText || 'Fade',
		duration: true,
		direction: false,
		horizFirst: false
	}, {
		code: 'fold',
		name: this.effectFoldText || 'Fold',
		duration: true,
		direction: false,
		horizFirst: true
	}, {
		code: 'slide',
		name: this.effectSlideText || 'Slide',
		duration: true,
		direction: [['left', 'Left'], ['right', 'Right'], ['up', 'Up'], ['down', 'Down']],
		horizFirst: false
	}, {
		code: 'puff',
		name: this.effectPuffText || 'Puff',
		duration: true,
		direction: false,
		horizFirst: false
	}];
	
	this.effectsHide = [{
		code: 'null',
		name: this.effectNullText || 'None',
		direction: false,
		duration: false,
		horizFirst: false
	}, {
		code: 'hide',
		name: this.effectHideText || 'Hide',
		direction: false,
		duration: false,
		horizFirst: false
	}, {
		code: 'blind',
		name: this.effectBlindText || 'Blind',
		direction: [['vertical', 'Vertical'], ['horizontal', 'Horizontal']],
		duration: true,
		horizFirst: false
	}, {
		code: 'clip',
		name: this.effectClipText || 'Clip',
		direction: [['vertical', 'Vertical'], ['horizontal', 'Horizontal']],
		duration: true,
		horizFirst: false
	}, {
		code: 'drop',
		name: this.effectDropText || 'Drop',
		duration: true,
		direction: [['left', 'Left'], ['right', 'Right'], ['up', 'Up'], ['down', 'Down']],
		horizFirst: false
	}, {
		code: 'fade',
		name: this.effectFadeText || 'Fade',
		duration: true,
		direction: false,
		horizFirst: false
	}, {
		code: 'fold',
		name: this.effectFoldText || 'Fold',
		duration: true,
		direction: false,
		horizFirst: true
	}, {
		code: 'slide',
		name: this.effectSlideText || 'Slide',
		duration: true,
		direction: [['left', 'Left'], ['right', 'Right'], ['up', 'Up'], ['down', 'Down']],
		horizFirst: false
	}, {
		code: 'puff',
		name: this.effectPuffText || 'Puff',
		duration: true,
		direction: false,
		horizFirst: false
	}];
	
	this.effectsAnim = [{
		code: 'null',
		name: this.effectNullText || 'None',
		direction: false,
		duration: false
	}, {
		code: 'scale',
		name: this.effectScaleText || 'Scale',
		duration: true,
		direction: false
	} /* move and opacity */];
	
	this.directionsShowStore = new Ext.data.SimpleStore({
		fields: ['code', 'name'],
		data: this.effectsShow[3].direction
	});
	
	this.directionsHideStore = new Ext.data.SimpleStore({
		fields: ['code', 'name'],
		data: this.effectsHide[3].direction
	});
	
	this.triggers = [{
		code: 'click',
		name: this.triggerClickText || 'On mouse clic'
	}, {
		code: 'after',
		name: this.triggerAfterText || 'After last animation'
	}
//-------> à prévoir
	/*, {
		code: 'with',
		name: this.triggerWithText || 'With last animation'
	}*/];
//------->

	this.triggerStore = new Ext.data.JsonStore({
		fields: ['code', 'name'],
		data: this.triggers
	});
	
	this.ds = new Ext.data.JsonStore({
		fields: ['index', 'element', 'type', '$element', 'o', '$this', 'trigger']
	});
	
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
	
	this.firstTime = true;
	
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
		x: 6000,
		listeners: {
			beforehide: function(){
				this.getBottomToolbar().items.first().toggle(false);
				return false
			},
			show: function(){
				if (this.rendered && this.firstTime && this.focusElement) {
					//this.setFocusElement(NetShows.mainPanel.getActiveSlideView().focusElement);
					Ext.getCmp('animation-grid').selModel.selectRow(this.slide.getIndexAnimByElId(this.focusElement.id));
					this.firstTime = false;
				}
			},
			scope: this
		},
		items: [new Ext.FormPanel({
			bodyBorder: false,
			items: [{
				xtype: 'grid',
				id: 'animation-grid',
				height: 215,
				ddGroup: 'testGroup',
				viewConfig: {
					forceFit: true
				},
				enableDragDrop: true,
				enableHdMenu: false,
				listeners: {
					render: function(g){
						var ddrow = new Ext.ux.dd.GridReorderDropTarget(g, {
							copy: false,
							listeners: {
								beforerowmove: function(objThis, oldIndex, newIndex, records){
								},
								afterrowmove: function(objThis, oldIndex, newIndex, records){
									//Updating slide animations
									var removed = this.slide.animations.splice(oldIndex, 1);
									this.slide.animations.splice(newIndex, 0, removed[0]);
									
									//Updating animations
									var removed = this.animations.splice(oldIndex, 1);
									this.animations.splice(newIndex, 0, removed[0]);
									
									//Update animations index
									Ext.each(this.animations, function(a, i){
										a.index = i;
									}, this)
									
									g.getStore().loadData(this.animations);
								},
								scope: this
							}
						});
						
						// if you need scrolling, register the grid view's scroller with the scroll manager
						Ext.dd.ScrollManager.register(g.getView().getEditorParent());
					},
					beforedestroy: function(g){
						// if you previously registered with the scroll manager, unregister it (if you don't it will lead to problems in IE)
						Ext.dd.ScrollManager.unregister(g.getView().getEditorParent());
					},
					scope: this
				},
				border: false,
				ds: this.ds,
				cm: colModel,
				sm: new Ext.grid.RowSelectionModel({
					singleSelect: true,
					listeners: {
						rowselect: function(sm, rowIndex, rec){
								//rec.data = animation object
								
								Ext.getCmp('animation-tabpanel').enable();
								Ext.getCmp('animation-trigger').enable();
								
								//Only if the element is different, select it in the slide view
								if (rec.data.$element != this.focusElement) {
									this.focusElement = rec.data.$element;
									//Focus corresponding element in slideView
									NetShows.mainPanel.getActiveSlideView().setFocusElement(rec.data.$element);
								}
								
								//Select the effect only if the selected animation has changed
								if (this.focusAnimation != rec.data) {
									//Keep the focus on the current animation
									this.focusAnimation = rec.data;
									
									//Update panel
									Ext.getCmp('animation-' + rec.data.type + '-effect').fireEvent('select', Ext.getCmp('animation-' + rec.data.type + '-effect'), {
										data: {
											code: rec.data.$this.o.effect || "null"
										}
									}, rec.data);
									
									//Shows the panel
									Ext.getCmp('animation-tabpanel').activate(rec.data.type + '-panel');
									
									//Select the right trigger and its parameters
									Ext.getCmp('animation-trigger').fireEvent('select', Ext.getCmp('animation-trigger'), rec, true);
								}
						},
						scope: this
					}
				})
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
					id: 'animation-trigger',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: this.triggerStore,
					fieldLabel: this.triggerText || 'Trigger',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					listeners: {
						select: function(field, record, init){
							Ext.each(this.triggers, function(trigger){
								//Either the user selects || or the grid selects
								if ((trigger.code == record.data.code) || (record.data.$this && (trigger.code == record.data.$this.trigger))) {
									switch (trigger.code) {
										case 'click':
											Ext.getCmp('animation-delay').disable();
											
											if (init === true) {
												Ext.getCmp('animation-trigger').setValue(trigger.name);
											}
											else {
												this.focusAnimation.$this.trigger = 'click';
												this.focusAnimation.$this.o.delay = 0;
											}
											break;
										case 'after':
											Ext.getCmp('animation-delay').enable();
											if (init === true) {
												Ext.getCmp('animation-trigger').setValue(trigger.name);
											}
											else {
												this.focusAnimation.$this.trigger = 'after';
												this.focusAnimation.$this.o.delay = 0;
											}
											
											Ext.getCmp('animation-delay').setValue(this.focusAnimation.$this.o.delay);
											break;
										case 'with':
											Ext.getCmp('animation-delay').enable();
											if (init === true) {
												Ext.getCmp('animation-trigger').setValue(trigger.name);
											}
											else {
												this.focusAnimation.$this.trigger = 'with';
												this.focusAnimation.$this.o.delay = 0;
											}
											Ext.getCmp('animation-delay').setValue(this.focusAnimation.$this.o.delay);
											break;
									}
									
								}
							}, this);
							
						},
						scope: this
					},
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: this.triggerEmptyText || 'Select a trigger...',
					selectOnFocus: true
				}, new Ext.ux.form.Spinner({
					fieldLabel: 'Delay (ms)',
					id: 'animation-delay',
					value: 0,
					width: 50,
					style: 'text-align:right',
					name: 'delay',
					listeners: {
						spin: function(field){
							this.focusAnimation.$this.o.delay = field.getValue();
						},
						scope: this
					},
					strategy: new Ext.ux.form.Spinner.NumberStrategy({
						minValue: 0,
						maxValue: 60000,
						incrementValue: 10,
						alternateIncrementValue: 100
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
			id: 'animation-tabpanel',
			border: false,
			activeTab: 0,
			plain: true,
			listeners:{
				tabchange:this.onTabChange,
				scope:this
			},
			defaults: {
				bodyStyle: 'padding:10px'
			},
			items: [ 
			
			
			
			
			//Show effects panel
			{
				title: this.showTitle||'Show',
				id:'show-panel',
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
					id: 'animation-show-effect',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: new Ext.data.JsonStore({
						data: this.effectsShow,
						fields: ['code', 'name']
					}),
					fieldLabel: this.effectText || 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					listeners: {
						'select': function(field, record, initialEffect){
							var userSelect = (initialEffect.constructor == Number);
							
							//Parse all available effects to find the corresponding one
							Ext.each(this.effectsShow, function(item){
								//If it finds item.code, set the right settings
								if (record.data.code === item.code) {
									//If a duration is defined
									if (item.duration) {
										Ext.getCmp('animation-show-duration').enable();
										Ext.getCmp('animation-show-duration').setValue(!userSelect && initialEffect.$this.o && initialEffect.$this.o.duration || 400);
									}
									else {
										Ext.getCmp('animation-show-duration').disable();
									}
									
									//If directions are defined
									if (item.direction) {
										//Set the right value
										if (!userSelect && initialEffect.$this.o && initialEffect.$this.o.direction) {
											Ext.each(item.direction, function(directionItem){
												if (directionItem[0] == initialEffect.$this.o.direction) {
													Ext.getCmp('animation-show-direction').setValue(directionItem[1]);
												}
											}, this);
										}
										else {
											Ext.getCmp('animation-show-direction').setValue(item.direction[0][1]);
										}
										
										//Load the predefined directions from effect description
										this.directionsShowStore.loadData(item.direction);
										Ext.getCmp('animation-show-direction').enable();
										
									}
									else {
										Ext.getCmp('animation-show-direction').disable();
									}
									
									//If horizFirst is defined
									if (item.horizFirst) {
										Ext.getCmp('animation-show-horizfirst').show();
										Ext.getCmp('animation-show-horizfirst').setValue(!userSelect && initialEffect.$this.o && initialEffect.$this.o.horizFirst || false);
									}
									else {
										Ext.getCmp('animation-show-horizfirst').hide();
									}
									
									//If the user selects the effect, write it inside slide animation
									if (userSelect) {
										this.setAnimation(item.code,'show');
									}
									else {
										if (item.code == "null") {
											Ext.getCmp('animation-trigger').disable();
											Ext.getCmp('animation-delay').disable();
										}
										field.setValue(item.name);
									}
								}
							}, this);
						},
						scope: this
					},
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: this.effectEmptyText || 'Select an effect...',
					selectOnFocus: true
				}, {
					xtype: 'combo',
					name: 'direction',
					id: 'animation-show-direction',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: this.directionsShowStore,
					fieldLabel: this.directionText || 'Direction',
					forceSelection: true,
					mode: 'local',
					listeners: {
						select: function(field, record){
							this.focusAnimation.$this.o.direction = record.data.code;
						},
						scope: this
					},
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: this.directionEmptyText || 'Select a direction...',
					selectOnFocus: true
				}, {
					xtype: 'checkbox',
					id: 'animation-show-horizfirst',
					name: 'horizfirst',
					boxLabel: this.horizFirstText || 'Fold horizontally first',
					listeners: {
						check: function(field, checked){
							if(this.focusAnimation)
								this.focusAnimation.$this.o.horizFirst = checked;
						},
						scope: this
					}
				}, new Ext.ux.form.Spinner({
					fieldLabel: 'Duration (ms)',
					id: 'animation-show-duration',
					value: 0,
					width: 50,
					style: 'text-align:right',
					name: 'duration',
					listeners: {
						spin: function(field){
							this.focusAnimation.$this.o.duration = field.getValue();
						},
						scope: this
					},
					strategy: new Ext.ux.form.Spinner.NumberStrategy({
						minValue: 0,
						maxValue: 60000,
						incrementValue: 10,
						alternateIncrementValue: 100
					})
				})]
			}, 
			
			
			//Hide effects panel
			{
				title: this.hidePanel||'Hide',
				id:'hide-panel',
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
					id: 'animation-hide-effect',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: new Ext.data.JsonStore({
						data: this.effectsHide,
						fields: ['code', 'name']
					}),
					fieldLabel: this.effectText || 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					listeners: {
						'select': function(field, record, initialEffect){
							var userSelect = (initialEffect.constructor == Number);
							Ext.each(this.effectsHide, function(item){
							//If it finds item.code, set the right settings
								if (record.data.code === item.code) {
									//If a duration is defined
									if (item.duration) {
										Ext.getCmp('animation-hide-duration').enable();
										Ext.getCmp('animation-hide-duration').setValue(!userSelect && initialEffect.$this.o && initialEffect.$this.o.duration || 400);
									}
									else {
										Ext.getCmp('animation-hide-duration').disable();
									}
									
									//If directions are defined
									if (item.direction) {
										//Set the right value
										if (!userSelect && initialEffect.$this.o && initialEffect.$this.o.direction) {
											Ext.each(item.direction, function(directionItem){
												if (directionItem[0] == initialEffect.$this.o.direction) {
													Ext.getCmp('animation-hide-direction').setValue(directionItem[1]);
												}
											}, this);
										}
										else {
											Ext.getCmp('animation-hide-direction').setValue(item.direction[0][1]);
										}
										
										//Load the predefined directions from effect description
										this.directionsHideStore.loadData(item.direction);
										Ext.getCmp('animation-hide-direction').enable();
										
									}
									else {
										Ext.getCmp('animation-hide-direction').disable();
									}
									
									//If horizFirst is defined
									if (item.horizFirst) {
										Ext.getCmp('animation-hide-horizfirst').show();
										Ext.getCmp('animation-hide-horizfirst').setValue(!userSelect && initialEffect.$this.o && initialEffect.$this.o.horizFirst || false);
									}
									else {
										Ext.getCmp('animation-hide-horizfirst').hide();
									}
									
									//If the user selects the effect, write it inside slide animation
									if (userSelect) {
										this.setAnimation(item.code,'hide');
									}
									else {
										if (item.code == "null") {
											Ext.getCmp('animation-trigger').disable();
											Ext.getCmp('animation-delay').disable();
										}
										field.setValue(item.name);
									}
								}
							}, this);
						},
						scope: this
					},
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: this.effectEmptyText || 'Select an effect...',
					selectOnFocus: true
				}, {
					xtype: 'combo',
					name: 'direction',
					id: 'animation-hide-direction',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: this.directionsHideStore,
					fieldLabel: this.directionText || 'Direction',
					forceSelection: true,
					mode: 'local',
					listeners: {
						select: function(field, record){
							this.focusAnimation.$this.o.direction = record.data.code;
						},
						scope: this
					},
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: this.directionEmptyText || 'Select a direction...',
					selectOnFocus: true
				}, {
					xtype: 'checkbox',
					id: 'animation-hide-horizfirst',
					name: 'horizfirst',
					boxLabel: this.horizFirstText || 'Fold horizontally first',
					listeners: {
						check: function(field, checked){
							this.focusAnimation.$this.o.horizFirst = checked;
						},
						scope: this
					}
				}, new Ext.ux.form.Spinner({
					fieldLabel: 'Duration (ms)',
					id: 'animation-hide-duration',
					value: 0,
					width: 50,
					style: 'text-align:right',
					name: 'duration',
					listeners: {
						spin: function(field){
							this.focusAnimation.$this.o.duration = field.getValue();
						},
						scope: this
					},
					strategy: new Ext.ux.form.Spinner.NumberStrategy({
						minValue: 0,
						maxValue: 60000,
						incrementValue: 10,
						alternateIncrementValue: 100
					})
				})]
			}, 
			
			
			
			
			
			
			//Animate effects panel
			{
				title: this.animateTitel||'Animate',
				id:'anim-panel',
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
					id:'animation-anim-effect',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: new Ext.data.JsonStore({
						data: this.effectsAnim,
						fields: ['code', 'name']
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
				}				/*, {
				 xtype: 'combo',
				 name: 'direction',
				 displayField: 'name',
				 width: 140,
				 listWidth: 140,
				 store: this.directionsStoreOperation,
				 fieldLabel: (this.directionText) ? this.directionText : 'Direction',
				 forceSelection: true,
				 mode: 'local',
				 editable: false,
				 shadow: 'drop',
				 triggerAction: 'all',
				 emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
				 selectOnFocus: true
				 }*/
				, new Ext.ux.form.Spinner({
					fieldLabel: 'Duration (ms)',
					value: 0,
					width: 50,
					style: 'text-align:right',
					name: 'duration',
					strategy: new Ext.ux.form.Spinner.NumberStrategy({
						minValue: 0,
						maxValue: 60000,
						incrementValue: 10,
						alternateIncrementValue: 100
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
};
Ext.extend(NetShows.EditorAccordion.Animation, Ext.Panel, {
	setFocusElement: function(el){
		if (el != this.focusElement) {
			this.focusElement = el;

			//If no focus
			if (this.focusElement === null) {
				//Disable TabPanel
				Ext.getCmp('animation-tabpanel').disable();
				
				//Unselect row
				if (Ext.getCmp('animation-grid').rendered) 
					Ext.getCmp('animation-grid').selModel.clearSelections();
			}
			//If element has at least one animation
			else {
				//Enable TabPanel
				Ext.getCmp('animation-tabpanel').enable();
				
				//Fire the ontabchange event
				Ext.getCmp('animation-tabpanel').fireEvent('tabchange',Ext.getCmp('animation-tabpanel'),Ext.getCmp('animation-tabpanel').getActiveTab());
			}
		}
		
	},
	onTabChange: function(tabPanel, tab){
		//Get the type corresponding to active tab
		var type = tab.id.substring(0, 4);
		
		//If one element is focused
		if (this.focusElement) {
			var index= this.slide.getAnimIndex(this.focusElement.id, type);
			//If this element has an animation with type
			if (index!==false) {
			
				//Select the row in animation grid
				if (Ext.getCmp('animation-grid').rendered) {
					Ext.getCmp('animation-grid').selModel.selectRow(index);
				}
				
				//Focus the current animation
				this.focusAnimation = this.animations[index];
				
				//Update panel
				Ext.getCmp('animation-' + type + '-effect').fireEvent('select', Ext.getCmp('animation-' + type + '-effect'), {
					data: {
						code: this.focusAnimation.$this.o.effect || "null"
					}
				}, this.focusAnimation);
			} //If focusElement has no animation of this type
			else {
				//Select the row in animation grid
				if (Ext.getCmp('animation-grid').rendered) {
					Ext.getCmp('animation-grid').selModel.clearSelections();
				}
				
				//Update active panel
				Ext.getCmp('animation-' + type + '-effect').fireEvent('select', Ext.getCmp('animation-' + type + '-effect'), {
					data: {
						code: "null"
					}
				}, {});
			}
		}
	},
	
	setAnimation: function(code,type){
		//If the selected effect is null, delete it
		if (code == "null") {
			var index = this.slide.removeAnimation(this.focusElement.id, type);
			if (index !== false) {
				Ext.fly(Ext.getCmp('animation-grid').getView().getRow(index)).ghost('l', {
					duration: .4,
					callback: this.refresh,
					scope: this
				});
				//Disable trigger and delay
				Ext.getCmp('animation-trigger').disable();
			}
		}
		else {
			//If no animation exist for this element or if it's not a show one
			//if (this.focusAnimation == undefined || this.focusAnimation.type != type) {
			if (this.slide.getAnimIndex(this.focusElement.id, type) === false) {
				this.focusAnimation = this.addAnimation({
					id: this.focusElement.id,
					type: type,
					o: {
						duration: 400,
						delay: 0,
						effect: code
					},
					trigger: 'click'
				});
			}
			//Set the effect code
			else {
				this.focusAnimation.$this.o.effect = code;
			}
			//Disable trigger and delay
			Ext.getCmp('animation-trigger').enable();
		}
	},
	addAnimation: function(params){
		var index = this.slide.addAnimation(params);
		
		this.refresh();
		//create animation object
		//var animation = this.createAnimationObject(this.slide.animations[index],index);
		
		//Insert it in this.animations array
		//this.animations.splice(index,0,animation);
		
		//Insert it into grid DataStore
		//this.ds.insert(index,new Ext.data.Record(animation));
		
		//Select the right row
		if (Ext.getCmp('animation-grid').rendered) {
			Ext.fly(Ext.getCmp('animation-grid').getView().getRow(index)).slideIn('l', {
				duration: .8,
				callback: function(){
					Ext.getCmp('animation-grid').selModel.selectRow(index);
				},
				scope: this
			});
		}
		
		return this.animations[index];
	},
	
	/* createDataObject : create the object corresponding to an animation
	 * params:
	 * a : animation from this.slide.animations
	 * i : index of this animation
	 */
	createAnimationObject: function(animation, index){
		var anim = {};
		
		//Animation index
		anim.index = index;
		
		//A link to the concerned element
		anim.$element = this.slide.getElById(animation.id);
		
		//Set a proper title for each animated element
		switch (anim.$element.data.className) {
			case 'img':
				anim.element = '<img src="'+anim.$element.data.c.src+'" style="float:left;" height="12" /><div style="float:left;margin-left: 2px;">' + (this.imageText || 'Image')+'</div>';
				break;
			case 'map':
				anim.element = '<img src="'+anim.$element.data.c.img+'" height="16"  />' + (this.mapText || 'Map');
				break;
			case 'video':
				anim.element = '<img src="'+anim.$element.data.c.img+'" height="16"  />' + (this.videoText || 'Video');
				break;
			default:
				anim.element = anim.$element.data.c;
				break;
		}
		
		//Show/Hide/Animate
		anim.type = animation.type;
		
		//A link to the animation itself to modify it in realtime
		anim.$this = this.slide.animations[index];
		return anim;
	},
	
	refresh: function(){
		/* Animations */
		this.animations = [];
		Ext.each(this.slide.animations, function(a, i){
			this.animations.push(this.createAnimationObject(a,i));
		}, this);
		
		this.ds.loadData(this.animations);
	},
	
	setSlide: function(slide){
		this.slide = slide;
		this.slide.on('addelement', this.refresh, this);
		this.slide.on('removeelement', this.refresh, this);
		
		//No selection by default
		Ext.getCmp('animation-tabpanel').disable();
		Ext.getCmp('animation-trigger').disable();
		Ext.getCmp('animation-delay').disable();
		
		this.refresh();
	}
});