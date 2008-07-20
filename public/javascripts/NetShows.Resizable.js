/**
 * @author Clément GONNET
 * 
 * Extended class of Ext.Resizable to avoid bug with video and maps dragging
 */
NetShows.Resizable = function(element,config){
			NetShows.Resizable.superclass.constructor.call(this,element,config);
		}
		Ext.extend(NetShows.Resizable,Ext.Resizable,{
			destroy: function(removeEl){
				this.proxy.remove();
				this.dd.unreg();
				if (this.overlay) {
					this.overlay.removeAllListeners();
					this.overlay.remove();
				}
				var ps = Ext.Resizable.positions;
				for (var k in ps) {
					if (typeof ps[k] != "function" && this[ps[k]]) {
						var h = this[ps[k]];
						h.el.removeAllListeners();
						h.el.remove();
					}
				}
				if (removeEl) {
					this.el.update("");
					this.el.remove();
				}
			},
		});