const Place = function(data) {
	const self = this;
	this.position = data.location;
	this.title = data.title;
	this.tags = data.tags;
	this.favorite = ko.observable(data.favorite);
	this.favoriteClass = ko.pureComputed(function() {
		return self.favorite() ? 'glyphicon-star' : 'glyphicon-star-empty';
	})

	if (self.favorite()) {
		this.icon = icons.favorite;
	} else {
		this.icon = icons[self.tags[0]];
	};

	this.marker = new google.maps.Marker({
		position: self.position,
		title: self.title,
		icon: self.icon,
		map: map,
		animation: google.maps.Animation.DROP
	});

	this.toggleFavorite = function() {
		if (self.favorite()) {
			self.favorite(false);
			self.icon = icons[self.tags[0]];
			self.marker.setIcon(self.icon);
			data.favorite = false;
			localStorage.locations = JSON.stringify(locations);
			console.log(self.title + ' removed from favorites.');
		} else {
			self.favorite(true);
			this.icon = icons.favorite;
			self.marker.setIcon(self.icon);
			data.favorite = true;
			localStorage.locations = JSON.stringify(locations);
			console.log(self.title + ' added to favorites.');
		};
	};
};


const ViewModel = function() {
	const self = this;
	this.places = [];
	this.filteredMarkers = ko.observableArray([]);
	this.locationsPane = ko.observable(false);
	this.locationsPaneClass = ko.pureComputed(function() {
		return self.locationsPane() ? 'extend' : '';
	});
	this.tags = [
		'Favorites',
		'Landmarks',
		'Restaurants',
		'Coffee',
		'Hiking',
		'Recreation',
		'Historic'
	];

	this.largeInfowindow = new google.maps.InfoWindow();

	if (localStorage.locations) {
		locations = JSON.parse(localStorage.locations);
	};

	locations.forEach(function(place) {
		let newPlace = new Place(place);
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
	};

	this.filterLocations = function(clicked) {
		let clickedTag = clicked.toLowerCase();
		self.hideAllLocations();

		if (clickedTag == 'favorites') {
			self.places.forEach(function(place) {
				if (place.favorite()) {
					self.filteredMarkers.push(place);
					place.marker.setMap(map);
				}
			})
		} else {
			self.places.forEach(function(place) {
				let tagMatch = false;
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
		};
	};

	this.selectMarker = function(clicked) {
		self.locationsPane(false);
		if (clicked.marker) {
			clicked = clicked.marker;
		}

		self.places.forEach(function(place) {
			place.marker.setAnimation(null);
		});

		map.setCenter(clicked.position);
		self.populateInfoWindow(clicked, self.largeInfowindow);
		clicked.setAnimation(google.maps.Animation.BOUNCE);
	};

	this.toggleLocations = function() {
		if (self.filteredMarkers().length == self.places.length) {
			self.hideAllLocations();
		} else {
			self.showAllLocations();
		}
	};

	this.showAllLocations = function() {
		const bounds = new google.maps.LatLngBounds();
		self.filteredMarkers.removeAll();

		self.places.forEach(function(place) {
			place.marker.setMap(map);
			self.filteredMarkers.push(place);
			bounds.extend(place.marker.position);
		});

		map.fitBounds(bounds);
	};

	this.hideAllLocations = function() {
		self.filteredMarkers.removeAll();
		self.places.forEach(function(place) {
			place.marker.setMap(null);
		});
	};

	this.getLocationInfo = function(marker, infowindow) {
		const pointStr = marker.position.toString().slice(1,-1).replace(' ', '');
		const baseUrl = 'https://api.foursquare.com/v2/venues/search';


		$.ajax({
			url: baseUrl,
			data: {
				ll: pointStr,
				client_id: FS_ID,
				client_secret: FS_SECRET,
				v: '20171007',
				query: marker.title
			},
			method: 'GET',
			success: function(response) {
				const venue = response.response.venues[0];
				const result = {
					name: venue.name,
					phone: venue.contact.formattedPhone,
					address: venue.location.formattedAddress
				};
				let contentString ='<h4>' + result.name + '</h4>';

				if (result.phone) {
					contentString += '<p>Phone: ' + result.phone + '</p>';
				}

				if (result.address) {
					contentString += '<p>Address: </p>';
					result.address.forEach(function(line) {
						contentString += '<p>' + line + '</p>';
					});
				}

				contentString += '<p><i>Powered by <a href="http://foursquare.com"' +
					'target="_blank">Foursquare</a></i></p>';

				infowindow.setContent(contentString);
			}
		}).fail(function() {
			alert('Unable to contact Foursquare');
		});
	};

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
	};
};