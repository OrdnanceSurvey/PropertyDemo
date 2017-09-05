var OS = new L.TileLayer(
		'https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/{tilematrixSet}/{layer}/{z}/{x}/{y}.{imgFormat}?key={apikey}',
		{
			apikey : apikey,
			tilematrixSet : 'EPSG:27700',
			layer : 'Road 27700',
			imgFormat : 'png',
			continuousWorld : true
		});

var baseMaps = {
	"Ordnance Survey" : OS
};

var epsg27700 = "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs";
var crs = new L.Proj.CRS('EPSG:27700', epsg27700, {
	transformation : new L.Transformation(1, 238375, -1, 1376256),
	resolutions : [ 896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5,
			1.75, 0.875, 0.4375, 0.21875, 0.109375 ],
});

var map = L.map('map', {
	crs : crs,
	layers : OS,
	zoomControl : true,
	maxZoom : 13,
	minZoom : 0,
	center : ([ 51.507222, -0.1275 ]),
	zoom : 4
});

L.control.layers(baseMaps).addTo(map);
var geocoder = L.Control.geocoder(
		{
			geocoder : new L.Control.Geocoder.OSPlaces(
					'yVnhiP8vTfAK91SaUOS38psVzuzgZKVa'),
			placeholder : "Search addresses"
		}).addTo(map);

var left = '<h1>Details</h1>';
var contents = '<hr>';
contents += '<ul class="pricing-table" id="building_information" style="display:none;">';
contents += '	<li class="title" >Building Information</li>';
contents += '	<div class="building" style="display: none">';
contents += '		<li class="bullet-item">Area: <span class="calculatedAreaValue"></span></li>';
contents += '	</div>';
contents += '	<div class="rail" style="display: none">';
contents += '		<li class="bullet-item">Closet Railway: <span class="titleNumber"></span></li>';
contents += '	</div>';
contents += '</ul>';

L.control.slideMenu(left + contents).addTo(map);