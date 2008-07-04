/**
 * The main panel used for all browsing
 * @author cgonnet
 */
NetShows.BrowserPanel = function(){	
	/* Presentation List */
    this.presentationBrowser = new NetShows.PresentationBrowser();

	/* Slides Viewer */
    this.slideBrowser = new NetShows.SlideBrowser();
	
	NetShows.BrowserPanel.superclass.constructor.call(this, {
        id:'browser-panel',
		title: (this.presentationsText)?this.presentationsText:"Presentations",
        autoScroll:true,
		frame: false,
		bufferResize: true,
		region: 'west',
        split:false,
        margins:'0 5 5 5',
        cmargins:'0 5 5 5',
        width: 230,
        collapsible:true,
		items: [
			this.presentationBrowser,
			this.slideBrowser
		],
		tbar: [this.presentationBrowser.actionNew,this.presentationBrowser.actionNewFolder,this.presentationBrowser.actionRemove,this.slideBrowser.actionNew,this.slideBrowser.actionRemove]
	});
	this.on('previewview', this.onPreviewView, this);
	this.on('editorview', this.onEditorView, this);
}

Ext.extend(NetShows.BrowserPanel, Ext.Panel, {
	onPreviewView: function(){
		if (NetShows.state == 'editor') {
			NetShows.state = 'preview';
			//msg_log("Browser - Preview view");
			
			//Save the state of the slide browser
			this.slideBrowser.savePreviousState();
			
			Ext.fly(this.getEl()).shift({
				width: 230,
				concurrent: true,
				callback: NetShows.viewport.doLayout,
				scope: NetShows.viewport
			});
			
			this.slideBrowser.getEl().ghost('r', {
				easing: 'easeOut',
				callback: function(){
					this.slideBrowser.hide();
					this.presentationBrowser.show();
					this.presentationBrowser.getEl().slideIn('l', {
						callback: function(){
						},
						scope: this,
						easing: 'easeOut'
					});
				},
				scope: this
			});
			//this.presentationBrowser.show();
			//this.slideBrowser.hide();
			this.setTitle((this.presentationsText) ? this.presentationsText : "Presentations");
			this.slideBrowser.actionNew.hide();
			this.slideBrowser.actionRemove.hide();
			this.presentationBrowser.actionNew.show();
			this.presentationBrowser.actionNewFolder.show();
			this.presentationBrowser.actionRemove.show();
		}
	},
	onEditorView: function(presentation){
		if (NetShows.state == 'preview') {
			NetShows.state = 'editor';
			//msg_log("Browser - Editor view");
			
			Ext.fly(this.getEl()).shift({
				width: 170,
				concurrent: true,
				callback: NetShows.viewport.doLayout,
				scope: NetShows.viewport
			});
			
			this.slideBrowser.setPresentation(presentation);
			
			this.presentationBrowser.getEl().ghost('l', {
				easing: 'easeOut',
				callback: function(){
					this.presentationBrowser.hide();
					this.slideBrowser.show();
					this.slideBrowser.getEl().slideIn('r', {
						easing: 'easeOut'
					});
				},
				scope: this
			});
			this.setTitle((this.slidesText) ? this.slidesText : "Slides");
			this.presentationBrowser.actionNew.hide();
			this.presentationBrowser.actionNewFolder.hide();
			this.presentationBrowser.actionRemove.hide();
			this.slideBrowser.actionNew.show();
			this.slideBrowser.actionRemove.show();
			return true;
		}
		else //If switching between editor tabs, ghost the previous slide browser and slide in the new one
 			if (NetShows.state == 'editor') {
				//msg_log("Browser - Switching between Editor view");
				this.slideBrowser.savePreviousState();
				this.slideBrowser.slideDataView.getEl().ghost('l', {
					easing: 'easeOut',
					callback: function(){
						this.slideBrowser.setPresentation(presentation);
						this.slideBrowser.slideDataView.getEl().slideIn('r', {
							easing: 'easeOut'
						/*,
						 callback:NetShows.viewport.doLayout,
						 scope:NetShows.viewport*/
						});
					},
					scope: this
				});
			}
		return true;
	}
});