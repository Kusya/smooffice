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
	this.showEffects = [{
		code: null,
		name: this.effectNullText || 'None'
	}, {
		code: 'show',
		name: this.effectShowText || 'Show'
	}, {
		code: 'blind',
		name: this.effectBlindText || 'Blind',
		direction: [['vertical', 'Vertical'], ['horizontal', 'Horizontal']],
		duration: true
	}, {
		code: 'clip',
		name: this.effectClipText || 'Clip',
		direction: [['vertical', 'Vertical'], ['horizontal', 'Horizontal']],
		duration: true
	}, {
		code: 'drop',
		name: this.effectDropText || 'Drop',
		duration: true,
		direction: [['left', 'Left'], ['right', 'Right'], ['up', 'Up'], ['down', 'Down']]
	}, {
		code: 'fade',
		name: this.effectFadeText || 'Fade',
		duration: true
	}, {
		code: 'fold',
		name: this.effectFoldText || 'Fold',
		duration: true,
		horizFirst: true
	}, {
		code: 'slide',
		name: this.effectSlideText || 'Slide',
		duration: true,
		direction: [['left', 'Left'], ['right', 'Right'], ['up', 'Up'], ['down', 'Down']]
	}, {
		code: 'puff',
		name: this.effectPuffText || 'Puff',
		duration: true
	}];
	
	this.hideEffects = [{
		code: null,
		name: this.effectNullText || 'None'
	}, {
		code: 'hide',
		name: this.effectHideText || 'Hide'
	}, {
		code: 'blind',
		name: this.effectBlindText || 'Blind',
		direction: [['vertical', 'Vertical'], ['horizontal', 'Horizontal']],
		duration: true
	}, {
		code: 'clip',
		name: this.effectClipText || 'Clip',
		direction: [['vertical', 'Vertical'], ['horizontal', 'Horizontal']],
		duration: true
	}, {
		code: 'drop',
		name: this.effectDropText || 'Drop',
		duration: true,
		direction: [['left', 'Left'], ['right', 'Right'], ['up', 'Up'], ['down', 'Down']]
	}, {
		code: 'fade',
		name: this.effectFadeText || 'Fade',
		duration: true
	}, {
		code: 'fold',
		name: this.effectFoldText || 'Fold',
		duration: true,
		horizFirst: true
	}, {
		code: 'slide',
		name: this.effectSlideText || 'Slide',
		duration: true,
		direction: [['left', 'Left'], ['right', 'Right'], ['up', 'Up'], ['down', 'Down']]
	}, {
		code: 'puff',
		name: this.effectPuffText || 'Puff',
		duration: true
	}];
	
	this.animateEffects = [{
		code: null,
		name: this.effectNullText || 'None'
	}, {
		code: 'scale',
		name: this.effectScaleText || 'Scale',
		percent: true,
		duration: true
	}, {
		code: 'fade',
		name: this.effectOpacityText || 'Opacity',
		duration: true,
		opacity: true
	} /* move and opacity */];
	
	this.showDirectionsStore = new Ext.data.SimpleStore({
		fields: ['code', 'name'],
		data: this.showEffects[3].direction
	});
	
	this.hideDirectionsStore = new Ext.data.SimpleStore({
		fields: ['code', 'name'],
		data: this.hideEffects[3].direction
	});
	
	this.triggers = [{
		code: 'click',
		name: this.triggerClickText || 'On mouse click',
	}, {
		code: 'after',
		name: this.triggerAfterText || 'After last animation'/*,
		nameAnimation: this.triggerAfterText || 'After last animation',
		nameTransition: this.triggerAfterTransitionText||'After transition'*/
	}	//-------> à prévoir
	/*, {
	 code: 'with',
	 name: this.triggerWithText || 'With last animation',
	 }*/
	];
	
	
	this.triggerStore = new Ext.data.JsonStore({
		fields: ['code', 'name'/*,'nameAnimation','nameTransition'*/],
		data: this.triggers
	});
	
	this.ds = new Ext.data.JsonStore({
		fields: ['index', 'element', 'type', 'effect', '$element', 'o', '$this', 'trigger']
	});
	
	// the DefaultColumnModel expects this blob to define columns. It can be extended to provide
	// custom or reusable ColumnModels
	var colModel = new Ext.grid.ColumnModel([{
		id: 'index',
		header: this.numberText || "#",
		sortable: false,
		locked: true,
		dataIndex: 'index',
		resizable: false,
		width: 26,
		fixed: true,
		hideable: false,
		menuDisabled: true
	}, {
		header: this.elementText || "Element",
		sortable: false,
		dataIndex: 'element',
		hideable: false,
		menuDisabled: true,
		resizable: true
	}, {
		header: this.effectText || "Effect",
		sortable: false,
		dataIndex: 'effect',
		hideable: false,
		menuDisabled: true,
		resizable: true,
		width: 40
	}, {
		header: this.typeText || "Type",
		sortable: false,
		dataIndex: 'type',
		hideable: false,
		menuDisabled: true,
		resizable: true,
		width: 40
	}]);
	
	this.optionsAnimationsWindow = new Ext.Window({
		id: 'options-window',
		title: this.optionWindowTitle || 'Animation order',
		iconCls: 'icon-preview',
		width: 240,
		height: 350,
		resizable: true,
		resizeHandles: 's',
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
			scope: this
		},
		layout: 'border',
		items: [{
			xtype: 'grid',
			region:'center',
			id: 'animation-grid',
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
						this.userSelect = true;
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
							
							/*var afterAnimRecord = this.triggerStore.getAt(1);
						 if (this.focusAnimation.index == 0) {
						 afterAnimRecord.data.name = afterAnimRecord.data.nameTransition;
						 }
						 else {
						 afterAnimRecord.data.name = afterAnimRecord.data.nameAnimation;
						 
						 }
						 //Ext.getCmp('animation-trigger').select(triggerIndex);*/
							//Update panel
							Ext.getCmp('animation-' + this.focusAnimation.type + '-effect').fireEvent('select', Ext.getCmp('animation-' + this.focusAnimation.type + '-effect'), {
								data: {
									code: this.focusAnimation.$this.o.effect || null
								}
							}, this.focusAnimation);
							
							//Shows the panel
							Ext.getCmp('animation-tabpanel').activate(rec.data.type + '-panel');
							
							//Select the right trigger and its parameters
							Ext.getCmp('animation-trigger').fireEvent('select', Ext.getCmp('animation-trigger'), rec, true);
						}
					},
					scope: this
				}
			})
		}, new Ext.FormPanel({
			bodyBorder: false,
			id: 'options-window-form',
			labelAlign: 'top',
			defaultType: 'textfield',
			defaults: {
				labelSeparator: ''
			},
			region:'south',
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
						//The slide is modified only if init = false
						if(!init)
							this.slide.fireEvent('modified');
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
				width: 70,
				style: 'text-align:right',
				name: 'delay',
				listeners: {
					'spin': function(field){
						//The slide is modified
						this.slide.fireEvent('modified');
						this.focusAnimation.$this.o.delay = parseInt(field.getValue());
					},
					'change': function(field, newValue, oldValue){
						//The slide is modified
						this.slide.fireEvent('modified');
						this.focusAnimation.$this.o.delay = parseInt(newValue);
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
						this.optionsAnimationsWindow.getEl().alignTo(this.getEl(), 'tl', [-240, 0]);
						Ext.fly(this.optionsAnimationsWindow.getEl()).slideIn('r', {
							easing: 'easeOut'
						});
						this.optionsVisible = true;
					}
					else {
						Ext.fly(this.optionsAnimationsWindow.getEl()).slideOut('r', {
							easing: 'easeIn',
							afterStyle:'display:none'
						});
						this.optionsVisible = false;
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
			html: '<div id="animation-preview" style="margin:5%;width:90%;height:120px;background-color:black;">&nbsp;</div>',
			border: false,
			listeners: {
				'click': function(){
					$('#animation-preview').smoo({
						slide: [this.slide.getJSON()]
					}, false);
				},
				scope: this
			}
		}, {
			xtype: 'tabpanel',
			id: 'animation-tabpanel',
			border: false,
			activeTab: 0,
			plain: true,
			listeners: {
				tabchange: this.onTabChange,
				scope: this
			},
			defaults: {
				bodyStyle: 'padding:10px'
			},
			items: [			//Show effects panel
			{
				title: this.showTitle || 'In',
				id: 'show-panel',
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
						data: this.showEffects,
						fields: ['code', 'name']
					}),
					fieldLabel: this.effectText || 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					listeners: {
						'select': function(field, record, initialEffect){
							this.setAnimation(record, initialEffect, 'show');
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
					store: this.showDirectionsStore,
					fieldLabel: this.directionText || 'Direction',
					forceSelection: true,
					mode: 'local',
					listeners: {
						select: function(field, record){
							//The slide is modified
							this.slide.fireEvent('modified');
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
							//The slide is modified
							this.slide.fireEvent('modified');
							this.focusAnimation.$this.o.horizFirst = checked;
						},
						scope: this
					}
				}, new Ext.ux.form.Spinner({
					fieldLabel: 'Duration (ms)',
					id: 'animation-show-duration',
					value: 0,
					width: 70,
					style: 'text-align:right',
					name: 'duration',
					listeners: {
						spin: function(field){
							//The slide is modified
							this.slide.fireEvent('modified');
							this.focusAnimation.$this.o.duration = parseInt(field.getValue());
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
			},   //Hide effects panel
			{
				title: this.hidePanel || 'Out',
				id: 'hide-panel',
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
						data: this.hideEffects,
						fields: ['code', 'name']
					}),
					fieldLabel: this.effectText || 'Effect',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					editable: false,
					listeners: {
						'select': function(field, record, initialEffect){
							this.setAnimation(record, initialEffect, 'hide');
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
					store: this.hideDirectionsStore,
					fieldLabel: this.directionText || 'Direction',
					forceSelection: true,
					mode: 'local',
					listeners: {
						select: function(field, record){
							//The slide is modified
							this.slide.fireEvent('modified');
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
							//The slide is modified
							this.slide.fireEvent('modified');
							this.focusAnimation.$this.o.horizFirst = checked;
						},
						scope: this
					}
				}, new Ext.ux.form.Spinner({
					fieldLabel: 'Duration (ms)',
					id: 'animation-hide-duration',
					value: 0,
					width: 70,
					style: 'text-align:right',
					name: 'duration',
					listeners: {
						spin: function(field){
							//The slide is modified
							this.slide.fireEvent('modified');
							this.focusAnimation.$this.o.duration = parseInt(field.getValue());
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
			},   //Animate effects panel
			{
				title: this.animateTitle || 'Animate',
				id: 'animate-panel',
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
					id: 'animation-animate-effect',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: new Ext.data.JsonStore({
						data: this.animateEffects,
						fields: ['code', 'name']
					}),
					fieldLabel: this.effectText || 'Effect',
					forceSelection: true,
					typeAhead: true,
					listeners: {
						'select': function(field, record, initialEffect){
							this.setAnimation(record, initialEffect, 'animate');
						},
						scope: this
					},
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: this.effectEmptyText || 'Select an effect...',
					selectOnFocus: true
				}, new Ext.ux.form.Spinner({
					id: 'animation-animate-opacity',
					fieldLabel: 'Opacity (0.0-1.0)',
					value: 1,
					width: 50,
					style: 'text-align:right',
					name: 'opacity',
					listeners: {
						spin: function(field){
							//The slide is modified
							this.slide.fireEvent('modified');
							this.focusAnimation.$this.o.opacity = parseInt(field.getValue());
						},
						scope: this
					},
					strategy: new Ext.ux.form.Spinner.NumberStrategy({
						minValue: 0,
						maxValue: 1,
						incrementValue: .05,
						alternateIncrementValue: .10
					})
				}), new Ext.ux.form.Spinner({
					id: 'animation-animate-percent',
					fieldLabel: 'Size (%)',
					value: 100,
					width: 50,
					style: 'text-align:right',
					name: 'duration',
					listeners: {
						spin: function(field){
							//The slide is modified
							this.slide.fireEvent('modified');
							this.focusAnimation.$this.o.percent = parseInt(field.getValue());
						},
						scope: this
					},
					strategy: new Ext.ux.form.Spinner.NumberStrategy({
						minValue: 0,
						maxValue: 600,
						incrementValue: 10,
						alternateIncrementValue: 100
					})
				}), new Ext.ux.form.Spinner({
					id: 'animation-animate-duration',
					fieldLabel: 'Duration (ms)',
					value: 0,
					width: 70,
					style: 'text-align:right',
					name: 'duration',
					listeners: {
						spin: function(field){
							//The slide is modified
							this.slide.fireEvent('modified');
							this.focusAnimation.$this.o.duration = parseInt(field.getValue());
						},
						scope: this
					},
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
						//The slide is modified
						this.slide.fireEvent('modified');
						//Create animation
						var index = this.slide.addAnimation({
							id: this.focusElement.id,
							type: 'animate',
							o: {
								duration: 0,
								delay: 0,
								effect: 'fade',
								opacity: 1
							},
							trigger: 'click'
						});
						//Refreshes grid view
						this.refresh(index, true);
						//Set focusAnimation
						this.focusAnimation = this.animations[index];
					},
					scope: this
				}]
			}]
		}]
	});
}
Ext.extend(NetShows.EditorAccordion.Animation, Ext.Panel, {
	setFocusElement: function(el){
		if (el != this.focusElement) {
			this.focusElement = el;
			
			//If no focus
			if (this.focusElement === null) {
				//Disable TabPanel
				Ext.getCmp('animation-tabpanel').disable();
				Ext.getCmp('animation-trigger').disable();
				Ext.getCmp('animation-delay').disable();
				
				this.focusAnimation = null;
				
				//Unselect row
				if (Ext.getCmp('animation-grid').rendered) 
					Ext.getCmp('animation-grid').selModel.clearSelections();
			}
			//If element has at least one animation
			else {
				//Enable TabPanel
				Ext.getCmp('animation-tabpanel').enable();
				
				//Fire the ontabchange event
				Ext.getCmp('animation-tabpanel').fireEvent('tabchange', Ext.getCmp('animation-tabpanel'), Ext.getCmp('animation-tabpanel').getActiveTab());
			}
		}
		
	},
	onTabChange: function(tabPanel, tab){
		//Get the type corresponding to active tab
		var type = tab.id.match(/(.*?)-/)[1];
		
		//If one element is focused
		if (this.focusElement) {
			var index = this.slide.getAnimIndex(this.focusElement.id, type);
			//If this element has an animation with type
			if (index !== false) {
			
				//Select the row in animation grid
				if (Ext.getCmp('animation-grid').rendered) {
					Ext.getCmp('animation-grid').selModel.selectRow(index);
				}
				
				//Focus the current animation
				this.focusAnimation = this.animations[index];
				
				//Update panel
				Ext.getCmp('animation-' + type + '-effect').fireEvent('select', Ext.getCmp('animation-' + type + '-effect'), {
					data: {
						code: this.focusAnimation.$this.o.effect || null
					}
				}, this.focusAnimation);
			} //If focusElement has no animation of this type
			else {
				//Select the row in animation grid
				if (Ext.getCmp('animation-grid').rendered) {
					Ext.getCmp('animation-grid').selModel.clearSelections();
				}
				
				this.focusAnimation = null;
				Ext.getCmp('animation-trigger').disable();
				Ext.getCmp('animation-delay').disable();
				
				//Update active panel
				Ext.getCmp('animation-' + type + '-effect').fireEvent('select', Ext.getCmp('animation-' + type + '-effect'), {
					data: {
						code: null
					}
				}, {});
			}
		}
	},
	
	/* findEffectByCode : Find effect description object by code and type criteria
	 * params:
	 * - code : effect code
	 * - type : effect type (show/hide/animate)
	 */
	findEffectByCode: function(code, type){
		//Parse all available effects to find the corresponding one
		var effect = false;
		eval('Ext.each(this.' + type + 'Effects, function(item){' +
		//If it finds item.code, set the right settings
		'if (code === item.code) {' +
		'effect = item;' +
		'return true' +
		'}' +
		'},this);');
		return effect
	},
	
	/* setAnimation : creates or remove the right effect selected by user or initially set
	 * params
	 * - record : the record object containing effect name and code
	 * - initialEffect : this.focusAnimation
	 * - type: effect type show/hide/animate
	 */
	setAnimation: function(record, initialEffect, type){
		//If the user selects on his/her own, initialEffect is the selected index, or else it's focusAnimation
		var userSelect = (initialEffect.constructor == Number);
		
		this.tmpEffect = this.findEffectByCode(record.data.code, type);
		//If the selected effect has been found
		if (this.tmpEffect !== false) {
	
			//The slide is modified
			if(userSelect)this.slide.fireEvent('modified');
			
			//Duration
			if (this.tmpEffect.duration) {
				Ext.getCmp('animation-' + type + '-duration').enable();
				Ext.getCmp('animation-' + type + '-duration').setValue(!userSelect && initialEffect.$this.o && initialEffect.$this.o.duration || 400);
			}
			else 
				if (Ext.getCmp('animation-' + type + '-duration')) {
					Ext.getCmp('animation-' + type + '-duration').disable();
				}
			
			//Direction
			if (this.tmpEffect.direction) {
				//Set the right value
				if (!userSelect && initialEffect.$this.o && initialEffect.$this.o.direction) {
					Ext.each(this.tmpEffect.direction, function(directionItem){
						if (directionItem[0] == initialEffect.$this.o.direction) {
							Ext.getCmp('animation-' + type + '-direction').setValue(directionItem[1]);
						}
					}, this);
				}
				else {
					Ext.getCmp('animation-' + type + '-direction').setValue(this.tmpEffect.direction[0][1]);
				}
				//Load the predefined directions from effect description
				eval('this.' + type + 'DirectionsStore.loadData(this.tmpEffect.direction);');
				Ext.getCmp('animation-' + type + '-direction').enable();
			}
			else 
				if (Ext.getCmp('animation-' + type + '-direction')) {
					Ext.getCmp('animation-' + type + '-direction').disable();
				}
			
			//horizFirst
			if (this.tmpEffect.horizFirst) {
				Ext.getCmp('animation-' + type + '-horizfirst').enable();
				Ext.getCmp('animation-' + type + '-horizfirst').setValue(!userSelect && initialEffect.$this.o && initialEffect.$this.o.horizFirst || false);
			}
			else 
				if (Ext.getCmp('animation-' + type + '-horizfirst')) {
					Ext.getCmp('animation-' + type + '-horizfirst').disable();
				}
			
			//Opacity
			if (this.tmpEffect.opacity) {
				Ext.getCmp('animation-' + type + '-opacity').enable();
				Ext.getCmp('animation-' + type + '-opacity').setValue(!userSelect && initialEffect.$this.o && initialEffect.$this.o.opacity || 1);
			}
			else 
				if (Ext.getCmp('animation-' + type + '-opacity')) {
					Ext.getCmp('animation-' + type + '-opacity').disable();
				}
			
			//Scale
			if (this.tmpEffect.percent) {
				Ext.getCmp('animation-' + type + '-percent').enable();
				Ext.getCmp('animation-' + type + '-percent').setValue(!userSelect && initialEffect.$this.o && initialEffect.$this.o.percent || 100);
			}
			else 
				if (Ext.getCmp('animation-' + type + '-percent')) {
					Ext.getCmp('animation-' + type + '-percent').disable();
				}
			
			//If the user selects the effect, write it inside slide animation
			if (userSelect) {
				//If the selected effect is null, delete it
				if (this.tmpEffect.code == null) {
					if (this.slide.removeAnimation(this.focusAnimation.index)) {
						if (this.optionsVisible) {
							Ext.fly(Ext.getCmp('animation-grid').getView().getRow(this.focusAnimation.index)).ghost('l', {
								duration: .4,
								callback: this.refresh,
								scope: this
							});
						}else{
							this.refresh();
						}
						//Disable trigger and delay
						Ext.getCmp('animation-trigger').disable();
						this.focusAnimation=null;
					}
				}
				else {
					//If no animation exist for this element or if it's not a 'type' one
					var index = this.slide.getAnimIndex(this.focusElement.id, type);
					if (index === false) {
						//Create animation
						index = this.slide.addAnimation({
							id: this.focusElement.id,
							type: type,
							o: {
								duration: 400,
								delay: 0,
								effect: this.tmpEffect.code
							},
							trigger: 'click'
						});
						//Refreshes grid view
						this.refresh(index, true);
						//Set focusAnimation
						this.focusAnimation = this.animations[index];
					}
					//Set the effect code
					else {
						this.focusAnimation.$this.o.effect = this.tmpEffect.code;
						this.refresh(index);
					}
					//Disable trigger and delay
					Ext.getCmp('animation-trigger').enable();
				}
			}
			else {//Else, initially set
				if (this.tmpEffect.code == null) {
					Ext.getCmp('animation-trigger').disable();
					Ext.getCmp('animation-delay').disable();
				}
				Ext.getCmp('animation-' + type + '-effect').setValue(this.tmpEffect.name);
			}
		}
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
				anim.element = '<div style="overflow:hidden;width:12px;height:12px;float:left;"><img src="' + anim.$element.data.c.src + '" height="12" /></div><div style="float:left;margin-left: 2px;">' + (this.imageText || 'Image') + '</div>';
				break;
			case 'map':
				anim.element = '<div style="overflow:hidden;width:12px;height:12px;float:left;"><img src="' + anim.$element.data.c.img + '" height="12"  /></div><div style="float:left;margin-left: 2px;">' + (this.mapText || 'Map') + '</div>';
				break;
			case 'video':
				anim.element = '<div style="overflow:hidden;width:12px;height:12px;float:left;"><img src="' + anim.$element.data.c.img + '" height="12"  /></div><div style="float:left;margin-left: 2px;">' + (this.videoText || 'Video') + '</div>';
				break;
			default:
				anim.element = anim.$element.data.c;
				break;
		}
		
		//Effect name
		anim.effect = this.findEffectByCode(animation.o.effect, animation.type).name;
		
		//Show/Hide/Animate
		anim.type = animation.type;
		
		//A link to the animation itself to modify it in realtime
		anim.$this = this.slide.animations[index];
		return anim;
	},
	
	/* refresh : refreshes the grid data store to suits this.slide.animations array
	 * params:
	 * - index : the index to select just after refresh
	 * - animate : true to animate the new record
	 */
	refresh: function(index, animate){
		/* Animations */
		this.animations = [];
		Ext.each(this.slide.animations, function(a, i){
			this.animations.push(this.createAnimationObject(a, i));
		}, this);
		
		this.ds.loadData(this.animations);
		
		//Select the right row
		if (this.optionsVisible && index !== undefined) {
			if (animate) {
				Ext.fly(Ext.getCmp('animation-grid').getView().getRow(index)).slideIn('l', {
					duration: .8,
					callback: function(){
						Ext.getCmp('animation-grid').selModel.selectRow(index);
					},
					scope: this
				});
			}
			else {
				Ext.getCmp('animation-grid').selModel.selectRow(index);
			}
		}
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