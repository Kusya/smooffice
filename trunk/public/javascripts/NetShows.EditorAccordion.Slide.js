/**
 * @author cgonnet
 */
NetShows.EditorAccordion.Slide = function(){

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
                iconCls: 'transition-icon',
                bodyStyle: 'padding:10px',
                layout: 'form',
                autoHeight: true,
                labelAlign: 'top',
                defaultType: 'textfield',
                defaults: {
                    labelSeparator: ''
                },
                items: [{
                    xtype: 'panel',
                    html: '<div style="width:100%;height:120px;background-color:black;">&nbsp;</div>',
                    border: false
                }, {
                    xtype: 'combo',
                    name: 'effect',
                    displayField: 'effect',
                    allowBlank: false,
                    blankText: this.blankTextMsg ? this.balnkTextMsg : 'This field is required',
                    width: 100,
                    listWidth: 100,
                    store: new Ext.data.SimpleStore({
                        fields: ['code', 'effect'],
                        data: [['null', 'None'], ['fade', 'Fade'], ['drop', 'Drop'], ['slide', 'Slide']]
                    }),
                    fieldLabel: this.effectText ? this.effectText : 'Effect',
                    forceSelection: true,
                    mode: 'local',
                    editable: false,
                    shadow: 'drop',
                    triggerAction: 'all',
                    emptyText: this.effectEmptyText ? this.effectEmptyText : 'Select an effect...'
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
                    xtype: 'combo',
                    name: 'direction',
                    displayField: 'name',
                    width: 140,
                    listWidth: 140,
                    store: new Ext.data.SimpleStore({
                        fields: ['code', 'name'],
                        data: [['left', 'From left'], ['right', 'From right'], ['up', 'From top'], ['down', 'From bottom'], ['', 'From center']]
                    }),
                    fieldLabel: (this.directionText) ? this.directionText : 'Direction',
                    forceSelection: true,
                    mode: 'local',
                    editable: false,
                    shadow: 'drop',
                    triggerAction: 'all',
                    emptyText: (this.directionEmptyText) ? this.directionEmptyText : 'Select a direction...',
                    selectOnFocus: true
                }, {
                    xtype: 'combo',
                    name: 'trigger',
                    displayField: 'trigger',
                    width: 100,
                    listWidth: 100,
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
						hideLabel:true
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
						id:'background',
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
						border:false,
						items: new Ext.form.ColorField({
							id:'clr-container-color-field',
							fieldLabel: 'color',
							showHexValue: true,
							defaultColor:'FFFFFF',
							listeners:{
								select: function(value){
									this.slide.setBackground({
										type: 'color',
										p: {
											color: '#' + value
										}
									});
								},
								scope:this
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
		//If the slide has a background color
		if (this.slide.data.p.backgroundColor != undefined) {
			var color = this.slide.properties.backgroundColor.substring(1, this.slide.properties.backgroundColor.length);
			Ext.getCmp('clr-container-color-field').setValue(color);
			//Ext.getCmp('background').select(1,false);
			Ext.getCmp('background').setValue('Color');
			Ext.getCmp('clr-container').show();
			Ext.getCmp('img-container').hide();
		}else{
			Ext.getCmp('background').setValue('None');
			Ext.getCmp('clr-container').hide();
			Ext.getCmp('img-container').hide();
		}
	}
});
