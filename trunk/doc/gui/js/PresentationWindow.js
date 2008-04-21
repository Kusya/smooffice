/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

PresentationWindow = function() {
    this.presentationTitle = new Ext.form.Field({
        id: 'presentation-title',
        fieldLabel: 'Enter the title of the presentation to create',
        width: 450,
        validationEvent: true,
        validateOnBlur: true,
        msgTarget: 'under',
		value: 'Find Things Do Stuffs or Write Less Do More',
        listeners:{
            valid: this.syncShadow,
            invalid: this.syncShadow,
            scope: this
        }
    });
	this.presentationDescription = new Ext.form.Field({
        id: 'presentation-description',
        fieldLabel: 'Enter the description',
        width: 450,
        validationEvent: true,
        validateOnBlur: true,
        msgTarget: 'under',
		value: 'Example of description... Philosophy about Javascript Frameworks/Libraries',
    });

    this.form = new Ext.FormPanel({
        labelAlign:'top',
        items:[this.presentationTitle,this.presentationDescription],
        border: false,
        bodyStyle:'background:transparent;padding:10px;'
    });

    PresentationWindow.superclass.constructor.call(this, {
        title: 'New Presentation',
        iconCls: 'presentation-icon',
        id: 'add-presentation-win',
        autoHeight: true,
        width: 500,
        resizable: false,
        plain:true,
        modal: true,
        autoScroll: true,
        closeAction: 'hide',

        buttons:[{
            text: 'Create it!',
            handler: this.onAdd,
            scope: this
        },{
            text: 'Cancel',
            handler: this.hide.createDelegate(this, [])
        }],

        items: this.form
    });

    this.addEvents({add:true});
}

Ext.extend(PresentationWindow, Ext.Window, {
    show : function(){
        /*if(this.rendered){
            this.presentationTitle.setValue('');
        }*/
        PresentationWindow.superclass.show.apply(this, arguments);
    },

    onAdd: function() {
        this.el.mask('Validating...', 'x-mask-loading');
        var title = this.presentationTitle.getValue();
        var description = this.presentationDescription.getValue();
        /*Ext.Ajax.request({
            url: 'http://extjs.com/deploy/dev/examples/feed-viewer/feed-proxy.php',
            params: {feed: url},
            success: this.validateFeed,
            failure: this.markInvalid,
            scope: this,
            feedUrl: url
        });*/
		this.validateField(title,description);
    },

    markInvalid : function(){
        this.presentationTitle.markInvalid('The title specified is not a valid text field.');
        this.el.unmask();
    },

    validateField : function(title,description){
        this.el.unmask();
        this.hide();
		return this.fireEvent('validpresentation', {
            title: title,
            description: description
        });
		/*var dq = Ext.DomQuery;
        var url = options.feedUrl;

        try{
            var xml = response.responseXML;
            var channel = xml.getElementsByTagName('channel')[0];
            if(channel){
                var text = dq.selectValue('title', channel, url);
                var description = dq.selectValue('description', channel, 'No description available.');
                this.el.unmask();
                this.hide();

                return this.fireEvent('validfeed', {
                    url: url,
                    text: text,
                    description: description
                });
            }
        }catch(e){
        }
        this.markInvalid();*/
    }
});