var map;


function initMap () {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 33.925909, lng: -84.5589789},
		zoom: 13,
		styles: style,
		streetViewControl: false
	});
}

function initialize() {
	initMap();
	ko.applyBindings(new ViewModel());
}