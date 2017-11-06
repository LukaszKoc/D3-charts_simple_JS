this.MainController = function () {
	var yearsTable = new TableController;
	var monthsTable = new TableController;
	var gaugeController1 = new GaugeController;
	var gaugeController2 = new GaugeController;
	
	
	this.runApp = function () {
		var data = window.DataGenerator.init();
		this.renderYearTable(data);	
		this.renderElements(data[0], true)
		
	}
	
	this.reloadElements =  function (data) {
		
		monthsTable.reload(data.monthsData);
		gaugeController1.reload([
			{value: data.newCarsNumber, label:""}, 
			{value: data.usedCarsNumber, label:""}
		]);
		gaugeController2.reload([
			{value: data.totalSalesNewValue, label:""}, 
			{value: data.totalSalesUsedValue, label:""}
		]);
		LinearGraphController.reload(data.monthsData, data.year);
		document.querySelector("#income").innerHtml = "Total income in "+data.year;
	}
	
	this.renderElements = function (data) {
		this.renderLinearGraph(data.monthsData, data.year);
		this.renderMonthTable(data.monthsData);
		this.renderDonutGraph(data);
		this.renderDonutGraph2(data);
		document.querySelector("#income").innerHtml = "Total income in "+data.year;
	}
	
	this.renderYearTable = function (data) {
		var columns = ['year', 'newCarsNumber', "totalSalesNewValue", 'usedCarsNumber','totalSalesUsedValue'];
		var headerData = ['year', 'sold', 'vale $', "sold",'value $'];
		yearsTable.init({
			data: data,
			columns: columns, 
			headerData: headerData,
			onClick: this.onRowClick.bind(this),
			areaId: "year-table-area"
		});// render the table(s)
	}
	
	this.renderMonthTable = function (data) {
		var columns = ['month', 'newCarsNumber', "totalSalesNewValue", 'usedCarsNumber','totalSalesUsedValue'];
		var headerData = ['month', 'sold', 'vale $', "sold",'value $'];
		monthsTable.init({
			data: data,
			columns: columns,
			headerData: headerData,
			areaId: "month-table-area"
		});// render the table(s)
	};

	this.renderDonutGraph = function(data) {
		var params = {
			areaId: "donut-area1",
			data: [
				{value: data.newCarsNumber, label:""}, 
				{value: data.usedCarsNumber, label:""}
				
			],
			outerRadius: 10,
			innerRadius: 70
		};
		gaugeController1.init(params);
	};
	this.renderDonutGraph2 = function(data) {
		var params = {
			areaId: "donut-area2",
			data: [
				{value: data.totalSalesNewValue, label:""}, 
				{value: data.totalSalesUsedValue, label:""}
				
			],
			outerRadius: 10,
			innerRadius: 70
		};
		gaugeController2.init(params);
	};
		
	this.renderLinearGraph = function(data, year) {
	
		LinearGraphController.init({
			data: data,
			year: year,
			dataNames:{label:"month", value1:"newCarsNumber", value2:"usedCarsNumber"},
			areaId:"line-area",
			outerRadius: 10,
			
			innerRadius: 70
		})
	};
	

	
	this.onRowClick = function (model) {
		this.reloadElements(model);
	}
	
	document.addEventListener("DOMContentLoaded", this.runApp.bind(this));
}
this.MainController.call(MainController);
	


