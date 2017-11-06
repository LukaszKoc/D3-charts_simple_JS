'use strict'
this.TableController = function () {
	this.areaId = null;
	
	var $area = null;
	var width = null;
	var height = null;
	var headerData= null;
	var columns = null;
	var margin = {top: 10, right: 10, bottom: 10, left: 10};
	this.onclick = function () {};

	this.init = function (params) {
		params = params || {};
		
		this.areaId = params.areaId;
		$area = document.querySelector("#" + this.areaId);
		this.setUpSize();
		params.onClick && (this.onclick = params.onClick);
		columns = params.columns
		headerData =params.headerData;
		this.renderTable(params.data, columns);
	}
	
	this.reload = function(data) {
		$area.innerHtml = "";
		d3.select("#" + this.areaId).select("table").remove();
		$area.innerHTML = "";
		this.renderTable(data, columns);
	}
	
  this.renderTable = function(data, columns) {
	// params:
		
	//	width = 600 - margin.left - margin.right;
	//	height = 600 - margin.top - margin.bottom;
		
		var table = d3.select("#" + this.areaId).append('table').attr("width", width)
	 	 .attr("height", height + margin.top + margin.bottom);
		var thead = table.append('thead');
		var	tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(headerData).enter()
		  .append('th')
		  	.attr("width", "120px")
		    .text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr')
		  .on('click',this.onclick)
		  
		  
		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		  	.attr("width", "120px")
		    .text(function (d) { return d.value; });

		
		
	  return table;
	};

	this.setUpSize = function() {
		$area.innerHTML = "";
		width = $area.offsetWidth;
		height = $area.offsetHeight;
	}

};
this.TableController.call(TableController);
	

