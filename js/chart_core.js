$.get('../data/corecore_cpi.csv', function( data ) {
    var temperature = [];
    var csv     = $.csv(",", "\n")( data );  // modified jquery.csv.js
 
    // read csv file
    $( csv ).each( function(i, val) {
        // CSVの１行目はヘッダなのでパス
        if (i == 0 | isNaN(val[1])) return;
 
        var time = Date.parse(val[0]);
        temperature.push( [time, val[1]] );
    });
    // Highcharts option
    var options = {
        chart: {
            renderTo: 'amedas_graph',
            defaultSeriesType: 'datetime',
            zoomType: 'x',
            spacingRight: 20
        },
 
        // CSV data
        series: [
            {
                type: 'area',
                name: 'Temperature',
                //pointInterval: 60 * 60,
                data: temperature
            },
        ],
        title: {
            text: 'AMeDAS 気温データ'
        },
        subtitle: {
            text: '地点:府中'
        },
        xAxis: {
            type: 'datetime',
            title: {
                enabled: true,
                text: 'Date'
            },
            maxZoom: 2 * 24 * 3600000
        },
        yAxis: {
            title: {
                text: 'Temperature (Degree)'
            },
            startOnTick: false,
            showFirstLabel: true,
            max: 150,
            min: 0
        },
        tooltip: {
            shared: true,
            formatter: function () {
                return '' + Highcharts.dateFormat('%Y/%m', this.x) + ' : ' + Highcharts.numberFormat(this.points[0].y, 1)+'℃';
             }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                   linearGradient: [0, 0, 0, 300],
                   stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, 'rgba(2,0,0,0)']
                   ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false,
                    //enabled: true,
                    states: {
                       hover: {
                          enabled: true,
                          radius: 2
                       }
                    }
                },
                shadow: false,
                states: {
                   hover: {
                      lineWidth: 1
                   }
                }
            }
        }
    }
 
    // Create the chart
    var chart = new Highcharts.Chart(options);
});