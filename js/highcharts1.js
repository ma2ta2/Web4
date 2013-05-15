$(document).ready(function() {
    var options = {
        chart: {
            renderTo: 'container0',
            type: 'line',
            zoomType: 'xy',
        },
        title: {
            text: 'inf_def',
        },
        xAxis: {
            categories: []
        },
        yAxis: {
        },
        series: []
    }

    $.get('../data/Xc2cpi.csv', function(data) {
        // Split the lines
         var lines = data.split('\n');

        // Iterate over the lines and add categories or series
        $.each(lines, function(lineNo, line) {
            var items = line.split(',');

            // header line contains categories
            if (lineNo == 0) {
                $.each(items, function(itemNo, item) {
                	options.xAxis.categories.push("12/07");
                });
            }
            // the rest of the lines contain data with their name in the first position
            else {
                var series = {
                    name: 'c2cpi',
                    data: []
                };
                $.each(items, function(itemNo, item) {
                    series.data.push(parseFloat(item));
                });

                options.series.push(series);
            }
        });
    });
    
    $.get('../data/Xfceh2.csv', function(data) {
        // Split the lines
         var lines = data.split('\n');

        // Iterate over the lines and add categories or series
        $.each(lines, function(lineNo, line) {
            var items = line.split(',');

            // header line contains categories
            if (lineNo == 0) {
                $.each(items, function(itemNo, item) {
					options.xAxis.categories.push("12/07");
                });
            }
            // the rest of the lines contain data with their name in the first position
            else {
                var series = {
                    name: 'fech',
                    data: []
                };
                $.each(items, function(itemNo, item) {
                    series.data.push(parseFloat(item));
                });

                options.series.push(series);
            }
        });
    });

    $.get('../data/Xsysh.csv', function(data) {
        // Split the lines
         var lines = data.split('\n');

        // Iterate over the lines and add categories or series
        $.each(lines, function(lineNo, line) {
            var items = line.split(',');

            // header line contains categories
            if (lineNo == 0) {
                $.each(items, function(itemNo, item) {
                    options.xAxis.categories.push("12/07");
                });
            }
            // the rest of the lines contain data with their name in the first position
            else {
                var series = {
                    name: 'sysh',
                    data: []
                };
                $.each(items, function(itemNo, item) {
                    series.data.push(parseFloat(item));
                });

                options.series.push(series);
            }
        });

        // Create the chart
        var chart = new Highcharts.Chart(options)
    });
});