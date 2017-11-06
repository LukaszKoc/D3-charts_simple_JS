'use strict'
this.LinearGraphController = function (){

	var $area = null;
	var width = null;
	var height = null;
	var radius = null;
	var localData = null;
	var dataNames = null;
	var year = null;
	
	var margin = {top: 20, right: 60, bottom: 60, left: 60};
	
	this.init = function(params) {
		params = params || {};
	
		this.areaId = params.areaId;
		$area = document.querySelector("#" + this.areaId);
		$area.innerHTML = "";
		this.setUpSize();
		dataNames = params.dataNames;
		year = params.year;
		this.mapper(params.data,  dataNames, year)
		
		this.drowSVG();
	}
	
	this.reload = function(data, year) {
		$area.innerHtml = "";
		this.mapper(data,  dataNames, year)
		this.drowSVG();
	}
	
	this.mapper = function (data, dataNames, year) {
		localData = [];
		data.forEach(function (elem){
			localData.push({
				date: new Date("01-" + elem[dataNames.label]+'-'+ year),
				open: elem[dataNames.value1],	
				close: elem[dataNames.value2]	
			})
		});
	}
	
	this.setUpSize = function() {
		width = $area.offsetWidth;
		height = $area.offsetHeight;
	}
	
	this.drowSVG = function () {
		//clearing area from old svg
		//dont works ...
		//TODO clear it
		
		d3.select("#" + this.areaId).select("svg").remove();
		$area.innerHTML = "";
		
		
		var parseDate = d3.time.format("%d-%b-%y").parse;
		
		var min =  d3.min(
			[
				d3.min(localData, function(d) { return d.open; }),
				d3.min(localData, function(d) { return d.close; })
			])
		var max =  d3.max(
			[
				d3.max(localData, function(d) { return d.open; }),
				d3.max(localData, function(d) { return d.close; })
			])
		
		var x = d3.time.scale()
			.range([0, width- margin.right - margin.left])
		 	.domain(d3.extent(localData, function(d) { return d.date; }));
		 	
		var y = d3.scale.linear()
			.range([height- margin.top - margin.bottom, 0])
			.domain([min, max]);
		
		//	var y1 = d3.scale.linear().range([height, 0]);
	
		var xAxis = d3.svg.axis().scale(x)
	
		    .orient("bottom").ticks(12);
	
		var yAxisLeft = d3.svg.axis().scale(y)
		    .orient("left").ticks(5);
	
		var yAxisRight = d3.svg.axis().scale(y)
		    .orient("right").ticks(5); 
	
		var valueline = d3.svg.line()
		    .x(function(d) { return x(d.date); })
		    .y(function(d) { return y(d.close); })
		    
		var valueline2 = d3.svg.line()
		    .x(function(d) { return x(d.date); })
		    .y(function(d) { return y(d.open); });
		  
		var svg = d3.select("#" + this.areaId)
			.append("g")
			    .append("svg")
			    	.attr("class", "linear")
			        .attr("width", width)
			        .attr("height", height)
		    .append("g")
		        .attr("transform", 
		              "translate(" + margin.left + "," + margin.top + ")");
	
		// Get the data
		
	
		    // Scale the range of the data
	
			var path = svg.append("path")        // Add the valueline path.
		        .attr("d", valueline(localData))
		        .style("stroke", "steelblue")
		    	.style("stroke-width", "2")
		    	.style("fill", "none")
		    	.attr("id", "visualization")
		    	.attr("xmlns", "http://www.w3.org/2000/svg")
		   
	    	var totalLength = path.node().getTotalLength();

		    path
		      .attr("stroke-dasharray", totalLength + " " + totalLength)
		      .attr("stroke-dashoffset", totalLength)
		      .transition()
		        .duration(1000)
		        .ease("linear")
		        .attr("stroke-dashoffset", 0);
		   
		    var path2 = svg.append("path")        // Add the valueline2 path.
		        .style("stroke", "red")
		    	.style("stroke-width", "2")

		    	.style("fill", "none")
		    	.attr("d", valueline2(localData));
		    path2
		      .attr("stroke-dasharray", totalLength + " " + totalLength)
		      .attr("stroke-dashoffset", totalLength)
		      .transition()
		        .duration(1000)
		        .ease("linear")
		        .attr("stroke-dashoffset", 0);	
		    
    
		    
		    svg.append("g")            // Add the X Axis
		        .attr("class", "x axis")
		        .attr("transform", "translate(0," + (height- margin.top -margin.bottom) + ")")
		        .call(xAxis);
	
		    svg.append("g")
		        .attr("class", "y axis")
		        .style("fill", "steelblue")
		        .call(yAxisLeft);	
	
		    svg.append("g")				
		        .attr("class", "y axis")	
		        .attr("transform", "translate(" + (width- margin.left -margin.right) + " ,0)")	
		        .style("fill", "red")	
		        
		        .call(yAxisRight);
		    
		    
		    var focus = svg.append("g")
		      .attr("class", "focus")
		      .style("display", "none");

		    focus.append("circle")
		      .attr("r", 4.5);

		    focus.append("text")
		      .attr("x", 9)
		      .attr("dy", ".35em");
	       
		    
		    
   
            
        // now rotate text on x axis
        // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
        // first move the text left so no longer centered on the tick
        // then rotate up to get 45 degrees.
        svg.selectAll(".x text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
         });

	}
	
	

};
LinearGraphController.call(LinearGraphController)