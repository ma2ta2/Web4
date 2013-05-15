$(document).ready(function() {

var options = {
 chart: {
 renderTo: 'container',
 defaultSeriesType: 'line',
 marginRight: 130,
 marginBottom: 25,
 	 
  zoomType: 'x',
  spacingRight: 20
 },
 title: {
 style: {
 color: 'skyblue'
 },
 text: '物価上昇率'
 },
 plotOptions: {
 	line: {connectNulls : true},
 	series: {
        marker: {
            enabled: false,
            states: {
                hover: {
                    enabled: true
                }
            }
        }
	}
 },
 
 legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'top',
    y: 150,
    floating: true,
    borderWidth: 1,
    backgroundColor: '#FFFFFF'
 },
 xAxis: {
 categories: []
 },
 yAxis: {
 title: {
 style: {
 color: 'skyblue'
 },
 text: '%'
 },
 labels: {
	formatter: function() {
		return this.value;
	}
 },
 plotLines: [
 {
 value: 0,
 width: 2,
 color: 'red'
 }
 ]
 },
 series: []
 }
var flag;
var series = {data: []};
 $.get('../data/cpi_data.csv', function(data) {
 // Split the lines
 var lines = data.split('\n');
 
 // Iterate over the lines and add categories or series
 $.each(lines, function(lineNo, line) {
	 var items = line.split(',');
	 
	 /*
	 if(lineNo == 0) {
	 		 $.each(items, function(itemNo, item) {
			 	 if(itemNo > 0){
				 	series.name = item;
				 }
			 });
	 }*/
	 $.each(items, function(itemNo, item) {
		 if(lineNo == 0) {
	 		 $.each(items, function(itemNo, item) {
			 	 if(itemNo > 0){
				 	series.name = item;
				 }
			 });
		 } else if(itemNo == 0) {
			 if((item.substring(5,7)) ==("01")){	//if(flag==0||flag==1||flag%12==0){
		 		options.xAxis.categories.push(item.substring(2,4));//7
		 		flag=item.substring(5,7);
		 	 } else {options.xAxis.categories.push(" ");
			 }
		 } else {
			 if(item == 0&&series.name=="corecore_cpi"&&flag!="12"){
				series.data.push(null);
			} else {series.data.push(parseFloat(item));}
		 }
	 });
		 
 });
  	 options.series.push(series);

 
 // Create the chart
 var chart = new Highcharts.Chart(options);
 });
 });
 