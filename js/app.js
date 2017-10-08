var map;
var fsId = 'K2WU2L1MMFXQIPLQRTC5KBCXYPTPZTEZCLIEZ55CZB1LQ0FN';
var fsSecret = 'IF2N15UIYJ3XBMGRD3KC5RDHXF15IUJVJVSY52HYN0YJJMID';


function initMap() {
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