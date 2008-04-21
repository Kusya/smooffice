/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

PresentationViewer = {};

Ext.onReady(function(){
    Ext.QuickTips.init();

    //Ext.state.Manager.setProvider(new Ext.state.SessionProvider({state: Ext.appState}));

    var tpl = Ext.Template.from('preview-tpl', {
        compiled:true,
        getBody : function(v, all){
            return Ext.util.Format.stripScripts(v || all.description);
        }
    });
    PresentationViewer.getTemplate = function(){
        return tpl;
    }

    var presentations = new PresentationPanel();
    var mainPanel = new MainPanel();

    presentations.on('presentationselect', function(presentation){
        mainPanel.loadPresentation(presentation);
    });
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[
            new Ext.BoxComponent({ // raw element
                region:'north',
                el: 'header',
                height:32
            }),
            presentations,
            mainPanel
         ]
    });

    // add some default feeds
    presentations.addPresentation({
        description:'Learn about the control of human resources',
        title: 'Learning control'
    }, false, false);

    presentations.addPresentation({
        description:'All you need to setup a MySQL database',
        title: 'Databases with MySQL'
    }, false, false);

    presentations.addPresentation({
        description:'The advantages and inconvenients of each one',
        title: 'PHP vs Ruby'
    }, false, false);
});

// This is a custom event handler passed to preview panels so link open in a new windw
PresentationViewer.LinkInterceptor = {
    render: function(p){
        p.body.on({
            'mousedown': function(e, t){ // try to intercept the easy way
                t.target = '_blank';
            },
            'click': function(e, t){ // if they tab + enter a link, need to do it old fashioned way
                if(String(t.target).toLowerCase() != '_blank'){
                    e.stopEvent();
                    window.open(t.href);
                }
            },
            delegate:'a'
        });
    }
};