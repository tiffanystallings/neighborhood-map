// Store the map, infowindow, and bounds globally for access
// by other functions.
let map;
let largeInfoWindow;
let bounds;

// Store the Foursquare client information.
const FS_ID = 'K2WU2L1MMFXQIPLQRTC5KBCXYPTPZTEZCLIEZ55CZB1LQ0FN';
const FS_SECRET = 'IF2N15UIYJ3XBMGRD3KC5RDHXF15IUJVJVSY52HYN0YJJMID';

/**
* Initialize a new Google map in the #map div.
*/
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 33.925909, lng: -84.5589789},
		zoom: 13,
		styles: style,
		streetViewControl: false
	});

	// Create an empty bounds array.
	bounds = new google.maps.LatLngBounds();

	// Establish a blank infowindow to alter later.
	largeInfoWindow = new google.maps.InfoWindow();

	// As suggested by my first Udacity reviewer -- fit bounds on window
	// resize.
	google.maps.event.addDomListener(window, 'resize', function() {
		map.fitBounds(bounds);
	});
}

/**
* Runs on callback from the google maps Javascript async request.
* Initializes the map and the ViewModel.
*/
function initialize() {
	initMap();
	ko.applyBindings(new ViewModel());
}

// Wait 10 seconds and check if map initialized. Alert user if not.
function googleError() {
	alert('There was an error loading Google Maps.');
}