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
	this.locationsPane = ko.observable(false);
	this.locationsPaneClass = ko.pureComputed(function() {
		return self.locationsPane() ? "extend" : "";
	});
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

	this.toggleLocationsPane = function() {
		if (self.locationsPane()) {
			self.locationsPane(false);
		} else {
			self.locationsPane(true);
		}
	}

	this.filterLocations = function(clicked) {
		var clickedTag = clicked.toLowerCase();
		self.hideAllLocations();

		self.places.forEach(function(place) {
			var tagMatch = false;
			place.tags.forEach(function(tag) {
				if(tag == clickedTag) {
					tagMatch = true;
				}
			});

			if (tagMatch) {
				self.filteredMarkers.push(place);
				place.marker.setMap(map);
			}
		});
	}

	this.selectMarker = function(clicked) {
		self.locationsPane(false);
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
		self.filteredMarkers.removeAll();

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

	this.getLocationInfo = function(marker, infowindow) {
		var pointStr = marker.position.toString().slice(1,-1).replace(' ', '');
		var baseUrl = 'https://api.foursquare.com/v2/venues/search';


		$.ajax({
			url: baseUrl,
			data: {
				ll: pointStr,
				client_id: fsId,
				client_secret: fsSecret,
				v: '20171007',
				query: marker.title
			},
			method: 'GET',
			success: function(response) {
				var venue = response.response.venues[0]
				var result = {
					name: venue.name,
					phone: venue.contact.formattedPhone,
					address: venue.location.formattedAddress
				}
				var contentString ='<h4>' + result.name + '</h4>';

				if (result.phone) {
					contentString += '<p>Phone: ' + result.phone + '</p>';
				}

				if (result.address) {
					contentString += '<p>Address: </p>'
					result.address.forEach(function(line) {
						contentString += '<p>' + line + '</p>';
					});
				}

				contentString += '<p><i>Powered by <a href="http://foursquare.com"' +
					'target="_blank">Foursquare</a></i></p>'

				infowindow.setContent(contentString);
			}
		}).fail(function() {
			alert('Unable to contact Foursquare');
		});
	}

	this.populateInfoWindow = function(marker, infowindow) {
		if (infowindow.marker != marker) {
			infowindow.setContent('');
			infowindow.marker = marker;
		}

		infowindow.addListener('closeclick', function() {
			marker.setAnimation(null);
			infowindow.marker = null;
		});

		self.getLocationInfo(marker, infowindow);
		infowindow.open(map, marker);
	}
}