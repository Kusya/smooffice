/**
 * @author cgonnet
 */
NetShows.EditorAccordion.Slide = function(){
	this.direction2 = [{
		name: 'Horizontal',
		code: 'horizontal'
	}, {
		name: 'Vertical',
		code: 'vertical'
	}];
	this.direction4 = [{
		code: 'left',
		name: 'Left'
	}, {
		code: 'right',
		name: 'Right'
	}, {
		code: 'up',
		name: 'Up'
	}, {
		code: 'down',
		name: 'Down'
	}];
	this.effects = [{
		code: 'null',
		name: this.effectNullText || 'None',
		direction: false,
		duration: false,
		horizFirst: false
	}, {
		code: 'blind',
		name: this.effectBlindText || 'Blind',
		direction: 2,
		duration: true,
		horizFirst: false
	}, {
		code: 'clip',
		name: this.effectClipText || 'Clip',
		direction: 2,
		duration: true,
		horizFirst: false
	}, {
		code: 'drop',
		name: this.effectDropText || 'Drop',
		duration: true,
		direction: 4,
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
		code: 'scale',
		name: this.effectScaleText || 'Scale',
		duration: true,
		direction: false,
		horizFirst: false
	}, {
		code: 'slide',
		name: this.effectSlideText || 'Slide',
		duration: true,
		direction: 4,
		horizFirst: false
	}, {
		code: 'puff',
		name: this.effectPuffText || 'Puff',
		duration: true,
		direction: false,
		horizFirst: false
	}];
	
	NetShows.EditorAccordion.Slide.superclass.constructor.call(this, {
		title: 'Slide',
		border: false,
		autoScroll: true,
		iconCls: 'slide-icon',
		items: {
			xtype: 'tabpanel',
			border: false,
			activeTab: 1,
			items: [{
				title: 'Transition',
				id:'transition-panel',
				iconCls: 'transition-icon',
				bodyStyle: 'padding:10px',
				layout: 'form',
				autoHeight: true,
				labelAlign: 'top',
				defaultType: 'textfield',
				defaults: {
					labelSeparator: '',
					hideParent:true
				},
				items: [{
					xtype: 'panel',
					html: '<div style="width:100%;height:120px;background-color:black;">&nbsp;</div>',
					border: false
				}, {
					xtype: 'combo',
					id: 'transition-effect',
					name: 'effect',
					displayField: 'name',
					allowBlank: false,
					blankText: this.blankTextMsg || 'This field is required',
					width: 100,
					listWidth: 100,
					store: new Ext.data.JsonStore({
						data: this.effects,
						fields:['code','name']
					}),
					fieldLabel: this.effectText || 'Effect',
					forceSelection: true,
					mode: 'local',
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: this.effectEmptyText || 'Select an effect...',
					listeners: {
						'render': function(){
							//Ext.getCmp('transition-effect').fireEvent('select',Ext.getCmp('transition-effect'),{data:{code:null}},true);
							//Ext.getCmp('transition-direction4').hide();
							//Ext.getCmp('transition-direction2').hide();
							//Ext.getCmp('transition-horizfirst').hide();
						},
						'select': function(field, record, initialEffect){
							Ext.each(this.effects,function(item){
								
								if (record.data.code === item.code) {
									//Duration
									if (item.duration) {
										Ext.getCmp('transition-duration').enable();
										Ext.getCmp('transition-duration').setValue(initialEffect ? initialEffect.p ? initialEffect.p.duration ? initialEffect.p.duration : 400 : 400 : 400);
									}
									else {
										Ext.getCmp('transition-duration').disable();
									}
									
									//Direction
									if (item.direction == 2) {
										
										//Ext.override(Ext.getCmp('transition-direction4'),{hideLabel:true});
											Ext.getCmp('transition-direction4').hide();
										
										if (initialEffect) {
											if (initialEffect.p) {
												if (initialEffect.p.direction) {
													Ext.each(this.direction2,function(dir2) {
														if (dir2.code == initialEffect.p.direction) {
															Ext.getCmp('transition-direction2').setValue(dir2.name);
														}
													},this);
												}
												else {
													Ext.getCmp('transition-direction2').setValue(this.direction2[0].name);
												}
											}
											else {
												Ext.getCmp('transition-direction2').setValue(this.direction2[0].name);
											}
										}
										else {
											Ext.getCmp('transition-direction2').setValue(this.direction2[0].name);
										}
										
											//Ext.override(Ext.getCmp('transition-direction2'),{hideLabel:false});
										Ext.getCmp('transition-direction2').show();
										Ext.getCmp('transition-direction2').enable();
									}
									else 
										if (item.direction == 4) {
											//Ext.override(Ext.getCmp('transition-direction4'),{hideLabel:false});
											Ext.getCmp('transition-direction4').show();
											//Ext.override(Ext.getCmp('transition-direction2'),{hideLabel:true});
											Ext.getCmp('transition-direction2').hide();
											if (initialEffect) {
												if (initialEffect.p) {
													if (initialEffect.p.direction) {
														Ext.each(this.direction4, function(dir4){
															if (dir4.code == initialEffect.p.direction) {
																Ext.getCmp('transition-direction2').setValue(dir4.name);
															}
														}, this);
													}
													else {
														Ext.getCmp('transition-direction4').setValue(this.direction4[0].name);
													}
												}
												else {
													Ext.getCmp('transition-direction4').setValue(this.direction4[0].name);
												}
											}
											else {
												Ext.getCmp('transition-direction4').setValue(this.direction4[0].name);
											}
										}
										else {
											//Ext.override(Ext.getCmp('transition-direction2'),{hideLabel:false});
											Ext.getCmp('transition-direction2').show();
											Ext.getCmp('transition-direction2').disable();
											//Ext.override(Ext.getCmp('transition-direction4'),{hideLabel:true});
											Ext.getCmp('transition-direction4').hide();
										}
									
									//horizFirst
									if (item.horizFirst) {
										//Ext.override(Ext.getCmp('transition-horizfirst'),{hideLabel:false});
										Ext.getCmp('transition-horizfirst').show();
										Ext.getCmp('transition-horizfirst').setValue(initialEffect ? initialEffect.p ? initialEffect.p.horizFirst ? initialEffect.p.horizFirst :false : false : false);
									}
									else {
										//Ext.override(Ext.getCmp('transition-horizfirst'),{hideLabel:true});
										Ext.getCmp('transition-horizfirst').hide();
									}
									
									
									if (initialEffect != true) {
										//Send the effect name
										this.slide.setTransition({
											effect: record.data.code
										});
										Ext.getCmp("transition-effect").setValue(item.name);
									}
									else {
										Ext.getCmp("transition-effect").setValue(item.name);
									}
								}
							},this);
						},
						scope: this
					}
				}, {
					xtype: 'combo',
					id: 'transition-direction2',
					name: 'direction',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: new Ext.data.SimpleStore({
						fields: ['code', 'name'],
						data: [['vertical', 'Vertical'], ['horizontal', 'Horizontal']]
					}),
					fieldLabel: (this.directionText) ? this.directionText : 'Direction',
					forceSelection: true,
					mode: 'local',
					listeners: {
						select: function(field, record){
							this.slide.setTransition({
								direction: record.data.code
							});
						},
						/*hide:function(field){
							if(field.rendered)
							field.getEl().parent().hide()
						},
						show:function(field){
							if(field.rendered)
							field.getEl().parent().show()
						},*/
						scope: this
					},
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
					selectOnFocus: true
				}, {
					xtype: 'combo',
					id: 'transition-direction4',
					name: 'direction',
					displayField: 'name',
					width: 140,
					listWidth: 140,
					store: new Ext.data.SimpleStore({
						fields: ['code', 'name'],
						data: [['left', 'Left'], ['right', 'Right'], ['up', 'Up'], ['down', 'Down']]
					}),
					fieldLabel: (this.directionText) ? this.directionText : 'Direction',
					forceSelection: true,
					mode: 'local',
					listeners: {
						select: function(field, record){
							this.slide.setTransition({
								direction: record.data.code
							});
						},
						scope: this
					},
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
					selectOnFocus: true
				}, {
					xtype: 'checkbox',
					id: 'transition-horizfirst',
					name: 'horizfirst',
					boxLabel: 'Fold horizontally first',
					listeners: {
						check: function(field, checked){
							this.slide.setTransition({
								horizFirst: checked
							});
						},
						scope: this
					}
				}, new Ext.ux.form.Spinner({
					id: 'transition-duration',
					name: 'duration',
					fieldLabel: 'Duration (ms)',
					value: 0,
					width: 60,
					style: 'text-align:right',
					name: 'duration',
					listeners: {
						spin: function(field){
							this.slide.setTransition({
								duration: field.getValue()
							});
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
					xtype: 'combo',
					id: 'transition-trigger',
					displayField: 'trigger',
					name: 'trigger',
					width: 100,
					listWidth: 100,
					store: new Ext.data.SimpleStore({
						fields: ['code', 'trigger'],
						data: [['clic', 'On mouse clic'], ['auto', 'Automatically']]
					}),
					fieldLabel: (this.triggerText) ? this.triggerText : 'Trigger',
					forceSelection: true,
					typeAhead: true,
					mode: 'local',
					listeners: {
						select: function(field, record){
							switch (record.data.code) {
								case 'clic':
									this.slide.setTransition({
										o: null
									});
									Ext.getCmp('transition-delay').getEl().parent().hide();
									break;
								case 'auto':
									Ext.getCmp('transition-delay').getEl().parent().show();
									this.slide.setTransition({
										o: 0
									});
									break;
							}
						},
						scope: this
					},
					editable: false,
					shadow: 'drop',
					triggerAction: 'all',
					emptyText: (this.triggerEmptyText) ? this.triggerEmptyText : 'Select a trigger...',
					selectOnFocus: true
				}, new Ext.ux.form.Spinner({
					fieldLabel: 'Delay (ms)',
					id: 'transition-delay',
					name:'delay',
					value: 0,
					width: 60,
					style: 'text-align:right',
					listeners: {
						spin: function(field){
							this.slide.setTransition({
								o: field.getValue()
							});
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
			}, {
				title: 'Appearance',
				layout: 'form',
				autoHeight: true,
				labelAlign: 'top',
				defaultType: 'textfield',
				bodyStyle: 'padding:10px',
				defaults: {
					labelSeparator: ''
				},
				
				items: [{
					xtype: 'fieldset',
					title: this.modelTitle ? this.modelTitle : 'Template & layout',
					autoHeight: true,
					defaultType: 'textfield',
					defaults: {
						hideLabel: true
					},
					items: {
						xtype: 'combo',
						name: 'template',
						displayField: 'title',
						width: 140,
						listWidth: 140,
						store: new Ext.data.SimpleStore({
							fields: ['template', 'title'],
							data: [['image.png', 'Titre et sous-titre'], ['bind', 'Titre et corps'], ['drop', 'Image et corps'], ['slideOut', 'Image']]
						}),
						forceSelection: true,
						mode: 'local',
						editable: false,
						shadow: 'drop',
						triggerAction: 'all',
						emptyText: (this.effectEmptyText) ? this.effectEmptyText : 'Select a template...'
					}
				}, {
					xtype: 'fieldset',
					autoHeight: true,
					defaults: {
						hideLabel: true
					},
					title: this.backgroundTitle ? this.backgroundTitle : 'Background',
					items: [{
						xtype: 'combo',
						id: 'background',
						displayField: 'mode',
						width: 140,
						listWidth: 140,
						store: new Ext.data.SimpleStore({
							fields: ['code', 'mode'],
							data: [['null', 'None'], ['clr', 'Color'], ['img', 'Image']]
						}),
						forceSelection: true,
						mode: 'local',
						editable: false,
						shadow: 'drop',
						triggerAction: 'all',
						emptyText: (this.backgroundEmptyText) ? this.backgroundEmptyText : 'Select a background...',
						selectOnFocus: true,
						listeners: {
							'render': function(){
								Ext.getCmp('clr-container').hide();
								Ext.getCmp('img-container').hide();
							},
							'select': function(field, record){
								switch (record.data.code) {
									case 'null':
										Ext.getCmp('clr-container').hide();
										Ext.getCmp('img-container').hide();
										this.slide.setBackground({
											type: 'null'
										});
										break;
									case 'clr':
										Ext.getCmp('clr-container').show();
										Ext.getCmp('img-container').hide();
										break;
									case 'img':
										Ext.getCmp('clr-container').hide();
										Ext.getCmp('img-container').show();
										break;
								}
							},
							scope: this
						}
					}, {
						//xtype: 'box',
						id: 'clr-container',
						border: false,
						items: new Ext.form.ColorField({
							id: 'clr-container-color-field',
							fieldLabel: 'color',
							showHexValue: true,
							defaultColor: 'FFFFFF',
							listeners: {
								select: function(value){
									this.slide.setBackground({
										type: 'color',
										p: {
											color: '#' + value
										}
									});
								},
								scope: this
							}
						})
					}, {
						//xtype: 'box',
						id: 'img-container',
						items: {
							xtype: 'browsebutton',
							text: 'Choose a file...'
						}
					}]
				
				}]
			}]
		}
	});
}
Ext.extend(NetShows.EditorAccordion.Slide, Ext.Panel, {
	setSlide: function(slide){
		this.slide = slide;
		
		/* Transition */
		//Effect
		Ext.getCmp('transition-effect').fireEvent('select',Ext.getCmp('transition-effect'),{data:{code:this.slide.transition.f||"null"}},this.slide.transition);
		
		/* Appearance */
		//Background
		if (this.slide.properties.backgroundColor != undefined) {
			var color = this.slide.properties.backgroundColor.substring(1, this.slide.properties.backgroundColor.length);
			Ext.getCmp('clr-container-color-field').setValue(color);
			//Ext.getCmp('background').select(1,false);
			Ext.getCmp('background').setValue('Color');
			Ext.getCmp('clr-container').show();
			Ext.getCmp('img-container').hide();
		}
		else {
			Ext.getCmp('background').setValue('None');
			Ext.getCmp('clr-container').hide();
			Ext.getCmp('img-container').hide();
		}
	}
});
