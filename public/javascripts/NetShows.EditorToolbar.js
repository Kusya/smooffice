/**
 * @author Clément GONNET
 * Toolbar of the editor mode
 */
NetShows.EditorToolbar = function(){

	NetShows.EditorToolbar.superclass.constructor.call(this, {
		id: 'editor-toolbar',
		
		items: [{
			title: 'save',
			iconCls: 'save-icon',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('save');
			},
			scope: this
		}, {
			iconCls: 'icon-print',
			title: 'Print',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('print');
			},
			scope: this
		}, {
			tooltip: (this.fullScreenText) ? this.fullScreenText : 'Full screen',
			iconCls: 'icon-full',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('play');
			},
			scope: this
		}, {
			text: (this.previewText) ? this.previewText : 'Preview',
			tooltip: (this.previewTooltip) ? this.previewTooltip : 'Preview the current slide',
			iconCls: 'icon-preview',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('preview');
			},
			scope: this
		}, /*'-', {
			//handler: this.onButtonClick,
			iconCls: 'icon-copy',
			tooltip: 'Copy element'
		}, {
			//handler: this.onButtonClick,
			iconCls: 'icon-cut',
			tooltip: 'Cut element'
		}, {
			//handler: this.onButtonClick,
			iconCls: 'icon-paste',
			tooltip: 'Paste element'
		}, */
		'-', {
			title: 'text',
			iconCls: 'icon-text',
			tooltip: 'Insert text',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('newtext');
			},
			scope: this
		}, {
			title: 'Drawing',
			iconCls: 'icon-draw-applet',
			tooltip: 'Draw an image',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('newdrawapplet');
			},
			scope: this
		}, {
			title: 'Maps',
			iconCls: 'icon-maps',
			tooltip: 'Insert Google Maps',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('newmap');
			},
			scope: this
		}, {
			title: 'remove',
			id:'icon-remove',
			iconCls: 'icon-cross',
			tooltip: 'Remove element',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('remove');
			},
			scope: this
		}, '-', {
			iconCls: 'icon-move-back',
			id:'icon-move-back',
			tooltip: this.moveBackText || "Move back",
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('moveback');
			},
			scope: this
		}, {
			iconCls: 'icon-move-backwards',
			id:'icon-move-backwards',
			tooltip: this.moveBackwardsText || "Move backwards",
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('movebackwards');
			},
			scope: this
		}, {
			iconCls: 'icon-move-forwards',
			id:'icon-move-forwards',
			tooltip: this.moveForwardsText || "Move forwards",
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('moveforwards');
			},
			scope: this
		}, {
			iconCls: 'icon-move-front',
			id:'icon-move-front',
			tooltip: this.moveFrontText || "Move front",
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('movefront');
			},
			scope: this
		}, /*'-', {
			title: 'Comment',
			iconCls: 'icon-comment',
			tooltip: 'Edit the comments',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('editcomment');
			},
			scope: this
		}, {
			title: 'Zoom in',
			iconCls: 'icon-zoom-in',
			tooltip: 'Zoom in',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('zoomin');
			},
			scope: this
		}, {
			title: 'Zoom out',
			iconCls: 'icon-zoom-out',
			tooltip: 'Zoom out',
			handler: function(){
				//Catched in MainPanel.openPresentation
				this.fireEvent('zoomout');
			},
			scope: this
		}*/]
	});
	NetShows.mainPanel.on('focuselement', this.setFocus, this);
}

Ext.extend(NetShows.EditorToolbar, Ext.Toolbar, {
	setFocus: function(element){
		msg_log(element);
		switch (element.data.type) {
			case 'text':
				break;
			case 'presentation_title':
				break;
			case 'image':
				break;
			case 'video':
				break;
			default:
				msg_log("No type");
				return false;
		}
	}
});