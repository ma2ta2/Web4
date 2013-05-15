$(function () {
 var mydata=[];
 $.get('../data/corecore_cpi.csv', function (data) {
  var csv = $.csv()(data);
  $(csv).each(function () {
   mydata.push( [parseFloat( this[0] ),
    parseFloat( this[1] ),
    parseFloat( this[2] ),
    parseFloat( this[3] ),
    parseFloat( this[4] ),
    parseFloat( this[5] ),
    parseFloat( this[6] ),
    parseFloat( this[7] ),
    parseFloat( this[8] ),
    parseFloat( this[9] ),
    parseFloat( this[10] ),
    parseFloat( this[11] )
    ] );
  })

  var chart;
  chart = new Highcharts.Chart({
   chart: {
    renderTo: 'container',
    type: 'line'
   },
   title: {
    text: 'Monthly Average Temperature'
   },
   subtitle: {
    text: 'Source: WorldClimate.com'
   },
   xAxis: {
    categories: ['1月', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
   },
   yAxis: {
    title: {
     text: 'Temperature (°C)'
    }
   },
   tooltip: {
    enabled: false,
    formatter: function () {
     return '<b>' + this.series.name + '</b>' + this.x + ': ' + this.y + '°C';
    }
   },
   plotOptions: {
    line: {
     dataLabels: {
      enabled: true
     },
     enableMouseTracking: false
    }
   },
   series: [{
    name: '東京',
    data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
   }, {
    name: '神戸',
    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
   },{
    data: mydata[0],
    name:'sample'
   }]
  });
 });

});