'use strict'
this.GaugeController = function () {

	var screenWidth = null;
	var $area = null;
	var margin = {left: 20, top: 20, right: 20, bottom: 20};
	var width = null;
	var height = null;
	var donutData = [];
		
	this.init = function (params) {
		d3.select("#" + this.areaId).select("svg").remove();
		params = params || {};
		this.areaId = params.areaId;
		
		if(params.data){
			donutData = params.data;
		};
		$area = document.querySelector("#" + this.areaId);
		this.setUpSize();
		this.drowSVG();

	}
	
	this.reload = function(data) {
		$area.innerHtml = "";
		d3.select("#" + this.areaId).select("svg").remove();
		
		$area.innerHtml = "";
		donutData = data;
		this.drowSVG();
	}
	
	this.setUpSize = function() {
		$area.innerHTML = "";
		
		screenWidth = $area.offsetWidth;
		width =  $area.offsetWidth;
		height = $area.offsetHeight;
		margin = {left: 20, top: 35, right: 20, bottom: 15};
			width = Math.min(screenWidth, width) - margin.left - margin.right;
			height = Math.min(screenWidth, height) - margin.top - margin.bottom;
		width = height = Math.min(width, height);
	}
	this.drowSVG = function() {	
		
		var svg = d3.select("#" + this.areaId).append("svg")
					.attr("width", (width + margin.left + margin.right))
					.attr("id", "donut")
					.attr("height", (height + margin.top + margin.bottom))
				   .append("g").attr("class", "wrapper")
					.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
	
		////////////////////////////////////////////////////////////// 
		///////////////////// Data &  Scales ///////////////////////// 
		////////////////////////////////////////////////////////////// 
	

	
		//Create a color scale
		var colorScale = d3.scale.linear()
		   .domain([1,2])
		   .range(["#e60000", "#40bfbf"])
		   .interpolate(d3.interpolateHcl);
	
		//Create an arc function   
		var arc = d3.svg.arc()
			.innerRadius(width*0.75/2) 
			.outerRadius(width*0.75/2 + 30);
	
		//Turn the pie chart 90 degrees counter clockwise, so it starts at the left	
		var pie = d3.layout.pie()
			.startAngle(-90 * Math.PI/180)
			.endAngle(-90 * Math.PI/180 + 2*Math.PI)
			.value(function(d) { return d.value; })
			.padAngle(.01)
			.sort(null)
			
		 
		////////////////////////////////////////////////////////////// 
		//////////////////// Create Donut Chart ////////////////////// 
		////////////////////////////////////////////////////////////// 
	
		//Create the donut slices and also the invisible arcs for the text 
		svg.selectAll(".donutArcs")
			.data(pie(donutData))
		  .enter().append("path")
			.attr("class", "donutArcs")
			.attr("d", arc)
			.style("fill", function(d,i) {
				return colorScale(i); 
			})
		.each(function(d,i) {
			//Search pattern for everything between the start and the first capital L
			var firstArcSection = /(^.+?)L/; 	
	
			//Grab everything up to the first Line statement
			var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
			//Replace all the comma's so that IE can handle it
			newArc = newArc.replace(/,/g , " ");
			
			//If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
			//flip the end and start position
			if (d.endAngle > (90 * Math.PI/180)) {
				var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
					middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
					endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
				//Flip the direction of the arc by switching the start en end point (and sweep flag)
				//of those elements that are below the horizontal line
				if(!endLoc.exec( newArc ))
				var newStart = newArc.split("0 1 1")[1];
				var newEnd = newArc.split("M")[1].split("A")[0];
				var middleSec = newArc.split("A")[1].split("0 1 1")[0];
				
				//Build up the new arc notation, set the sweep-flag to 0
				newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
			}//if
			
			//Create a new invisible arc that the text can flow along
			var path = svg.append("path")
				.attr("class", "hiddenDonutArcs")
				.attr("id", "donutArc"+i)
				.attr("d", newArc)
				.style("fill", "none")
				.transition()
		        .duration(1000)
		     
			var totalLength = path.node().getTotalLength();
			path
		      .attr("stroke-dasharray", totalLength + " " + totalLength)
		      .attr("stroke-dashoffset", totalLength)
				.transition()
		        .duration(1000)
		        .ease("linear")
		        .attr("stroke-dashoffset", 0);
			var sum = (donutData[1].value+ donutData[0].value);
			var percentage = {
					used: ((donutData[1].value / sum)*100).toFixed(2),
					fresh:((donutData[0].value / sum)*100).toFixed(2),
			}
			
			svg.append("text")
			   .attr("text-anchor", "middle")
			   .attr("dy", 10)
			   .attr("fill", "red")
			   .text("Used Cars "+ percentage.used + "%")
					
			svg.append("text")
			   .attr("text-anchor", "middle")
			   .attr("dy", -10)
			   .attr("fill", "steelblue")
			   .text("New Cars " + percentage.fresh + "%" );
		});
		

				
		//Append the label names on the outside
		svg.selectAll(".donutText")
			.data(pie(donutData))
		   .enter().append("text")
			.attr("class", "donutText")
			//Move the labels below the arcs for those slices with an end angle greater than 90 degrees
			.attr("dy", function(d,i) { return (d.endAngle > 90 * Math.PI/180 ? 18 : -11); })
		   .append("textPath")
			.attr("startOffset","50%")
			.style("text-anchor","middle")
			.attr("xlink:href",function(d,i){return "#donutArc"+i;})
			.text(function(d){return d.data.label;});
	}
};

window.GaugeController.call(this.GaugeController);