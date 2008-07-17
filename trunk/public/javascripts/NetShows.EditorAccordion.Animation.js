/**
 * @author Clément GONNET
 * 
 * TODO : Check link between slide view and selectrow : too much recursion
 */
NetShows.EditorAccordion.Animation = function(){


	this.effectsInOut = [{
		code: 'null',
		name: this.effectNullText || 'None',
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
	
	this.effectsOperations = [{
		code: 'scale',
		name: this.effectScaleText || 'Scale',
		duration: true,
		direction: false,
		horizFirst: false
	} /* move and opacity */];
	
	this.directionsStoreIn = new Ext.data.SimpleStore({
		fields: ['code', 'name'],
		data: this.effectsInOut[1].direction
	});
	
	this.directionsStoreOut = new Ext.data.SimpleStore({
		fields: ['code', 'name'],
		data: this.effectsInOut[1].direction
	});
	
	this.triggers = [{
		code: this.triggerClickText || 'click',
		name: 'On mouse clic'
	}, {
		code: this.triggerAfterText || 'after',
		name: 'After last animation'
	}
//-------> à prévoir
	/*, {
		code: this.triggerWithText || 'with',
		name: 'With last animation'
	}*/];
//------->

	this.triggerStore = new Ext.data.JsonStore({
		fields: ['code', 'name'],
		data: this.triggers
	});
	
	this.ds = new Ext.data.JsonStore({
		fields: ['index', 'element', 'type', '$element', 'p', '$this', 'trigger']
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
						// Best to create the drop target after render, so we don't need to worry about whether grid.el is null
						
						// constructor parameters:
						//    grid (required): GridPanel or EditorGridPanel (with enableDragDrop set to true and optionally a value specified for ddGroup, which defaults to 'GridDD')
						//    config (optional): config object
						// valid config params:
						//    anything accepted by DropTarget
						//    listeners: listeners object. There are 4 valid listeners, all listed in the example below
						//    copy: boolean. Determines whether to move (false) or copy (true) the row(s) (defaults to false for move)
						var ddrow = new Ext.ux.dd.GridReorderDropTarget(g, {
							copy: false,
							listeners: {
								beforerowmove: function(objThis, oldIndex, newIndex, records){
									//msg_log(g.getStore().getAt(newIndex).data)
									//records[0].data.index = newIndex;
									//g.getStore().getAt(newIndex).data.index = oldIndex;
									// code goes here
									// return false to cancel the move
								},
								afterrowmove: function(objThis, oldIndex, newIndex, records){
									// code goes here
									
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
								beforerowcopy: function(objThis, oldIndex, newIndex, records){
									// code goes here
									// return false to cancel the copy
								},
								afterrowcopy: function(objThis, oldIndex, newIndex, records){
									// code goes here
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
								//Focus the current animation
								this.focusAnimation = rec.data;
								
								//Update panel
								Ext.getCmp('animationIn-effect').fireEvent('select', Ext.getCmp('animationIn-effect'), {
									data: {
										code: rec.data.p.f || "null"
									}
								}, rec.data);
								
								//Ext.apply(rec.data,{n: rec.data.n || 0});
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
								if (trigger.code == record.data.code || trigger.code == record.data.trigger) {
									switch (trigger.code) {
										case 'click':
											Ext.getCmp('animation-delay').disable();
											
											if (init === true) {
												Ext.getCmp('animation-trigger').setValue(trigger.name);
											}
											else {
												this.focusAnimation.$this.n = 'click';
												this.focusAnimation.n = 'click';
												this.focusAnimation.trigger = 'click';
											}
											break;
										case 'after':
											Ext.getCmp('animation-delay').enable();
											if (init === true) {
												Ext.getCmp('animation-trigger').setValue(trigger.name);
											}
											else {
												this.focusAnimation.$this.n = 0;
												this.focusAnimation.n = 0;
												this.focusAnimation.trigger = 'after';
											}
											
											Ext.getCmp('animation-delay').setValue(this.focusAnimation.n);
											break;
										case 'with':
											Ext.getCmp('animation-delay').enable();
											if (init === true) {
												Ext.getCmp('animation-trigger').setValue(trigger.name);
											}
											else {
												this.focusAnimation.$this.n = 0;
												this.focusAnimation.n = 0;
												this.focusAnimation.trigger = 'with';
											}
											Ext.getCmp('animation-delay').setValue(this.focusAnimation.n);
											break;
									}
									
								}
							}, this);
							
						},
						scope: this
					},
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.triggerEmptyText) ? this.triggerEmptyText : 'Select a trigger...',
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
							this.focusAnimation.$this.n = field.getValue();
							this.focusAnimation.n = field.getValue();
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
			defaults: {
				bodyStyle: 'padding:10px'
			},
			items: [ //Panel In Effects
			{
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
					id: 'animationIn-effect',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: new Ext.data.JsonStore({
						data: this.effectsInOut,
						fields: ['code', 'name']
					}),
					fieldLabel: this.effectText || 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					listeners: {
						'select': function(field, record, initialEffect){
							msg_log(initialEffect);
							Ext.each(this.effectsInOut, function(item){
							
								if (record.data.code === item.code) {
									//Duration
									if (item.duration) {
										Ext.getCmp('animationIn-duration').enable();
										Ext.getCmp('animationIn-duration').setValue(initialEffect.p ? initialEffect.p.duration || 400 : 400);
									}
									else {
										Ext.getCmp('animationIn-duration').disable();
									}
									
									//Direction
									if (item.direction) {
										//Set the right value
										if (initialEffect.p && initialEffect.p.direction) {
											Ext.each(item.direction, function(directionItem){
												if (directionItem[0] == initialEffect.p.direction) {
													Ext.getCmp('animationIn-direction').setValue(directionItem[1]);
												}
											}, this);
										}
										else {
											Ext.getCmp('animationIn-direction').setValue(item.direction[0][1]);
										}
										this.directionsStoreIn.loadData(item.direction);
										Ext.getCmp('animationIn-direction').enable();
										
									}
									else {
										Ext.getCmp('animationIn-direction').disable();
									}
									
									//horizFirst
									if (item.horizFirst) {
										Ext.getCmp('animationIn-horizfirst').show();
										Ext.getCmp('animationIn-horizfirst').setValue(initialEffect.p ? initialEffect.p.horizFirst || false : false);
									}
									else {
										Ext.getCmp('animationIn-horizfirst').hide();
									}
									
									
									if (initialEffect.constructor == Number) {
										if (this.focusAnimation.$this.p === undefined) 
											this.focusAnimation.$this.p = {};
										this.focusAnimation.$this.p.f = record.data.code;
										this.focusAnimation.p.f = record.data.code;
										/*Send the effect name
										 this.slide.setAnimation({
										 effect: record.data.code
										 });*/
									}
									Ext.getCmp("animationIn-effect").setValue(item.name);
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
					id: 'animationIn-direction',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: this.directionsStoreIn,
					fieldLabel: this.directionText || 'Direction',
					forceSelection: true,
					mode: 'local',
					listeners: {
						select: function(field, record){
							this.focusAnimation.$this.p.direction = record.data.code;
							this.focusAnimation.p.direction = record.data.code;
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
					id: 'animationIn-horizfirst',
					name: 'horizfirst',
					boxLabel: this.horizFirstText || 'Fold horizontally first',
					listeners: {
						check: function(field, checked){
							this.focusAnimation.$this.p.horizFirst = checked;
							this.focusAnimation.p.horizFirst = checked;
						},
						scope: this
					}
				}, new Ext.ux.form.Spinner({
					fieldLabel: 'Duration (ms)',
					id: 'animationIn-duration',
					value: 0,
					width: 50,
					style: 'text-align:right',
					name: 'duration',
					listeners: {
						spin: function(field){
							this.focusAnimation.$this.p.duration = field.getValue();
							this.focusAnimation.p.duration = field.getValue();
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
			}, //Panel Out Effects
			{
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
					id: 'animationOut-effect',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: new Ext.data.JsonStore({
						data: this.effectsInOut,
						fields: ['code', 'name']
					}),
					fieldLabel: this.effectText || 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					listeners: {
						'select': function(field, record, initialEffect){
							Ext.each(this.effectsInOut, function(item){
							
								if (record.data.code === item.code) {
									//Duration
									if (item.duration) {
										Ext.getCmp('animationOut-duration').enable();
										Ext.getCmp('animationOut-duration').setValue(initialEffect.duration || 400);
									}
									else {
										Ext.getCmp('animationOut-duration').disable();
									}
									
									//Direction
									if (item.direction) {
										//Set the right value
										if (initialEffect && initialEffect.direction) {
											Ext.each(item.direction, function(directionItem){
												if (directionItem[0] == initialEffect.direction) {
													Ext.getCmp('animationOut-direction').setValue(directionItem[1]);
												}
											}, this);
										}
										else {
											Ext.getCmp('animationOut-direction').setValue(item.direction[0][1]);
										}
										this.directionsStoreOut.loadData(item.direction);
										Ext.getCmp('animationOut-direction').enable();
										
									}
									else {
										Ext.getCmp('animationOut-direction').disable();
									}
									
									//horizFirst
									if (item.horizFirst) {
										Ext.getCmp('animationOut-horizfirst').show();
										Ext.getCmp('animationOut-horizfirst').setValue(initialEffect.horizFirst || false);
									}
									else {
										Ext.getCmp('animationOut-horizfirst').hide();
									}
									
									
									if (initialEffect != true) {
										//Send the effect name
										this.slide.setTransition({
											effect: record.data.code
										});
										Ext.getCmp("animationOut-effect").setValue(item.name);
									}
									else {
										Ext.getCmp("animationOut-effect").setValue(item.name);
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
					id: 'animationOut-direction',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: this.directionsStoreOut,
					fieldLabel: this.directionText || 'Direction',
					forceSelection: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: this.directionEmptyText || 'Select a direction...',
					selectOnFocus: true
				}, {
					xtype: 'checkbox',
					id: 'animationOut-horizfirst',
					name: 'horizfirst',
					boxLabel: this.horizFirstText || 'Fold horizontally first',
					listeners: {
						check: function(field, checked){
							this.slide.setTransition({
								horizFirst: checked
							});
						},
						scope: this
					}
				}, new Ext.ux.form.Spinner({
					fieldLabel: 'Duration (ms)',
					id: 'animationOut-duration',
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
				})]
			}, //Panel Operations Effects
			{
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
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: new Ext.data.JsonStore({
						data: this.effectsOperations,
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
			
			if (this.focusElement === null) {
				Ext.getCmp('animation-tabpanel').disable();
				
				//Unselect row
				if (Ext.getCmp('animation-grid').rendered) 
					Ext.getCmp('animation-grid').selModel.clearSelections();
			}
			else {
				Ext.getCmp('animation-tabpanel').enable();
				//Select the right row in animation grid
				if (Ext.getCmp('animation-grid').rendered) {
					Ext.getCmp('animation-grid').selModel.selectRow(this.slide.getIndexAnimByElId(this.focusElement.id));
				}
				else {
					var data = this.animations[this.slide.getIndexAnimByElId(this.focusElement.id)];
					
					Ext.getCmp('animation-tabpanel').enable();
					
					//Focus the current animation
					this.focusAnimation = data;
					
					//Update panel
					Ext.getCmp('animationIn-effect').fireEvent('select', Ext.getCmp('animationIn-effect'), {
						data: {
							code: data.p.f || "null"
						}
					}, data);
				}
			}
		}
	},
	refresh: function(){
		/* Animations */
		this.animations = [];
		Ext.each(this.slide.animations, function(a, i){
			var anim = {};
			anim.index = i;
			anim.element = a.o;
			anim.$element = this.slide.getElById(a.o);
			anim.type = anim.$element.data.className;
			anim.p = a.p || {};
			anim.n = a.n && a.n.constructor == Number ? 0 : 'click' || 'click';
			anim.trigger = anim.n.constructor == Number ? 'after' : 'click';
			anim.$this = this.slide.animations[i];
			this.animations.push(anim);
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