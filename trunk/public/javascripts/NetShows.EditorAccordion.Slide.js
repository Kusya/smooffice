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
	                    labelSeparator: ''
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
	                    labelSeparator: ''
	                },
					title: this.backgroundTitle ? this.backgroundTitle : 'Background',
					items: {
						xtype: 'combo',
						name: 'background',
						displayField: 'mode',
						width: 140,
						listWidth: 140,
						store: new Ext.data.SimpleStore({
							fields: ['code', 'mode'],
							data: [['null', 'None'], ['right', 'Color'], ['up', 'Gradient fill'], ['down', 'Image']]
						}),
						forceSelection: true,
						mode: 'local',
						editable: false,
						shadow: 'drop',
						triggerAction: 'all',
						emptyText: (this.backgroundEmptyText) ? this.backgroundEmptyText : 'Select a background...',
						selectOnFocus: true
					}
				}]
            }]
        }
    });
}
Ext.extend(NetShows.EditorAccordion.Slide, Ext.Panel, {});
