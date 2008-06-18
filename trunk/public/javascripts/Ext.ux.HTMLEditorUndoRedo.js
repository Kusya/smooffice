// Ext.ux.HTMLEditorUndoRedo
// a plugin that adds Undo/Redo functionality to Ext.ux.HtmlEditor
// note: this is mostly for IE only as Gecko functionality is adequate,
// however, code is included to add toolbar buttons for non-IE browsers
Ext.ux.HTMLEditorUndoRedo = function(size) {

  // PRIVATE

  // pointer to Ext.ux.HTMLEditor
  var editor;

  // IE only: variables
  // size parameter limits the rollback history
  var volume = size || -1;
  var history = new Array();
  var index = 0;
  var placeholder = 0;
  var count = 0;
  var ignore = false;

  // IE only: updates the toolbar buttons
  var updateToolbar = function() {
    editor.tb.items.map.undo.setDisabled(index < 2);
    editor.tb.items.map.redo.setDisabled(index == count);
  }

  // IE only: updates the editor body
  var reset = function() {
    editor.getEditorBody().innerHTML = history[index].content;
    resetBookmark();
  }

  // IE only: updates the element (when in source edit mode)
  var resetElement = function() {
    editor.el.dom.value = history[index].content;
    resetBookmark();
  }

  // IE only: reposition the cursor
  var resetBookmark = function() {
    var range = editor.doc.selection.createRange();
    range.moveToBookmark(history[index].bookmark);
    range.select();
  }

  // PUBLIC

  return {

    // Ext.ux.HTMLEditorUndoRedo.init
    // called upon instantiation
    init: function(htmlEditor) {
      editor = htmlEditor;

      // add the undo and redo buttons to the toolbar.
      // insert before the sourceedit button
      editor.tb.insertToolsBefore('sourceedit', ['-',
      {
        itemId: 'undo',
        cls: 'x-btn-icon x-edit-undo',
        queryEnabled: ! Ext.isIE,
        handler: Ext.isIE ? this.undo : editor.relayBtnCmd,
        scope: Ext.isIE ? this : editor,
        clickEvent: 'mousedown',
        tooltip: {
          title: 'Undo (Ctrl+Z)',
          text: 'Undo the last edit.',
          cls: 'x-html-editor-tip'
        }
      }, {
        itemId: 'redo',
        cls: 'x-btn-icon x-edit-redo',
        queryEnabled: ! Ext.isIE,
        handler: Ext.isIE ? this.redo : editor.relayBtnCmd,
        scope: Ext.isIE ? this : editor,
        clickEvent: 'mousedown',
        tooltip: {
          title: 'Redo (Ctrl+Y)',
          text: 'Redo the last edit.',
          cls: 'x-html-editor-tip'
        }
      }, '-']);

      // IE only: set up event listeners
      if (Ext.isIE) {
        
        // set element listeners on render
        editor.on('render', function() {

          // monitor for ctrl-z (undo) and ctrl-y (redo) keys
          var keyCommands = [{
            key: 'z',
            ctrlKey: true,
            fn: this.undo,
            scope: this
          }, {
            key: 'y',
            ctrlKey: true,
            fn: this.redo,
            scope: this
          }];
          new Ext.KeyMap(editor.getEditorBody(), keyCommands);

          // record changed data when in source edit mode
          editor.el.on('keyup', this.record, this);
        }, this);

        // record changed data when saved back to element
        editor.on('sync', function() {
          if (ignore) {
            ignore = false;
          }
          else {
            this.record();
          }
        }, this);
        
        // perform maintenance when edit mode has changed
        editor.on('editmodechange', function() {

          // set a placeholder when source edit mode is selected
          if (editor.sourceEditMode) {
            placeholder = index;
          }
  
          // else record all changes made in source edit mode as a
          // single historic entry.
          // note: undo/redo functions continue to work while in
          // source edit mode (even when undoing changes made before
          // the mode was changed), but those made while in source
          // edit mode are no longer available once source edit mode
          // is exited as they can appear undesirable or meaningless
          // when in normal edit mode, so they are rolled together
          // to form a single historic change
          else {

            // if changes were made while in source edit mode then
            if (index > placeholder) {
  
              // if starting point was lost to history then
              if (placeholder < 0) {

                // record all source edit mode changes as first
                // historic record
                placeholder == 0;
                history[placeholder] = history[index];
              }

              // else check to see if data has actually changed
              // while in source edit mode then
              else if (history[placeholder].content != history[index].content) {
    
                // record all source edit mode changes as single
                // historic record, to follow last record change
                // made in normal edit mode
                placeholder++;
                history[placeholder] = history[index];
              }

              // reset index and count to placeholder
              index = placeholder;
              count = index;
            }

            // if no changes were made then reset count as it
            // may have grown if changes were made and reversed
            else {
              count = placeholder;
            }
  
            // update the undo/redo buttons on the toolbar
            updateToolbar();
          }
        } , this);
      }
    },
    
    // IE only: record changes to data
    record: function() {

      // get the current html content from the element
      var content = editor.el.dom.value;

      // if no historic records exist yet or content has
      // changed since the last record then
      if (index == 0 || history[index].content != content) {

        // if size of rollbacks has been reached then drop
        // the oldest record from the array
        if (count == volume) {
          history.shift();
          placeholder--;
        }

        // else increment the index
        else {
          index++;
        }

        // record the changed content and cursor position
        history[index] = {
          content: content,
          bookmark: editor.doc.selection.createRange().getBookmark()
        };
        count = index;
      }

      // update the undo/redo buttons on the toolbar
      updateToolbar();
    },
    
    // IE only: perform the undo
    undo: function() {

      // ensure that there is data to undo
      if (index > 1) {

        // decrement the index
        index--;

        // if in source edit mode then update the element directly
        if (editor.sourceEditMode) {
          resetElement();
        }

        // else update the editor body
        else {
          reset();

          // ignore next record request as syncValue is called
          // by Ext.form.HtmlEditor.updateToolBar and we don't
          // want our undo reversed again
          ignore = true;

          // update the editor toolbar and return focus
          editor.updateToolbar();
          editor.deferFocus();
        }

        // update the undo/redo buttons on the toolbar
        updateToolbar();
      }
    },

    // IE only: perform the redo
    redo: function() {

      // ensure that there is data to redo
      if (index < count) {

        // increment the index
        index++;

        // if in source edit mode then update the element directly
        if (editor.sourceEditMode) {
          resetElement();
        }

        // else update the editor body
        else {
          reset();

          // ignore next record request as syncValue is called
          // by Ext.form.HtmlEditor.updateToolBar and we don't
          // want our redo reversed again
          ignore = true;

          // update the editor toolbar and return focus
          editor.updateToolbar();
          editor.deferFocus();
        }

        // update the undo/redo buttons on the toolbar
        updateToolbar();
      }
    }
  }
}
