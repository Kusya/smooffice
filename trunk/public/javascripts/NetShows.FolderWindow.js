/**
 * @author Clément GONNET
 * Open a new Ext.Window to create an new folder
 */

NetShows.FolderWindow = function() {
		
    this.folderName = new Ext.form.Field({
        id: 'folder-name',
        fieldLabel: (this.folderText)?this.folderText:'Enter the name of the folder to create',
        width: 300,
        validationEvent: true,
        validateOnBlur: true,
        msgTarget: 'under'
    });

    this.form = new Ext.FormPanel({
        labelAlign:'top',
        items:[this.folderName],
        border: false,
        bodyStyle:'background:transparent;padding:10px;'
    });

    NetShows.FolderWindow.superclass.constructor.call(this, {
        title: (this.windowText)?this.windowText:'New Folder',
        iconCls: 'folder-icon',
        id: 'add-folder-win',
        autoHeight: true,
        width: 350,
        resizable: false,
        plain:true,
        modal: true,
        autoScroll: true,
        closeAction: 'hide',

        buttons:[{
            text: (this.cancelText)?this.cancelText:'Cancel',
            handler: this.hide.createDelegate(this, [])
        },{
            text: 'Ok!',
            handler: this.onValid,
            scope: this
        }],

        items: this.form
    });

}

Ext.extend(NetShows.FolderWindow, Ext.Window, {
    show : function(folder){
		if (folder) {
			this.node = folder;
			this.isNewMode = false;
			this.folderName.setValue(folder.text);
		}
		else {
			this.isNewMode = true;
			this.folderName.setValue('');
		}
        NetShows.FolderWindow.superclass.show.apply(this, arguments);
    },

    onValid: function() {
        this.el.mask('Validating...', 'x-mask-loading');
        var name = this.folderName.getValue();
        this.validateField(name);
    },

    markInvalid : function(){
        this.presentationTitle.markInvalid((this.invalidText)?this.invalidText:'The name specified is not a valid text field.');
        this.el.unmask();
    },

    validateField : function(name){
        this.el.unmask();
        this.hide();
		if(this.isNewMode){
			return this.fireEvent('createfolder', {
	        	name: name
	        });
		}else{
			return this.fireEvent('modifyfolder', {
	        	text: name,
				node: this.node
	        });
		}
    }
});