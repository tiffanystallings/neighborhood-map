var ViewModel = function() {
	var self = this;
	this.markers = [];
	this.largeInfowindow = new google.maps.InfoWindow();

	for (var i=0; i<locations.length; i++) {
		var position = locations[i].location;
		var title = locations[i].title;
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});

		this.markers.push(marker);

		marker.addListener('click', function() {
			self.selectMarker(this);
		});
	};

	this.selectMarker = function(marker) {
		for (var i = 0; i < self.markers.length; i++) {
    			self.markers[i].setAnimation(null);
			}
		map.setCenter(marker.position);
		self.populateInfoWindow(marker, self.largeInfowindow);
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}

	this.showAllLocations = function() {
		var bounds = new google.maps.LatLngBounds();

		for (var i=0; i<self.markers.length; i++) {
			self.markers[i].setMap(map);
			bounds.extend(self.markers[i].position);
		}

		map.fitBounds(bounds);
	}

	this.hideAllLocations = function() {
		for (var i=0; i<self.markers.length; i++) {
			self.markers[i].setMap(null);
		}
	}

	this.populateInfoWindow = function (marker, infowindow) {
		if (infowindow.marker != marker) {
			infowindow.setContent('');
			infowindow.marker = marker;
		}

		infowindow.addListener('closeclick', function() {
			marker.setAnimation(null);
			infowindow.marker = null;
		});

		var streetViewService = new google.maps.StreetViewService();
		var radius = 50;

		function getStreetView (data, status) {
			if (status == 'OK') {
				var nearStreetViewLocation = data.location.latLng;
				var heading = google.maps.geometry.spherical.computeHeading(
					nearStreetViewLocation, marker.position);
				
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