window.DataGenerator = function () {
	
	var baseData = window.baseData;
	this.init = function (params) {
		var data = 	this.formatData(baseData); 
		return data;
	}
	
	this.formatData = function (data) {
		var tempYear = null;
		var row = {
			newCarsNumber : 0,
			usedCarsNumber : 0,
			totalSalesNewValue : 0,
			totalSalesUsedValue : 0,
			monthsData:[]
		};
		var resultData = [];
		data.forEach(function (elem){
			if(elem.Year == tempYear || !tempYear) {
				
				tempYear = elem.Year;
				row.year = elem.Year;
				row.newCarsNumber += parseNumber(elem.New);
				row.usedCarsNumber += parseNumber(elem.Used);
				row.totalSalesNewValue += parseNumber(elem.TotalSalesNew);
				row.totalSalesUsedValue += parseNumber(elem.TotalSalesUsed);
				
				row.monthsData.push({
					month: elem.Month,
					newCarsNumber: parseNumber(elem.New),
					usedCarsNumber: parseNumber(elem.Used),
					totalSalesNewValue: parseNumber(elem.TotalSalesNew),
					totalSalesUsedValue: parseNumber(elem.TotalSalesUsed)
				})
			} else {
				tempYear = elem.Year;
				resultData.push(row);
				row = {
					year: elem.Year,
					newCarsNumber: parseNumber(elem.New),
					usedCarsNumber: parseNumber(elem.Used),
					totalSalesNewValue: parseNumber(elem.TotalSalesNew),
					totalSalesUsedValue: parseNumber(elem.TotalSalesUsed),
					monthsData: [{
						month: elem.Month,
						newCarsNumber: parseNumber(elem.New),
						usedCarsNumber: parseNumber(elem.Used),
						totalSalesNewValue: parseNumber(elem.TotalSalesNew),
						totalSalesUsedValue: parseNumber(elem.TotalSalesUsed)
					}]
				}		
			}
		});
		return resultData;
	}
	
	var parseNumber = function (num) {
		num = num +"0";
		var x =Number(num.replace(/[^\d.-]/g, ''))
		return x;
	}
	
}
window.DataGenerator.call(window.DataGenerator);