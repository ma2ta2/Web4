$(function () {
var chart;
$(document).ready(function() {
$.get('../data/corecore_cpi.csv',function(data){
var csv = $.csv()(data);
$(csv).each(function(){
if(this[0] && this[1]){
$("#csv").append("<tr><td>"+this[0]+"</td><td>"+this[1]+"</td><td>");}
});
$.get('../data/data1.csv',function(data){
var mnystk = $.csv()(data);
$.get('../data/fceh.csv',function(data){
	var fceh = $.csv()(data);
		chart = new Highcharts.Chart({
		chart: {renderTo: 'container',type: 'line',marginRight: 130,marginBottom: 25},
		title: {text: 'インフレ？デフレ？',x: -20},subtitle: {
		text: 'マネーストックM２、corecoreCPI、家計最終消費支出　1971年〜',
		x: -20},xAxis: {categories: [csv[0]]},yAxis: {title: {text: '%'},
		plotLines: [{value: 0,width: 1,color: '#808080'}]},
		tooltip: {formatter: function() {return '<b>'+ this.series.name +'</b><br/>'+
		this.x +': '+ this.y +'%';}},legend: {layout: 'vertical',align: 'right',
		verticalAlign: 'top',x: -10,y: 100,borderWidth: 0},
		series: [{name: 'corecoreCPI',data: [csv[1]]}, {
		name: 'money stock',data: [mnystk[1]]}, {name: 'fceh',data: [fceh[1]]}]});});
		chart = new Highcharts.Chart({chart: {renderTo: 'container',type: 'line',
		marginRight: 130,marginBottom: 25},
		title: {text: 'iroiro',x: -20},
		subtitle: {text: 'Source: WorldClimate.com',x: -20},
		xAxis: {categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']},yAxis: {title: {text: 'Temperature (°C)'},
		plotLines: [{value: 0,width: 1,color: '#808080'}]},tooltip: {formatter: function() {
		return '<b>'+ this.series.name +'</b><br/>'+this.x +': '+ this.y +'°C';}},
		legend: {layout: 'vertical',align: 'right',verticalAlign: 'top',x: -10,y: 100,
		borderWidth: 0},series: [{name: 'Tokyo',
		data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]}, {
		name: 'New York',
		data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]}, {
		name: 'Berlin',
		data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]}, {
		name: 'London',
		data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]}]
});});});});
});