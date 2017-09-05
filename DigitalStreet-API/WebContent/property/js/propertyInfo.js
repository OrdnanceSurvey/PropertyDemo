/*global $, i, y, UPRN */
/*jslint plusplus: true */

var test, testing, output, apiObj;

var active = {
	activePanel: "",
	activeDiv: []
};

//$(document).ready(function() {


	function apiConstructor(apiObj) {
		test = apiObj;
		UPRN = apiObj.uprn;
		if (active.activePanel.length > 0) {

			$('#' + active.activePanel).fadeOut(function() {
				$('.ajaxError').fadeOut();
				$('#d3').hide(function() {
					$('#d3 .d3Span').empty();
				});
				$('.loading').fadeIn();
				for (i = 0; i < active.activeDiv.length; i++) {
					$('.' + active.activeDiv[i]).hide();
					$('.' + active.activeDiv[i]).children("li").children().empty();
				}
				for (i = 0; i < active.activeDiv.length; i++) {
					if ($('.' + active.activeDiv[i]).length > 1) {
						var staticLength = $('.' + active.activeDiv[i]).length;
						for (y = 1; y < staticLength; y++) {
							$('.' + active.activeDiv[i] + ':last').remove();
						}
					}
				}
				active.activeDiv = [];
			});
		}
		else {
			$('.loading').fadeIn();
		}

		//Replace panel title and the UPRN
		if (typeof UPRN !== 'undefined') {
			$('#panelTitle').empty().append(apiObj.panelInformation.title);
			$('#UPRN').empty().append(UPRN);
			//Remove all but base layer and marker
		//	for (i = map.getLayers().getArray().length; i > 2; i--) {
		//		map.getLayers().pop();
//			}

			ajaxOutput = {
				geometry: []
			};
			storage = [];
			header = "";
			for (i = 0; i < Object.keys(apiObj).length; i++) {
				ajaxOutput[Object.keys(apiObj)[i]] = [];
				if (typeof apiObj[Object.keys(apiObj)[i]].endpoint !== "undefined") {
					var url = apiObj[Object.keys(apiObj)[i]].endpointPrefix + apiObj[Object.keys(apiObj)[i]].version + "/properties/" +UPRN + apiObj[Object.keys(apiObj)[i]].endpoint + "?key=" + apikey;
					var params = apiObj[Object.keys(apiObj)[i]];
					header = Object.keys(apiObj)[i];
					makeCall(url, apiObj, params, header);
				}
			}
		}
		else {
			window.alert("UPRN not set - choose an address");
			$('.loading').fadeOut();
			$(".searchBox").focus();
		}

		//Cycle through URL's

		function makeCall(url, apiObj, params, header) {
			header = header;
			$.getJSON(url, function(data) {
					testing = data;
					for (key in data) {
						$('.' + header).show();
						if (typeof data[key] == "object" && !(data[key] instanceof Array)) {
							var obj = {};
							//drill down
							for (index in params.features) {
								obj[params.features[index]] = data[key][params.features[index]];
							}
							storage.push(obj);
						}
						else if (data[key] instanceof Array) {
							//handle arrays
							var obj = {};
							var temp = [];
							for (index in params.features) {
								// params.features[index]; // what is needed
								var param = params.features[index];
								obj[param] = [];
								for (val in data[key]) {
									obj[param].push(data[key][val][param]);
								}
							}
							for (key in obj) {
								for (i = 0; i < obj[key].length; i++) {
									hold = {};
									if (typeof storage[i] == "undefined") {
										storage[i] = hold;
									}
									storage[i][key] = obj[key][i];
								}
							}
						}
					}
				})
				.fail(function() {
					$('.loading').fadeOut();
					$('#no_info').fadeIn();
					$('.ajaxError').fadeIn();
				});
		}; //Make Call End 


		$(document).ajaxStop(function() {
			populatePanels();


			function populatePanels() {
				//Geometry
				for (key in test) {
					var type = key;
					console.log("key = " + key);
					if (typeof test[key].geometry !== "undefined") {
						var geoIdent = test[key].geometry.identifier;
						var projection = test[key].geometry.projection;
						var colour = test[key].geometry.colour;
						var type = test[key].geometry.type;
						for (index in storage) {	
							for (key in storage[index]) {
								if (key == geoIdent) {
									console.log("adding feature");
									//omnivore.wkt.parse(storage[index][key]).addTo(map);
									//TODO geo overlay
									//var format = new ol.format.WKT();
									//var feature = format.readFeature(storage[index][key]);
									//console.log(feature)
									//delete storage[index][key];
									//console.log(projection);
									//if (projection !== 3857) {
									//	feature.getGeometry().transform('EPSG:' + projection, 'EPSG:3857');
									//}
									//layer = new ol.layer.Vector({
									//	name: new Date().getTime(), //Note that the layer name will be a unique string
									//	source: new ol.source.Vector({
									//		features: [feature]
									//	}),
									//	style: new polygonStyle(colour)
									//});
									//map.addLayer(layer);
									//var new_extent = layer.getSource().getExtent();
									//map.getView().fit(new_extent, map.getSize());
								}
							}
						}
					}

				}

/*

				if (typeof ajaxOutput.geometry !== "undefined" && ajaxOutput.geometry.length > 0) {
					console.log("if not ajaxoutput undefined called")
					console.log(ajaxOutput)
					if (ajaxOutput.geometry[0].type !== "point") {
							console.log(ajaxOutput.geometry)
						for (i = 0; i < ajaxOutput.geometry.length; i++) {
							var format = new ol.format.WKT();
							var feature = format.readFeature(ajaxOutput.geometry[i].coordinates);

							if (ajaxOutput.geometry[i].projection !== 27700) {
								feature.getGeometry().transform('EPSG:' + ajaxOutput.geometry[i].projection, 'EPSG:27700');
							}

							layer = new ol.layer.Vector({
								name: new Date().getTime(), //Note that the layer name will be a unique string
								source: new ol.source.Vector({
									features: [feature]
								}),
								style: new polygonStyle(ajaxOutput.geometry[i].colour)
							});
							// Add the new layer to the map and fit to extent of the new layer
							map.addLayer(layer);
							var new_extent = layer.getSource().getExtent();
							map.getView().fit(new_extent, map.getSize());
						}
					}
					else {
						listedBuildings();
					}
				}
				
				*/

				//Populate Output Panel

				if (storage.length > 0) {
					//Populate spans
					for (index in storage) {
						for (key in storage[index]) {
							$('.' + key).empty().append(storage[index][key]);
						}
					}
				
					$('#' + test.panelInformation.panelId).show();
				}
				//sort out display (show()) nonsense	
			if (Object.keys(ajaxOutput).length > 0) {
				
				console.log("Object.keys(ajaxOutput).length > 0 called")
					for (key in apiObj) {
						if (typeof apiObj[key]['div'] !== 'undefined' && typeof ajaxOutput[key] !== "undefined") {
							console.log(apiObj[key]['div'])
							active.activeDiv.push(apiObj[key]['div']);
							
							
							
							for (i = 0; i < ajaxOutput[key].length; i++) {
								if (i < 1) {
									for (k in ajaxOutput[key][i]) {
										$('.' + apiObj[key]['div'] + ' .' + k).empty().append(ajaxOutput[key][i][k].toLocaleString());

									}
								}
								else {
									$("." + apiObj[key]['div'] + ':last').clone().appendTo("#" + apiObj.panelInformation.panelId);
									for (k in ajaxOutput[key][i]) {
										$('.' + apiObj[key]['div'] + ' .' + k + ':last').empty().append(ajaxOutput[key][i][k].toLocaleString());

									}
								}
							} 
							$('.' + apiObj[key]['div']).fadeIn();
						}
					} 
					$('.loading').fadeOut(function() {
						$('#' + apiObj.panelInformation.panelId).fadeIn();
						active.activePanel = apiObj.panelInformation.panelId;
					});
				} 
				for (key in ajaxOutput) {
					if (key == "residential") {
						console.log("if key == residential called" )
						if (ajaxOutput.residential.length > 0) {
							for (var i = 0; i <= ajaxOutput.residential.length; i++) {
								dataset.unshift([ajaxOutput.residential[i]['AMOUNT'], ajaxOutput.residential[i]['DATE']]);
							}
							residentialGraph(dataset);
							$('#d3').fadeIn();
						}
					}
			}
			}

			$(document).off('ajaxStop');
		});
	}

	function polygonStyle(input) {
		this.red = 'rgba(255,0,0,0.3)';
		this.blue = 'rgba(0,0,255,0.3)';
		this.green = 'rgba(0,128,0,0.3)';
		this.teal = 'rgba(0,128,128,0.3)';
		this.navy = 'rgba(0,0,128,0.3)';
		this.maroon = 'rgba(128,0,0,0.3)';
		this.pastelGreen = 'rgba(135,181,136,0.3)';
		this.pastelBlue = 'rgba(8, 72, 203, 0.3)';

		var style = new ol.style.Style({
			fill: new ol.style.Fill({
				color: this[input]
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(60,60,60,0.5)',
				width: 1
			})
		});
		return style;
	};


	/****
	 * Insert buttons and object here
	 * 
	 * 
	 */
