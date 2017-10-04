document.getElementById('show-locs').addEventListener('click', showLocations);
document.getElementById('hide-locs').addEventListener('click', hideLocations);
document.getElementById('toggle-draw').addEventListener('click', function() {
	toggleDrawing(drawingManager);
});

function showLocations () {
	var bounds = new google.maps.LatLngBounds();

	for (var i=0; i<markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}

	map.fitBounds(bounds);
}

function hideLocations () {
	for (var i=0; i<markers.length; i++) {
		markers[i].setMap(null);
	}
}

function toggleDrawing (drawingManager) {
	if (drawingManager.map) {
		drawingManager.setMap(null);
		if (polygon) {
			polygon.setMap(null);
		}
	} else {
		drawingManager.setMap(map);
	}
}

function searchWithinPolygon () {
	for (var i=0; i<markers.length; i++) {
		if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
			markers[i].setMap(map);
		} else {
			markers[i].setMap(null);
		}
	}
}

function calculateArea (polygon) {
	var vertices = polygon.getPath();
	sqMeters = google.maps.geometry.spherical.computeArea(vertices);
	acres = sqMeters * 0.000247105;

	console.log(acres);
}

ko.applyBindings(new ViewModel());