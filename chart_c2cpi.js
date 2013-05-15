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
 	 line: {connectNulls : true}
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
 $.get('../data/cccpi.csv', function(data) {
 // Split the lines
 var lines = data.split('\n');
 
 // Iterate over the lines and add categories or series
 $.each(lines, function(lineNo, line) {
 var items = line.split(',');
 
 // header line contains categories
 if (lineNo == 0) {
 $.each(items, function(itemNo, item) {
 if (itemNo > 0) {
 	 if((item.substring(5,7)) ==("01")){	//if(flag==0||flag==1||flag%12==0){
 		options.xAxis.categories.push(item.substring(2,4));//7
 		flag=item.substring(5,7);
 	 } else {options.xAxis.categories.push(" ");
 	 }
 }
 });
 }
 // the rest of the lines contain data with their name in the first position
 else {
 var series = {
 data: []
 };
 $.each(items, function(itemNo, item) {
 if (itemNo == 0) {
  // var time = Date.parse(item[0]);
  series.name = item;
 }
 else {
 	if(item == 0&&series.name=="corecore_cpi"&&flag!="12"){
 		series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 }
 });
 
 	options.series.push(series);
 }
 });
 
 // Create the chart
 var chart = new Highcharts.Chart(options);
 });
 });
 