/*

	$("#buildingInfo").click(function() {
		var building_information = new apiConstructor({
			building: {
				version: "beta",
				endpoint: "/dimensions",
				features: ["calculatedAreaValue", "coordinates"],
				div: "building",
				geometry: {
					identifier: "coordinates",
					type: "polygon",
					colour: "pastelBlue",
					projection: 27700
				}
			},
			rail: {
				version: "v1",
				endpoint: "/title-deeds/lookup",
				features: ["titleNumber", "DISTANCE"],
				div: "rail"
			},
			panelInformation: {
				title: "Building Information",
				panelId: "building_information"
			}
		});
	}); */

	$("#geoHazards").click(function() {
		var geoInformation = new apiConstructor({
			subsidence: {
				endpoint: "bgs/subsidence/",
				features: ["SSWELL", "COMP", "LANDSLIDE", "SOLUB", "RSAND", "COLLAPS", "TOTAL", "GMDIVAM", "CLASS", "coordinates"],
				div: "subsidence",
				geometry: {
					identifier: "coordinates",
					type: "polygon",
					colour: "red",
					projection: 4326
				}
			},
			flood: {
				endpoint: "flooding/ea_nafra/",
				features: ["PROB_4BAND", "SUITABILITY", "PUB_DATE", "RISK_FOR_INSURANCE_SOP"],
				div: "flood",
				geometry: {
					identifier: "coordinates",
					type: "polygon",
					colour: "blue",
					projection: 27700
				}
			},
			panelInformation: {
				title: "Geographic Hazard Information",
				panelId: "geohazard_information"
			}
		});
	});

	$("#resValuation").click(function() {
		var resValuation = new apiConstructor({
			residential: {
				endpoint: "price-paid/uprn/",
				features: ["AMOUNT", "DATE"],
				div: "price_paid"
			},
			panelInformation: {
				title: "Residential Valuation",
				panelId: "residential_valuation"
			}
		});
	});

	$("#valuation").click(function() {
		var valuation = new apiConstructor({
			commercial: {
				endpoint: "valuation/commercial/",
				features: ["fromDate", "totalArea", "rateableValue", "subValue", "totalValue", "listYear", "firm", "numbName", "county", "street", "town"],
				div: "commercial"
			},
			panelInformation: {
				title: "Commercial Valuation",
				panelId: "commercial_valuation"
			}
		});
	});

	$("#nearestWater").click(function() {
		var waterway = new apiConstructor({
			waterway: {
				endpoint: "nearest-waterway/waterway/",
				features: ["WATER_NAME", "CATCH_NAME", "DISTANCE"],
				div: "waterway",
				geometry: {
					identifier: "COORDS",
					type: "MULTISTRING",
					colour: "blue",
					projection: 4326
				}
			},
			panelInformation: {
				title: "Nearest Waterway",
				panelId: "nearest_waterway"
			}
		});
	});

	$("#listedBuildings").click(function() {
		var listed = new apiConstructor({
			listedBuildings: {
				version: "v1",
				endpoint: "/listed-buildings/radius",
				features: ["GRADE", "LISTDATE", "LISTENTRY", "NAME", "NGR"],
				div: "listed",
				geometry: {
					identifier: "coordinates",
					type: "point",
					colour: "blue",
					projection: 27700
				}
			},
			panelInformation: {
				title: "Listed Buildings",
				panelId: "listed_buildings"
			}
		});
	});



//});