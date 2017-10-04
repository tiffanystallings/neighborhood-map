var map;
var drawingManager;
var polygon = null;
var markers = [];


function initMap () {
	largeInfowindow = new google.maps.InfoWindow();

	drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.POLYGON,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_LEFT,
			drawingModes: [
				google.maps.drawing.OverlayType.POLYGON
			]
		}
	});

	drawingManager.addListener('overlaycomplete', function(event) {
		if (polygon) {
			polygon.setMap(null);
			hideLocations();
		}

		drawingManager.setDrawingMode(null);

		polygon = event.overlay;
		calculateArea(polygon);
		polygon.setEditable(true);

		searchWithinPolygon();

		polygon.getPath().addListener('set_at', searchWithinPolygon);
		polygon.getPath().addListener('insert_at', searchWithinPolygon);
	});

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 33.925909, lng: -84.5589789},
		zoom: 13,
		styles: style,
		streetViewControl: false
	});

	for (var i=0; i<locations.length; i++) {
		var position = locations[i].location;
		var title = locations[i].title;
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});

		markers.push(marker);

		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
	}

	function populateInfoWindow (marker, infowindow) {
		if (infowindow.marker != marker) {
			infowindow.setContent('');
			infowindow.marker = marker;
		}

		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});

		var streetViewService = new google.maps.StreetViewService();
		var radius = 50;

		function getStreetView (data, status) {
			infowindow.setContent('Loading...');
			if (status == 'OK') {
				var nearStreetViewLocation = data.location.latLng;
				var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
				
				infowindow.setContent('<div>' + marker.title + '</div>' + '<div id="pano"></div>');
				var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
				panorama.setPano(data.location.pano);
				panorama.setPov({
					heading: heading,
					pitch: 20
				});
				panorama.setVisible(true);
			} else {
				console.log('request failed');
				infowindow.setContent('<div>' + marker.title + '</div>' +
					'<div>No Street View Found</div>');
			}
		}

		streetViewService.getPanorama({location: marker.position, radius: radius}, getStreetView);
		console.log('sent request');
		infowindow.open(map, marker);
	}
}