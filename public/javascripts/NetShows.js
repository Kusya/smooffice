/**
 * @author Clément GONNET
 * Generate the application and all its components
 * bash$ sudo /usr/local/mysql/bin/mysqld_safe --user=mysql --skip-grant-tables
 */

Ext.BLANK_IMAGE_URL = '/ext/resources/images/default/s.gif';


Ext.onReady(function(){
	Ext.QuickTips.init();	
	
	/*
	 * Templates
	 */
	//Preview
	NetShows.getPreviewTemplate = function(){
		var previewtpl = Ext.Template.from('preview-tpl', {
			compiled: true
		});
		return previewtpl;
	}
	
	
	//Home tab
	NetShows.getHomeTemplate = function(){
		var hometpl = Ext.Template.from('home-tab-tpl', {
			compiled: true
		});
		return hometpl;
	}
	
	/*
	 * Components
	 */
	// Browser Panel
	NetShows.browserPanel = new NetShows.BrowserPanel();
	
	// Main view
	NetShows.mainPanel = new NetShows.MainPanel();
	
	// Accordion for editor mode
	NetShows.accordion = new NetShows.EditorAccordion();
	NetShows.accordion.disable();
	
	NetShows.state = 'preview';
	
	/*
	 * Events
	 */
	// Removing a presentation from the presentation panel
	NetShows.browserPanel.presentationBrowser.on('removepresentation', function(id){
		NetShows.mainPanel.removeTab(id);
	});
	
	NetShows.getSlideView = function(){
		if (NetShows.state == "editor") {
			return NetShows.mainPanel.getActiveTab().getComponent("slide-view");
		}
		return false;
	}
	
	// Event : switch to a tab in Preview Mode
	function onPreviewView(){
		NetShows.browserPanel.fireEvent('previewview');
		NetShows.accordion.collapse();
		NetShows.accordion.disable();
	}
	NetShows.browserPanel.presentationBrowser.on('presentationselect', function(node){
		NetShows.mainPanel.loadPresentation(node.attributes,node.isAncestor(node.getOwnerTree().root.lastChild),node.isLeaf());
		onPreviewView();
	});
	NetShows.mainPanel.on('previewview', onPreviewView);
	
	
	// Event : switch to a tab in Editor Mode
	function onEditorView(presentation){
		NetShows.browserPanel.fireEvent('editorview',presentation);
		
		//Define the presentation to use with the accordion
        NetShows.accordion.setPresentation(presentation);
		
		NetShows.accordion.expand();
		NetShows.accordion.enable();
	}
	NetShows.mainPanel.on('editorview', onEditorView);
	
	
	// A new presentation is opened
	function onOpenPresentation(presentation){
		Ext.get('loading-title').dom.innerHTML = presentation.text
		Ext.get('loading').fadeIn();
        Ext.get('loading-mask').fadeIn({
			endOpacity:.5
		});
		Ext.get('loading-msg').dom.innerHTML = this.openLoadingText||'Loading presentation...';
		
		//Loading the slides from the server
		if (!presentation.store) {
			presentation.store = new Ext.data.JsonStore({
				url: '/presentation/get_slides',
				fields: ['id', 'comment', 'a', 'e', 't', 'p'],
				listeners: {
					'load': {
						fn: function(){
							//Array of slides
							presentation.slides = [];
							
							presentation.init = function(){
								presentation.nLoaded = 0;
								
								Ext.get('loading-msg').dom.innerHTML = this.slidesLoadingText || 'Creating slides...';
								
								if (presentation.slides.length == 0) {
									//For each slide
									presentation.store.each(function(item, index){
										//Create each slide in the array from the dataStore
										var mySlide = new Slide(item.data, presentation.id);
										
										this.store.getAt(index).data.html = mySlide.getPreview();
										
										//Set an event when the slide is loaded
										//mySlide.on('load', presentation.onLoad, presentation,{delay:200});
										/*NetShows.browserPanel.slideBrowser.on('render', function(){
			 for (var i = 0; i < presentation.slides.length; i++) {
			 Ext.EventManager.on('preview-' + presentaiton.slides[i].id, 'load', presentation.onLoad, presentation);
			 }
			 }, this);*/
										presentation.slides.push(mySlide);
									});
									
								}
								//Open the presentation in a tab
								NetShows.mainPanel.openPresentation(presentation);
								
								setTimeout(function(){
									Ext.get('loading').fadeOut({
										remove: false,
										callback: function(){
										
										}
									});
									Ext.get('loading-mask').fadeOut({
										remove: false
									});
								}, 400);
								
							}
							
							//Update slides thumbnail
							presentation.updatePreview = function(slide){
								var index = this.slides.indexOf(slide);
								this.store.getAt(index).data.html = slide.getPreview();
								NetShows.browserPanel.slideBrowser.refresh();
							}
							
							/*presentation.onLoad = function(){
								presentation.nLoaded++;
								msg_log(presentation.nLoaded);
								if (presentation.nLoaded == presentation.slides.length) {
									Ext.get('loading').fadeOut({
										remove: false,
										callback: function(){
											Ext.get('loading-mask').fadeOut({
												remove: false
											});
										}
									});
								}
							}*/
							
							
							//Send slides order
							presentation.saveState = function(){
								//Setting the array of slides or delete it
								presentation.slideOrder = [];
								
								//for each slide setting the id
								Ext.each(presentation.slides, function(item){
									presentation.slideOrder.push({
										id: item.data.id
									});
								});
								
								msg_log('Saving order : ' + Ext.util.JSON.encode(presentation.slideOrder));
								Ext.Ajax.request({
									url: '/presentation/slides_order',
									params: {
										authenticity_token: NetShows.key,
										id: presentation.id,
										order: Ext.util.JSON.encode(presentation.slideOrder)
									}
								});
								
							};
							//Initialization
							presentation.init();
        					
						},
						scope: this
					}
				}
			});
			presentation.store.load({
				params: {
					id: presentation.id,
					authenticity_token: NetShows.key
				}
			});
			
			
		//The slides already exists	
		}
		else {
			//Initialization
			presentation.init();
			
			//Switch to the editor view
			onEditorView(presentation);
		}
		
	}
	NetShows.mainPanel.on('presentationopen', onOpenPresentation);
	NetShows.browserPanel.presentationBrowser.on('presentationopen', onOpenPresentation);
	
	
	//Manage the selection of a new slide in the slides browser
	NetShows.browserPanel.slideBrowser.on('selectslide', NetShows.mainPanel.setSlide, NetShows.mainPanel);
	
	//Language selecter
	this.form_lang = new Ext.form.FormPanel({
		applyTo: 'form_lang',
		border: false,
		bodyStyle: {
			'background-color': 'transparent'
		},
		width: 180,
		height: 24,
		defaultType: 'textfield',
		items: {
			xtype: 'combo',
			fieldLabel: this.selectLanguageText||'Select Language',
			name: 'locale',
			width: 75,
			store: new Ext.data.SimpleStore({
				id: 0,
				fields: ['file', 'locale'],
				data: [['', 'English'], ['fr', 'French']]
			}),
			listeners: {
				select: {
					fn: function(combo){
						window.location.search = '?' + Ext.urlEncode({
							locale: combo.getValue()
						});
					}
				}
			},
			mode: 'local',
			editable: false,
			forceSelection: true,
			valueField: 'file',
			displayField: 'locale',
			triggerAction: 'all',
			value: locale
		}
	});
	
	/*
	 * The global application view port
	 */
	NetShows.viewport = new Ext.Viewport({
		layout: 'border',
		items: [new Ext.BoxComponent({ // raw element
			border: false,
			region: 'north',
			el: 'header',
			height: 24
		}), NetShows.browserPanel, NetShows.mainPanel, NetShows.accordion]
	});
	
	setTimeout(function(){
        Ext.get('start-loading').remove();
        Ext.get('start-loading-mask').fadeOut({remove:true});
    }, 250);
});

Ext.EventManager.on(window,'unload',function(){
	GUnload();
})
