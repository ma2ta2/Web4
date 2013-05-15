$(document).ready(function() {



 var options = {
 chart: {
 renderTo: 'container',
 defaultSeriesType: 'line',
 },
 title: {
 text: 'inf_def'
 },
 xAxis: {
 categories: []
 },
 yAxis: {
 title: {
 text: '%'
 },
 	 labels: {
			formatter: function() {
	return Date.parse(this.value);
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

 $.get('../data/inf_data.csv', function(data) {
 // Split the lines
 var lines = data.split('\n');
 
 // Iterate over the lines and add categories or series
 $.each(lines, function(lineNo, line) {
 var items = line.split(',');
 
 // header line contains categories
 if (lineNo == 0) {
 $.each(items, function(itemNo, item) {
 if (itemNo > 0) options.xAxis.categories.push(item.substring(2));
 });
 }
 /*$( csv ).each( function(i, val) {
        // CSVの１行目はヘッダなのでパス
        if (i == 0 | isNaN(val[1])) return;
 
        var time = Date.parse(val[0]);
        temperature.push( [time, val[1]] );
    });
    var date = moment(graphData.items[i].Date, "yy");
    */
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
 series.data.push(parseFloat(item));
 }
 });
 
 options.series.push(series);
 }
 });
 
 // Create the chart
 var chart = new Highcharts.Chart(options);
 });
 });