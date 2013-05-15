$.get('../data/corecore_cpi.csv', function( data ) {
$.get('../data/data1.csv',function(data2){

    var mydata1 = [];
    var mydata2 = [];
    var csv     = $.csv()( data );  // modified jquery.csv.js
	var csv2 	= $.csv()( data2 );
//  var csv     = $.csv("\t")( data );  // original jquery.csv.js
 
    // read csv file
    $( csv ).each( function() {
	 var time = Date.parse(this[0]);
        mydata1.push( [time, this[1]] );
    });
	$( csv2 ).each( function() {
        mydata2.push( [this[0], this[1]] );
    });
 
  alert( mydata1[ 0 ] );
  alert( mydata2[ 0 ] );
 
    // Highcharts option
    var options = {
        // CSV data 
        series: [
            {
                data: mydata1,
    //          data: [[176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]],
                name: 'data 1',
                color: 'rgba(223, 83, 83, .5)'
            },
            {
                data: mydata2,
                name: 'data2 2',
                color: 'rgba(119, 152, 191, .5)'
            }
        ],
 
        chart: {
            renderTo: 'container', // The same name written in HTML files
            defaultSeriesType: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Highcharts Test'
        },
        subtitle: {
            text: 'hogehoge'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'X axis'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Y axis'
            }
        },
        tooltip: {
            formatter: function() {
                return ''+
                this.x +' unit, '+ this.y +' ul';
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 210000,
            y: 100,
            floating: true,
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        }
    }
 
    // Create the chart
    var chart = new Highcharts.Chart(options);
});});