'use strict';

// ChartJSChartService : ChartService, contains functions for rendering a variety of dashboard chart tiles (chart.js implementation)
//
// drawDonutChart ................. renders a Chart.js donut chart
// drawPieChart ................. renders a Chart.js pie chart
// drawColumnChart ................ renders a Chart.js column chart
// drawColumnBar .................. renders a Chart.js bar chart

dashboardApp.service('ChartService', function ($http) {

    var COLOR_RGB_BLUE = 'RGB(69,97,201)';
    var COLOR_RGB_RED = 'RGB(210,54,54)';
    var COLOR_RGB_ORANGE = 'RGB(247,152,33)'
    var COLOR_RGB_GREEN = 'RGB(45,151,34)';
    var COLOR_RGB_PURPLE = 'RGB(148,36,151)';
    var COLOR_RGB_CYAN = 'RGB(53,224,222)';
    var COLOR_RGB_YELLOW = 'RGB(252,209,22)';
    var COLOR_RGB_BLACK = 'RGB(0,0,0)';
    var COLOR_RGB_GRAY = 'RGB(127,127,127)';
    var COLOR_RGB_WHITE = 'RGB(255,255,255)';

    var chartPalette = [COLOR_RGB_BLUE, COLOR_RGB_RED, COLOR_RGB_ORANGE, COLOR_RGB_GREEN, COLOR_RGB_PURPLE, COLOR_RGB_CYAN, COLOR_RGB_YELLOW, COLOR_RGB_BLACK, COLOR_RGB_GRAY, COLOR_RGB_WHITE,
                        COLOR_RGB_BLUE, COLOR_RGB_RED, COLOR_RGB_ORANGE, COLOR_RGB_GREEN, COLOR_RGB_PURPLE, COLOR_RGB_CYAN, COLOR_RGB_YELLOW, COLOR_RGB_BLACK, COLOR_RGB_GRAY, COLOR_RGB_WHITE];

    this.chartProvider = function () {
        return 'ChartJS';
    }

    // -------------------- drawDonutChart : Draw a Chart.js donut chart --------------------

    this.drawDonutChart = function (self, elementId) {

        var index = getTileIndexFromId(elementId);
        var tile = self.tiles[index];

        if (!tile || !tile.type || !tile.value || !tile.dataSource) return;

        var ctx = document.getElementById(elementId).getContext('2d');

        var options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: 'true',
                position: 'top',
                labels: {
                    fontColor: tile.textColor
                }
            },
            title: { display: false },
            animation: {
                //    animateScale: true,
                //    animateRotate: true
                duration: 500,
                easing: "easeOutQuart",
                onComplete: function () {       // Add labels and percent over slices
                    var ctx = this.chart.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset) {

                        for (var i = 0; i < dataset.data.length; i++) {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                                start_angle = model.startAngle,
                                end_angle = model.endAngle,
                                mid_angle = start_angle + (end_angle - start_angle) / 2;

                            var x = mid_radius * Math.cos(mid_angle);
                            var y = mid_radius * Math.sin(mid_angle);

                            ctx.fillStyle = tile.textColor;
                            var pct = Math.round(dataset.data[i] / total * 100);
                            var percent = String(pct) + "%";

                            if (pct >= 5) {
                                ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                                // Display percent in another line, line break doesn't work for fillText
                                ctx.fillText(percent, model.x + x, model.y + y + 15);
                            }
                        }
                    });
                }
            }
        };

        if (tile.width == 1 && tile.height == 1) { // 1x1 tile: hide legend
            options.legend = { display: false };
        }
        else if (tile.width == 2 && tile.height == 1) { // 2x1 tile: legend to right of donut chart
            options.legend = {
                display: 'true',
                position: 'right',
                labels: {
                    fontColor: tile.textColor
                }
            };
        }

        var donutChart = new Chart(ctx, {
            type: 'doughnut',
            options: options,
            data: {
                labels: tile.columns,
                datasets: [{
                    data: tile.value,
                    backgroundColor: chartPalette, //[COLOR_RGB_BLUE, COLOR_RGB_RED, COLOR_RGB_ORANGE, COLOR_RGB_GREEN, COLOR_RGB_PURPLE, COLOR_RGB_CYAN, COLOR_RGB_YELLOW, COLOR_RGB_BLACK, COLOR_RGB_GRAY],
                    borderColor: tile.textColor,
                    borderWidth: 1
                }]
            }
        });
    }

    // -------------------- drawPieChart : Draw a Chart.js pie chart --------------------

    this.drawPieChart = function (self, elementId) {

        var index = getTileIndexFromId(elementId);
        var tile = self.tiles[index];

        if (!tile || !tile.type || !tile.value || !tile.dataSource) return;

        var ctx = document.getElementById(elementId).getContext('2d');

        var options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: 'true',
                position: 'top',
                labels: {
                    fontColor: tile.textColor
                }
            },
            title: { display: false },
            animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: function () {       // Add labels and percent over slices
                    var ctx = this.chart.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset) {

                        for (var i = 0; i < dataset.data.length; i++) {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                                start_angle = model.startAngle,
                                end_angle = model.endAngle,
                                mid_angle = start_angle + (end_angle - start_angle) / 2;

                            var x = mid_radius * Math.cos(mid_angle);
                            var y = mid_radius * Math.sin(mid_angle);

                            ctx.fillStyle = tile.textColor;
                            var pct = Math.round(dataset.data[i] / total * 100);
                            var percent = String(pct) + "%";

                            if (pct >= 5) {
                                ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                                // Display percent in another line, line break doesn't work for fillText
                                ctx.fillText(percent, model.x + x, model.y + y + 15);
                            }
                        }
                    });
                }
            }
        };

        if (tile.width == 1 && tile.height == 1) { // 1x1 tile: hide legend
            options.legend = { display: false };
        }
        else if (tile.width == 2 && tile.height == 1) { // 2x1 tile: legend to right of donut chart
            options.legend = {
                display: 'true',
                position: 'right',
                labels: {
                    fontColor: tile.textColor
                }
            };
        }

        var pieChart = new Chart(ctx, {
            type: 'pie', 
            options: options,
            data: {
                labels: tile.columns,
                datasets: [{
                    data: tile.value,
                    backgroundColor: chartPalette,
                    borderColor: tile.textColor,
                    borderWidth: 1
                }]
            }
        });
    }

    // -------------------- drawColumnChart : Draw a Chart.js column (vertical bar) chart --------------------

    this.drawColumnChart = function (self, elementId) {

        var index = getTileIndexFromId(elementId);
        var tile = self.tiles[index];

        if (!tile || !tile.type || !tile.value || !tile.dataSource) return;

        var ctx = document.getElementById(elementId).getContext('2d');

        var options = {
            defaultFontColor: tile.textColor,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            title: { display: false },
            scales: {
                xAxes: [{
                    color: tile.textColor,
                    gridLines: {
                        offsetGridLines: true,
                        color: 'transparent', // tile.textColor,
                        zeroLineColor: tile.textColor
                    },
                    ticks: {
                        fontColor: tile.textColor
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        offsetGridLines: true,
                        color: tile.textColor,
                        zeroLineColor: tile.textColor
                    },
                    ticks: { 
                        beginAtZero: true,
                        //max: 100,
                        min: 0,
                        color: tile.textColor,
                        fontColor: tile.textColor
                    }
                }]
            }
        };

        var columnChart = new Chart(ctx, {
            type: 'bar',
            options: options,
            data: {
                labels: tile.columns,
                datasets: [{
                    //label: '# of Votes',
                    data: tile.value,
                    backgroundColor: chartPalette, //[COLOR_RGB_BLUE, COLOR_RGB_RED, COLOR_RGB_ORANGE, COLOR_RGB_GREEN, COLOR_RGB_PURPLE, COLOR_RGB_CYAN, COLOR_RGB_YELLOW],
                    borderColor: tile.textColor,
                    borderWidth: 0
                }]
            }
        });
    }

    // -------------------- drawBarChart : Draw a Chart.js bar chart --------------------

    this.drawBarChart = function (self, elementId) {

        var index = getTileIndexFromId(elementId);
        var tile = self.tiles[index];

        if (!tile || !tile.type || !tile.value || !tile.dataSource) return;

        var ctx = document.getElementById(elementId).getContext('2d');

        var options = {
            defaultFontColor: tile.textColor,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            title: { display: false },
            scales: {
                xAxes: [{
                    color: tile.textColor,
                    gridLines: {
                        offsetGridLines: true,
                        color: 'transparent', // tile.textColor,
                        zeroLineColor: tile.textColor
                    },
                    ticks: { mirror: true,
                        fontColor: tile.textColor
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        offsetGridLines: true,
                        color: tile.textColor,
                        zeroLineColor: tile.textColor
                    },
                    ticks: {
                        //mirror: true,
                        beginAtZero: true,
                        //max: 100,
                        min: 0,
                        color: tile.textColor,
                        fontColor: tile.textColor
                    }
                }]
            },
            // Experimental: show value near end of each bar
            //events: false,
            //tooltips: {
            //    enabled: false
            //},
            //hover: {
            //    animationDuration: 0
            //}
            //,animation: {
            //    duration: 1,
            //    onComplete: function () {
            //        var chartInstance = this.chart,
            //            ctx = chartInstance.ctx;
            //        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            //        ctx.textAlign = 'center';
            //        ctx.textBaseline = 'bottom';
            //        ctx.fontColor = tile.textColor;
            //        this.data.datasets.forEach(function (dataset, i) {
            //            var meta = chartInstance.controller.getDatasetMeta(i);
            //            meta.data.forEach(function (bar, index) {
            //                var data = dataset.data[index]; // .toFixed(2);
            //                if ((bar._model.x - 20) > 80) { // show label near end of bar only if there is room for it - otherwise to right of bar
            //                    ctx.fillText(data, bar._model.x - 24, bar._model.y + 5);
            //                }
            //                else {
            //                    ctx.fillText(data, bar._model.x + 16, bar._model.y + 5);
            //                }
            //            });
            //        });
            //    }
            //}
            // End experimental
        };

        var barChart = new Chart(ctx, {
            type: 'horizontalBar',
            options: options,
            data: {
                labels: tile.columns,
                datasets: [{
                    //label: '# of Votes',
                    data: tile.value,
                    backgroundColor: chartPalette, //[COLOR_RGB_BLUE, COLOR_RGB_RED, COLOR_RGB_ORANGE, COLOR_RGB_GREEN, COLOR_RGB_PURPLE, COLOR_RGB_CYAN, COLOR_RGB_YELLOW],
                    borderColor: tile.textColor,
                    borderWidth: 0
                }]
            }
        });
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
