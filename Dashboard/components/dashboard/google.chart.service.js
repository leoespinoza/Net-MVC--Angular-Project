'use strict';

// GoogleChartService : ChartService, contains functions for rendering a variety of dashboard chart tiles (Google Visualization API implementation)
//
// drawDonutChart ............. renders a Google Visualization donut chart
// drawPieChart ............... renders a Google Visualization pie chart
// drawColumnChart ............ renders a Google Visualization column chart
// drawBarChart ............... renders a Google Visualization bar chart
// drawTableChart ............. renders a Google Visualization table chart

dashboardApp.service('ChartService', function ($http) {

    var COLOR_RGB_BLUE = 'RGB(69,97,201)';
    var COLOR_RGB_RED = 'RGB(210,54,54)';
    var COLOR_RGB_ORANGE = 'RGB(247,152,33)'
    var COLOR_RGB_GREEN = 'RGB(45,151,34)';
    var COLOR_RGB_PURPLE = 'RGB(148,36,151)';
    var COLOR_RGB_CYAN = 'RGB(53,224,222)'; 
    var COLOR_RGB_YELLOW = 'RGB(252,209,255)';
    var COLOR_RGB_BLACK = 'RGB(0,0,0)';
    var COLOR_RGB_GRAY = 'RGB(127,127,127)';
    var COLOR_RGB_WHITE = 'RGB(255,255,255)';

    var chartPalette = [COLOR_RGB_BLUE, COLOR_RGB_RED, COLOR_RGB_ORANGE, COLOR_RGB_GREEN, COLOR_RGB_PURPLE, COLOR_RGB_CYAN, COLOR_RGB_YELLOW, COLOR_RGB_BLACK, COLOR_RGB_GRAY, COLOR_RGB_WHITE,
                        COLOR_RGB_BLUE, COLOR_RGB_RED, COLOR_RGB_ORANGE, COLOR_RGB_GREEN, COLOR_RGB_PURPLE, COLOR_RGB_CYAN, COLOR_RGB_YELLOW, COLOR_RGB_BLACK, COLOR_RGB_GRAY, COLOR_RGB_WHITE];

    this.chartProvider = function () {
        return 'Google';
    }

    // -------------------- drawDonutChart : Draw a Google Visualization donut chart ------------------

    this.drawDonutChart = function (self, elementId) {
        var index = getTileIndexFromId(elementId);
        var tile = self.tiles[index];

        if (!tile.type || !tile.value || !tile.dataSource) return;

        // Convert the tile's column and value properties (both 1-dimensional arrays) to the data structure Google expects:
        // [ heading1, heading2 ]
        // [ label1, value1 ]
        // [ labelN, valueN ]

        var newValues = [];
        var dataTable = tile.value;
        if (dataTable != null) {
            for (var i = 0; i < dataTable.length; i++) {
                if (i == 0) {
                    newValues.push([ 'Label1', 'Label2' ]);
                }
                newValues.push([ tile.columns[i], tile.value[i] ]);
            }
            dataTable = newValues;
        }

        if (dataTable === null) {
            dataTable = [];
        }

        try {
            var data = google.visualization.arrayToDataTable(dataTable);

            var options = {
                pieHole: 0.4,
                backgroundColor: 'transparent',
                enableInteractivity: false  // this is to ensure drag and drop works unimpaired on mobile devices
            };

            if (tile.width == 1 && tile.height==1) { /* if 1xn tile, suppress legend */
                options.legend = 'none';
                options.chartArea = { top: 0, left: '100px', width: '95%', height: '75%' }
            }
            else if (tile.width == 2 && tile.height == 1) { /* if 2x1 tile, legend at right */
                options.legend = {
                    position: 'right',
                    maxLines: 10,
                },
                options.legendPosition = 'right';
                options.legendTextStyle = {
                    color: tile.textColor // 'white'
                };
                options.chartArea = { top: 0, left: 0, width: '95%', height: '75%' }
            }
            else if (tile.width == 1 && tile.height == 2) { /* if 1x2 tile, legend at top TODO: why doesn't legend appear? */
                options.legend = {
                    position: 'top',
                    maxLines: 10,
                },
                options.legendPosition = 'top';
                options.legendTextStyle = {
                    color: tile.textColor // 'white'
                };
            }
            else { /* 2x2 */
                options.legend = {
                    position: 'top',
                    maxLines: 10,
                },
                options.legendPosition = 'top';
                options.legendTextStyle = {
                    color: tile.textColor // 'white'
                };
            }

            var chart = new google.visualization.PieChart(document.getElementById(elementId));
            chart.draw(data, options);
        }
        catch (e) {
            console.log('exception ' + e.toString());
        }
    }

    // -------------------- drawPieChart : Draw a Google Visualization pie chart ------------------

    this.drawPieChart = function (self, elementId) {

        var index = getTileIndexFromId(elementId);
        var tile = self.tiles[index];

        if (!tile.type || !tile.value || !tile.dataSource) return;

        // Convert the tile's column and value properties (both 1-dimensional arrays) to the data structure Google expects:
        // [ heading1, heading2 ]
        // [ label1, value1 ]
        // [ labelN, valueN ]

        var newValues = [];
        var dataTable = tile.value;
        if (dataTable != null) {
            for (var i = 0; i < dataTable.length; i++) {
                if (i == 0) {
                    newValues.push(['Label1', 'Label2']);
                }
                newValues.push([tile.columns[i], tile.value[i]]);
            }
            dataTable = newValues;
        }

        if (dataTable === null) {
            dataTable = [];
        }

        //console.log('GoogleChartService.drawPieChart 02');

        try {
            var data = google.visualization.arrayToDataTable(dataTable);

            //console.log('GoogleChartService.drawPieChart 03');

            var options = {
                //pieHole: 0.4,
                backgroundColor: 'transparent',
                enableInteractivity: false  // this is to ensure drag and drop works unimpaired on mobile devices
            };

            if (tile.width == 1 && tile.height == 1) { /* if 1xn tile, suppress legend */
                options.legend = 'none';
                options.chartArea = { top: 0, left: '100px', width: '95%', height: '75%' }
            }
            else if (tile.width == 2 && tile.height == 1) { /* if 2x1 tile, legend at right */
                options.legend = {
                    position: 'right',
                    maxLines: 10
                },
                options.legendPosition = 'right';
                options.legendTextStyle = {
                    color: tile.textColor // 'white'
                };
                options.chartArea = { top: 0, left: 0, width: '95%', height: '75%' }
            }
            else if (tile.width == 1 && tile.height == 2) { /* if 1x2 tile, legend at top TODO: why doesn't legend appear? */
                options.legend = {
                    position: 'top',
                    maxLines: 10,
                    alignment: 'start'
                    //width: '200px'
                },
                options.legendPosition = 'top';
                options.legendTextStyle = {
                    color: tile.textColor // 'white'
                };
            }
            else { /* 2x2 */
                options.legend = {
                    position: 'top',
                    maxLines: 10,
                },
                options.legendPosition = 'top';
                options.legendTextStyle = {
                    color: tile.textColor // 'white'
                };
            }

            //console.log('GoogleChartService.drawPieChart 03');

            var chart = new google.visualization.PieChart(document.getElementById(elementId));
            chart.draw(data, options);

            //console.log('GoogleChartService.drawPieChart 99');
        }
        catch (e) {
            console.log('exception ' + e.toString());
        }
    }

    // -------------------- drawColumnChart : Draw a Google Visualization column chart ------------------

    this.drawColumnChart = function (self, elementId) {
        var index = getTileIndexFromId(elementId);
        var tile = self.tiles[index];

        if (!tile.type || !tile.value || !tile.dataSource) return;

        // Convert the tile's column and value properties (both 1-dimensional arrays) to the data structure Google expects:
        // [ heading1, heading2 ]
        // [ label1, value1 ]
        // [ labelN, valueN ]

        var newValues = [];
        var dataTable = tile.value;
        if (dataTable != null) {
            for (var i = 0; i < dataTable.length; i++) {
                if (i == 0) {
                    newValues.push(['Element', 'Density' ]);
                }
                //newValues.push([ tile.columns[i], tile.value[i] ]);
                if (tile.hasOwnProperty('format')) {
                    newValues.push([tile.columns[i], { v: tile.value[i], f: tile.format.replace("{0}", tile.value[i].toString()) }]);
                }
                else {
                    newValues.push([tile.columns[i], tile.value[i]]);
                }
            }
            dataTable = newValues;
        }

        if (dataTable === null) {
            dataTable = [];
        }

        try {
            // Get tile data and expand to include assigned bar colors.

            var colors = chartPalette; // [COLOR_RGB_BLUE, COLOR_RGB_RED, COLOR_RGB_ORANGE, COLOR_RGB_GREEN, COLOR_RGB_PURPLE, COLOR_RGB_CYAN, COLOR_RGB_YELLOW];
            var maxColorIndex = colors.length;
            var colorIndex = 0;

            var tileData = dataTable;
            var newTileData = [];
            if (tileData != null) {
                for (var i = 0; i < tileData.length; i++) {
                    if (i == 0) {
                        newTileData.push([ tileData[i][0], tileData[i][1], { role: 'style' } ]);
                    }
                    else {
                        var color = colors[colorIndex++];
                        if (colorIndex >= maxColorIndex) colorIndex = 0;
                        newTileData.push([tileData[i][0], tileData[i][1], color]);
                    }
                }
            }

            var data = google.visualization.arrayToDataTable(newTileData);

            var options = {
                colors: ['red', 'yellow', 'blue'],
                backgroundColor: 'transparent',
                legend: 'none',
                vAxis: {
                    minValue: 0,
                    gridlines: {
                        color: tile.textColor
                    },
                    textStyle: {
                        color: tile.textColor
                    }
                },
                hAxis: {
                    minValue: 0,
                    gridlines: {
                        color: tile.textColor
                    },
                    textStyle: {
                        color: tile.textColor
                    }
                },
                enableInteractivity: false  // this is to ensure drag and drop works unimpaired on mobile devices
            };

            options.chartArea = { top: 0, left: 0, width: '100%', height: '70%' }

            if (tile.width == 1) { /* if 1xn tile, suppress legend */
                options.chartArea = { top: 0, left: 0, width: '100%', height: '70%' }
            }
            else if (tile.width == 2 && tile.height == 1) { /* if 2x1 tile, legend at right */
                options.chartArea = { top: 0, left: 0, width: '100%', height: '70%' }
            }
            else if (tile.width == 1 && tile.height == 2) { /* if 1x2 tile, legend at top */
                options.chartArea = { top: 0, left: 0, width: '100%', height: '80%' }
            }
            else { /* if 2x2 tile, legend at top */
                options.chartArea = { top: 0, left: 30, width: '100%', height: '80%' }
            }

            var view = new google.visualization.DataView(data); // Create a custom view so values are displayed near the top of each bar.
            view.setColumns([0, 1,
                             {
                                 calc: "stringify",
                                 sourceColumn: 1,
                                 type: "string",
                                 role: "annotation"
                             },
                             2]);

            var chart = new google.visualization.ColumnChart(document.getElementById(elementId));
            chart.draw(view, options);
        }
        catch (e) {
            console.log('exception ' + e.toString());
        }
    }

    // -------------------- drawBarChart : Draw a Google Visualization bar chart ------------------

    this.drawBarChart = function (self, elementId) {
        var index = getTileIndexFromId(elementId);
        var tile = self.tiles[index];

        if (!tile.type || !tile.value || !tile.dataSource) return;

        // Convert the tile's column and value properties (both 1-dimensional arrays) to the data structure Google expects:
        // [ heading1, heading2 ]
        // [ label1, value1 ]
        // [ labelN, valueN ]

        var newValues = [];
        var dataTable = tile.value;
        if (dataTable != null) {
            for (var i = 0; i < dataTable.length; i++) {
                if (i == 0) {
                    newValues.push(['Element', 'Density']);
                }
                //newValues.push([tile.columns[i], tile.value[i]]);
                if (tile.hasOwnProperty('format')) {
                    newValues.push([tile.columns[i], { v: tile.value[i], f: tile.format.replace("{0}", tile.value[i].toString()) }]);
                }
                else {
                    newValues.push([tile.columns[i], tile.value[i]]);
                }
            }
            dataTable = newValues;
        }

        if (dataTable === null) {
            dataTable = [];
        }

        try {
            // Get tile data and expand to include assigned bar colors.

            var colors = chartPalette; // [COLOR_RGB_BLUE, COLOR_RGB_RED, COLOR_RGB_ORANGE, COLOR_RGB_GREEN, COLOR_RGB_PURPLE, COLOR_RGB_CYAN, COLOR_RGB_YELLOW];
            var maxColorIndex = colors.length;
            var colorIndex = 0;

            var tileData = dataTable;
            var newTileData = [];
            if (tileData != null) {
                for (var i = 0; i < tileData.length; i++) {
                    if (i == 0) {
                        newTileData.push([tileData[i][0], tileData[i][1], { role: 'style' }]);
                    }
                    else {
                        var color = colors[colorIndex++];
                        if (colorIndex >= maxColorIndex) colorIndex = 0;
                        newTileData.push([tileData[i][0], tileData[i][1], color]);
                    }
                }
            }

            var data = google.visualization.arrayToDataTable(newTileData);

            var options = {
                colors: ['red', 'yellow', 'blue'],
                backgroundColor: 'transparent',
                legend: 'none',
                vAxis: {
                    minValue: 0,
                    gridlines: {
                        color: tile.textColor
                    },
                    textStyle: {
                        color: tile.textColor
                        //fontSize: 10
                    }
                    //textPosition: "in"
                },
                hAxis: {
                    minValue: 0,
                    gridlines: {
                        color: tile.textColor
                    },
                    textStyle: {
                        color: tile.textColor
                    }
                },
                enableInteractivity: false  // this is to ensure drag and drop works unimpaired on mobile devices
            };

            options.chartArea = { top: 0, left: 60, width: '100%', height: '70%' }

            if (tile.width == 1) { /* if 1xn tile, suppress legend */
                options.chartArea = { top: 0, left: 60, width: '100%', height: '70%' }
            }
            else if (tile.width == 2 && tile.height == 1) { /* if 2x1 tile, legend at right */
                options.chartArea = { top: 0, left: 60, width: '100%', height: '70%' }
            }
            else if (tile.width == 1 && tile.height == 2) { /* if 1x2 tile, legend at top */
                options.chartArea = { top: 0, left: 30, width: '100%', height: '80%' }
            }
            else { /* if 2x2 tile, legend at top */
                options.chartArea = { top: 0, left: 60, width: '100%', height: '80%' }
            }

            var view = new google.visualization.DataView(data); // Create a custom view so values are displayed near the top of each bar.
            view.setColumns([0, 1,
                             {
                                 calc: "stringify",
                                 sourceColumn: 1,
                                 type: "string",
                                 role: "annotation"
                             },
                             2]);

            var chart = new google.visualization.BarChart(document.getElementById(elementId));
            chart.draw(view, options);
        }
        catch (e) {
            console.log('exception ' + e.toString());
        }
    }

    // ------------------ drawTableChart : Draw a Google Visualization table chart ------------------

    this.drawTableChart = function (self, elementId) {
        var pos = -1;                       // convert tile-xxxx-n to index n-1
        var text = elementId;
        while ((pos = text.indexOf('-')) != -1) {
            text = text.substring(pos + 1);
        }
        var index = parseInt(text) - 1;
        var tile = self.tiles[index];

        var dataTable = self.tiles[index].value;
        if (dataTable === null) {
            dataTable = [];
        }

        try {
            var options = {
                cssClassNames: {
                    headerCell: 'tableChartCell',
                    tableCell: 'tableChartCell',
                },
                height: '85%', // 85% 20-high, '70%' 1-high
                width: '100%',
                page: 'enable',
                enableInteractivity: false  // this is to ensure drag and drop works unimpaired on mobile devices
            };

            if (tile.height == 1) {
                options.height = '70%';
            }
            else if (tile.height == 2) {
                options.height = '85%';
            }

            var chart = new google.visualization.Table(document.getElementById(elementId));

            var data = new google.visualization.DataTable();

            var columns = self.tiles[index].columns;
            if (columns != null) {
                for (var c = 0; c < columns.length; c++) {
                    data.addColumn(columns[c][1], columns[c][0]);
                }
            }

            data.addRows(dataTable);

            chart.draw(data, options);
        }
        catch (e) {
            console.log('exception ' + e.toString());
        }
    }

    //------------------ getTileIndexFromId : return the tile index of a tile element Id (tile-1 => 0, tile-2 => 1, etc.) -------------------

    // given a tile rendering area id like tile-donut-1, return index (e.g. 0)

    function getTileIndexFromId(elementId) {
        var pos = -1;
        var text = elementId;
        while ((pos = text.indexOf('-')) != -1) {
            text = text.substring(pos + 1);
        }
        var index = parseInt(text) - 1;
        return index;
    }

});
