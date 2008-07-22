/**
 * @author Clément GONNET
 * 
 * Extended class of Ext.Resizable to avoid bug with video and maps dragging
 */
NetShows.Resizable = function(element,config){
	NetShows.Resizable.superclass.constructor.call(this,element,config);
};
Ext.extend(NetShows.Resizable,Ext.Resizable,{
	destroy: function(removeEl,removeAll){
		this.proxy.remove();
		
		//If removeAll == true then unregister the dd proxy of the element
		if(removeAll)
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
	
	// private
    onMouseMove : function(e){
        if(this.enabled){
            try{// try catch so if something goes wrong the user doesn't get hung

            if(this.resizeRegion && !this.resizeRegion.contains(e.getPoint())) {
                return;
            }

            //var curXY = this.startPoint;
            var curSize = this.curSize || this.startBox;
            var x = this.startBox.x, y = this.startBox.y;
            var ox = x, oy = y;
            var w = curSize.width, h = curSize.height;
            var ow = w, oh = h;
            var mw = this.minWidth, mh = this.minHeight;
            var mxw = this.maxWidth, mxh = this.maxHeight;
            var wi = this.widthIncrement;
            var hi = this.heightIncrement;
            
            var eventXY = e.getXY();
            var diffX = -(this.startPoint[0] - Math.max(this.minX, eventXY[0]));
            var diffY = -(this.startPoint[1] - Math.max(this.minY, eventXY[1]));
            
            var pos = this.activeHandle.position;
            
            switch(pos){
                case "east":
                    w += diffX; 
                    w = Math.min(Math.max(mw, w), mxw);
                    break;
                case "south":
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case "southeast":
                    w += diffX; 
                    h += diffY;
                    w = Math.min(Math.max(mw, w), mxw);
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case "north":
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case "west":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    x += diffX;
                    w -= diffX;
                    break;
                case "northeast":
                    w += diffX; 
                    w = Math.min(Math.max(mw, w), mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case "northwest":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    x += diffX;
                    w -= diffX;
                    break;
               case "southwest":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    x += diffX;
                    w -= diffX;
                    break;
            }
            
            var sw = this.snap(w, wi, mw);
            var sh = this.snap(h, hi, mh);
            if(sw != w || sh != h){
                switch(pos){
                    case "northeast":
                        y -= sh - h;
                    break;
                    case "north":
                        y -= sh - h;
                        break;
                    case "southwest":
                        x -= sw - w;
                    break;
                    case "west":
                        x -= sw - w;
                        break;
                    case "northwest":
                        x -= sw - w;
                        y -= sh - h;
                    break;
                }
                w = sw;
                h = sh;
            }
            
            if(e.shiftKey){
                switch(pos){
                    case "southeast":
                    case "east":
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h/oh);
                       break;
                    case "south":
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                        break;
                    case "northeast":
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                    break;
                    case "north":
                        var tw = w;
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                        x += (tw - w) / 2;
                        break;
                    case "southwest":
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        var tw = w;
                        w = ow * (h/oh);
                        x += tw - w;
                        break;
                    case "west":
                        var th = h;
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        y += (th - h) / 2;
                        var tw = w;
                        w = ow * (h/oh);
                        x += tw - w;
                       break;
                    case "northwest":
                        var tw = w;
                        var th = h;
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h/oh);
                        y += th - h;
                         x += tw - w;
                       break;
                        
                }
            }
            this.proxy.setBounds(x, y, w, h);
            if(this.dynamic){
                this.resizeElement();
            }
            }catch(e){}
        }
    },

});