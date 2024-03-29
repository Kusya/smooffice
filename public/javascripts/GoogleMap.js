/**
 * @author Clément GONNET & Samuel GARNIER
 * GoogleMap class file
 */
var GoogleMap = function(element,attrs){
	var el;
	var zoom = attrs.zoom||17;
	msg_log(attrs.markers);
	var markers = attrs.markers||new Array();
	var center = attrs.center?new GLatLng(attrs.center.y,attrs.center.x):new GLatLng(54.56997, -1.23608);
	
	// A AddAMarkerControl is a GControl that displays a marker
	
	// We define the function first
	function AddAMarkerControl(){
	}
	
	// To "subclass" the GControl, we set the prototype object to
	// an instance of the GControl object
	AddAMarkerControl.prototype = new GControl();
	
	// Creates a one DIV for each of the buttons and places them in a container
	// DIV which is returned as our control element. We add the control to
	// to the map container and return the element for the map class to
	// position properly.
	AddAMarkerControl.prototype.initialize = function(el){
		var container = document.createElement("div");
		
		var addAMarkerDiv = document.createElement("div");
		this.setButtonStyle_(addAMarkerDiv);
		container.appendChild(addAMarkerDiv);
		addAMarkerDiv.appendChild(document.createTextNode("Marker"));
		
		var onClick = false;
		
		
		var buttonClick = GEvent.addDomListener(addAMarkerDiv, "click", function(){
			msg_log("Click where you want to put a marker.");
			
			var mouseClick = GEvent.addListener(el, "click", function(overlay, latlng){
				var marker = new GMarker(latlng, {
					draggable: true
				});
				el.addOverlay(marker);
				
				markers.push([latlng.lat(), latlng.lng()]);
				
				GEvent.removeListener(mouseClick);
				msg_log("A new marker is created.");
				GEvent.addListener(marker, "dragstart", function(){
					el.closeInfoWindow();
				});
				GEvent.addListener(marker, "dragend", function(){
					//msg_log(this.latlng.lat());
				});
			});
		});
		el.getContainer().appendChild(container);
		return container;
	}
	
	// By default, the control will appear in the top left corner of the
	// map with 7 pixels of padding.
	AddAMarkerControl.prototype.getDefaultPosition = function(){
		return new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(100, 7));
	}
	
	// Sets the proper CSS for the given button element.
	AddAMarkerControl.prototype.setButtonStyle_ = function(button){
		button.style.textDecoration = "bold";
		button.style.color = "black";
		button.style.backgroundColor = "white";
		button.style.font = "Small Arial";
		button.style.border = "1px solid black";
		button.style.padding = "2px";
		button.style.marginBottom = "5px";
		button.style.textAlign = "center";
		button.style.width = "4em";
		button.style.cursor = "pointer";
	}
	
		if (GBrowserIsCompatible()) {
			// Create a Map
			el = new GMap2(element);
			
			// Center the map
			el.setCenter(center, zoom);
			
			// Type of map
			el.setMapType(G_HYBRID_MAP);
			
			// Add markers if exist
			for (var i = 0; i < markers.length; i++) {
				var marker = new GMarker(new GLatLng(markers[i][0], markers[i][1]), {
					draggable: true
				});
				el.addOverlay(marker);
				
				GEvent.addListener(marker, "dragstart", function(){
					el.closeInfoWindow();
				});
				GEvent.addListener(marker, "dragend", function(){
					//msg_log(latlng.lat());
				});
			}
			
			// Controls //
			el.addControl(new GLargeMapControl());
			el.addControl(new GMapTypeControl());
			el.addControl(new AddAMarkerControl());
			// bind a search control to the map, suppress result list
			var bottomRight = new GControlPosition(G_ANCHOR_BOTTOM_RIGHT, new GSize(5, 15));
			el.addControl(new google.maps.LocalSearch(), bottomRight);
		}
	this.getContent = function(){		
		return {
			markers: markers,
			center: {
				x: el.getCenter().x,
				y: el.getCenter().y
			},
			zoom: el.getZoom()
		};
	}
	//GSearch.setOnLoadCallback(this.load);
}