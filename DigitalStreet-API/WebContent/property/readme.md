# Property API Demonstrator

A comprehensive demonstration of the property APIs and what can be achieved with them, displaying their interactivity with other OS APIs such as WMTS Beta, OS Places, and Gazetteer.

## Version History

### V1.6
Brings back all valuations for residential properties. Added in `d3.js` for graph for residential valuations. Changed layout for rebranding. Changed numbers to appear with commas at 1000th mark.

### V1.5
Entire rework of the existing code to handle ambigious polygons and multiple datasets with ambigious keys. Object implementation in the construction of a request. Much more compact, cleaner and concise.

### V1.3
Added nearest search functionality on map click. Gracefully fails AJAX call if security isn't accepted or wrong valuation of property is selected, added a "loading" panel.

### V1.2
Rewrote the code to be object orientated, focuses around the `apiConstructor`. Can differentiate between polygons and multilinestrings. Added a shortcut for quick access to allow exception necessary for demo to work. Added waterway and residential search. Added JQuery fade in and outs for better user experience.

### V1.1
Brought the UX more in line with OS expectations. Separated commercial and residential valuation.

### V1.0
Changed the demonstrator to bring back multiple API calls on button clicks. Separated the calls into Building Information, Geographical Hazards, Valuation.

## Object Request Structure

```javascript
$("#button_id").on( "click", function() {
	var name_here = new apiConstructor({
		building:{
			endpoint:"",
			features:[""],
			div: "",
			geometry:{
				identifier:"geometry", //<-- name of key in json
				type:"", //<-- polygon/multilinestring etc
				colour:"",
				projection:27700
			}
		},
		panelInformation:{
			title: "",
			panelId: ""
		}
	});
});

$("#button_id").on( "click", function() {
	var name_here = new apiConstructor({
		rail:{
			endpoint:"",
			features:[""],
			div: ""
		},
		panelInformation:{
			title: "",
			panelId: ""
		}
	});
});
```
