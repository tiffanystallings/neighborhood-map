var Place = function(data) {
	var self = this;
	this.position = data.location;
	this.title = data.title;
	this.tags = data.tags;
	this.favorite = ko.observable(data.favorite);
	this.marker = new google.maps.Marker({
		position: self.position,
		title: self.title,
		map: map,
		animation: google.maps.Animation.DROP
	});
}

var ViewModel = function() {
	var self = this;
	this.places = [];
	this.filteredMarkers = ko.observableArray([]);
	this.tags = [
		'Landmarks',
		'Restaurants',
		'Coffee',
		'Hiking',
		'Recreation',
		'Historic'
	];

	this.largeInfowindow = new google.maps.InfoWindow();

	locations.forEach(function(place) {
		var newPlace = new Place(place);
		newPlace.marker.addListener('click', function() {
			self.selectMarker(this);
		});
		self.places.push(newPlace);
		self.filteredMarkers.push(newPlace);
	});

	this.selectMarker = function(clicked) {
		if (clicked.marker) {
			clicked = clicked.marker;
		}
		for (var i = 0; i < self.places.length; i++) {
    			self.places[i].marker.setAnimation(null);
			}
		map.setCenter(clicked.position);
		self.populateInfoWindow(clicked, self.largeInfowindow);
		clicked.setAnimation(google.maps.Animation.BOUNCE);
	}

	this.toggleLocations = function() {
		if (self.filteredMarkers().length == self.places.length) {
			self.hideAllLocations();
		} else {
			self.showAllLocations();
		}
	}

	this.showAllLocations = function() {
		var bounds = new google.maps.LatLngBounds();

		for (var i=0; i<self.places.length; i++) {
			self.places[i].marker.setMap(map);
			self.filteredMarkers.push(self.places[i].marker);
			bounds.extend(self.places[i].marker.position);
		}

		map.fitBounds(bounds);
	}

	this.hideAllLocations = function() {
		self.filteredMarkers.removeAll();
		self.places.forEach(function(place) {
			place.marker.setMap(null);
		})
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