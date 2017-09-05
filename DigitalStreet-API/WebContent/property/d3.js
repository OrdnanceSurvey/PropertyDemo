/**
 * @author MBowerbank
 */

function residentialGraph(dataset){
	var w = 180;
	var h = 100;
	var barPadding = 2;
	var padding = 15;
	
	var x = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) { return d[0]; })])
		.range([0, h]);
	
	var colourScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) { return d[0]; })])
		.range([0, 255]);
		
	var svg = d3.select("#d3 .d3Span")
	            .append("svg")
	            .attr("width", w)
	            .attr("height", h+padding)
	            .attr("style", "margin-bottom: 10px")
	            .append("g");
	
			svg.selectAll("rect")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
			   		return i * (w / dataset.length);
			   })
			   .attr("y", function(d) {
			   		return (h) - x(d[0]);
			   })
			   .attr("width", w / dataset.length - barPadding)
			   .attr("height", function(d) {
			   		return x(d[0]);
			   })
			   .attr("fill", "teal");//function(d){
			   		//return "rgb(255,"+Math.round(colourScale(d))+",0)";
			   //});
	
		svg.selectAll("text.price")
			.data(dataset)
			.enter()
			.append("text")
			.text(function(d) {
				return d[0];
			})
			.attr("x", function(d, i) {
				return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2; 
			})
			.attr("y", function(d) {
				return (h - x(d[0])) + 14;
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "white")
			.attr("text-anchor", "middle");
			
		svg.selectAll("text.label")
			.data(dataset)
			.enter()
			.append("text")
			.text(function(d) {
				return new Date(d[1]).getFullYear();
			})
			.attr("x", function(d, i) {
				return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2; 
			})
			.attr("y", function(d) {
				return (h+padding);
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "black")
			.attr("text-anchor", "middle");
			
	
	for (i = 1; i < dataset.length; i++){
		var firstYear = dataset[0][1];
		var previousYear = dataset[i-1][1];
		var lastYear= dataset[i][1];
		var lifetime = ((dataset[i][0] / dataset[0][0]) *100).toFixed(2);
		var betweenSales = (((dataset[i][0]-dataset[(i-1)][0])/dataset[i-1][0]) *100).toFixed(2);
		if (betweenSales > 0){
			$("#d3 .d3Span").append("From "+previousYear +" to "+lastYear+", price increased <b>" + betweenSales + '%</b> <span class=" fa-arrow-up"  style="color: #339966;"></span><br/>');
		} else {
			$("#d3 .d3Span").append("From "+previousYear +" to "+lastYear+", price decreased <b>" + betweenSales + '%</b> <span class=" fa-arrow-down"  style="color: #C80000;"></span><br/>');
		}
	}
	
	var difference = new Date(lastYear) - new Date(firstYear);
	var yearChange = new Date(difference).getFullYear() - 1970;
	var monthChange = new Date(difference).getMonth();
	
	$("#d3 .d3Span").append("Over "+yearChange+" years, "+monthChange+" months, the property value has changed by <b>" + lifetime + "%</b>");
	
}