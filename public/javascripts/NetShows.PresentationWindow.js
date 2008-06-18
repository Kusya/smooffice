/**
 * @author Clément GONNET
 * Open a new Ext.Window to create an new presentation
 */

NetShows.PresentationWindow = function() {
    this.presentationTitle = new Ext.form.TextField({
        id: 'presentation-title',
        fieldLabel: (this.titleText)?this.titleText:'Enter the title of the presentation to create',
        width: 450,
        validationEvent: true,
        validateOnBlur: true,
        msgTarget: 'under',
        selectOnFocus:true,
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });
	
	this.presentationDescription = new Ext.form.Field({
        id: 'presentation-description',
        fieldLabel: (this.descriptionText)?this.descriptionText:'Enter the description',
        width: 450,
        validationEvent: true,
        validateOnBlur: true,
        msgTarget: 'under'
    });
	
    this.presentationTags = new Ext.form.TextArea({
        id: 'presentation-tags',
        fieldLabel: (this.tagsText)?this.tagsText:'Enter a list of tags separated by coma',
        width: 450,
		height: 60,
        validationEvent: true,
        validateOnBlur: true,
        msgTarget: 'under',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });
    this.form = new Ext.FormPanel({
        labelAlign:'top',
        items:[this.presentationTitle, this.presentationDescription, this.presentationTags],
        border: false,
        bodyStyle:'background:transparent;padding:10px;'
    });

    NetShows.PresentationWindow.superclass.constructor.call(this, {
        title: (this.windowText)?this.windowText:"Create Presentation",
        iconCls: 'presentation-icon',
        id: 'add-presentation-win',
        autoHeight: true,
        width: 500,
        resizable: false,
        plain:true,
        modal: true,
        autoScroll: true,
        closeAction: 'hide',
        items: this.form,
		buttons:[{
	        text: (this.cancelText)?this.cancelText:"Cancel",
	        handler: this.hide.createDelegate(this, [])
	    },{
			id:'ok-button',
	        text: 'Ok!',
	        handler: this.onValidate,
	        scope: this
    	}]
    });
}

Ext.extend(NetShows.PresentationWindow, Ext.Window, {
    show : function(presentation){
		if(presentation){
			this.presentation = presentation;
			this.isNewMode = false;
			this.setTitle((this.modifyText)?this.modifyText:"Modify" + " '" + presentation.text + "'");
            this.presentationTitle.setValue(presentation.text);
            this.presentationDescription.setValue(presentation.attributes.description);
            this.presentationTags.setValue(presentation.attributes.tags);
		}else{
			this.setTitle((this.windowText)?this.windowText:"Create Presentation")
			this.isNewMode = true;
            this.presentationTitle.setValue('');
            this.presentationDescription.setValue('');
            this.presentationTags.setValue('');
		}
        NetShows.PresentationWindow.superclass.show.apply(this, arguments);
		this.presentationTitle.focus();
    },
	
    onValidate: function() {
        this.el.mask('Validating...', 'x-mask-loading');
        var title = this.presentationTitle.getValue();
        var description = this.presentationDescription.getValue();
        var tags = this.presentationTags.getValue();
		this.validateField(title,description,tags);
    },

    markInvalid : function(){
        this.presentationTitle.markInvalid((this.invalidTitleText)?this.invalidTitleText:'The title specified is not a valid text field.');
        this.el.unmask();
    },

    validateField : function(title,description,tags){
        this.el.unmask();
        this.hide();
		if(this.isNewMode){
			return this.fireEvent('createpresentation', {
	        	text: title,
	        	description: description,
				tags: tags,
	        	created_at: new Date()
	        });
		}
		else{
			return this.fireEvent('modifypresentation', {
	        	text: title,
	        	description: description,
				tags: tags,
				node: this.presentation,
	        	updated_at: new Date()
	        });
		}
    }
});