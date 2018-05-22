//'use strict'; // removed because of complaints about dragTile function - in strict mode code, functions can only be declared at top level or inside a block
// Register 'dashboard' component, along with its associated controller and template

var dashboardComp = angular.module('dashboard').component('dashboard', {
    templateUrl: '/components/dashboard/dashboard.template.html',
    controllerAs: '$ctrl',
    controller: ['$scope', '$window', '$http', '$element', 'ChartService', 'DataService',
function($scope, $window, $http, $element, ChartService, DataService) {
    var self = this;

    self.waiting = false;

    self.tiles = [];

    self.queries = [];
    self.roles = [];

    self.chartProvider = ChartService.chartProvider();
    self.dataProvider = DataService.dataProvider();

    self.configTileSave = null;

    self.tilesacross = 2;       // number of tile units across - set dynamically as window size changes
    self.tilesdown = 10;        // hard-coded limitation for now.
    self.tileunits = [1, 2];    // used by template to render table <col> elements.

    self.tablecolumns = function () {
        if ($scope.tablecolumns)
            return $scope.tablecolumns;
        else
            return 8;   // unit testing
    }

    self.tablerows = function () {
        return $scope.tablerows;
    }

    self.title = 'Dashboard';

    self.configuring = false;   // If true, Configure Tile dialog is displayed but not yet committed.
    self.applied = false;       // if true, Configre Tile Apply has been clicked, but not yet Saved.
    self.configureTileTitle = 'Configure Tile';
    self.picker = null;
    self.pickerInitialized = false;

    self.configTile = {};
    self.configIndex = -1;

    self.configMessage = '';

    self.rearranging = false;

    self.user = {};

    // userInRole(role) : return true if user is in the specified role. If an Admin, considered to be in all roles.

    self.userInRole = function (role) {
        result = false;
        if (self.user && self.user.Roles) {
            for (var r = 0; r < self.user.Roles.length; r++) {
                if (self.user.Roles[r] === role || self.user.Roles[r]==='Admin') {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    // Get the current user information (Username, IsAdmin).

    if (DataService.requiresPromise) {

        Promise.resolve(DataService.getUser()).then(
            function (response) {
                self.user = response;
            }
        );
    }
    else {
        self.user = DataService.getUser();
    }

    self.dataSourceType = function () {
        try {
            if (self.configIndex < 0) return '';
            switch (self.tiles[self.configIndex].type) {
                case 'counter':
                    return 'number';
                case 'kpi':
                    return 'kpi-set';
                case 'table':
                    return 'table';
                case 'bar':
                case 'column':
                case 'donut':
                case 'pie':
                    return 'number-array';
                default:
                    return '';
    }
        }
        catch (e) {
            console.log('self.dataSourceType: EXCEPTION ' + e);
        }
    }

    // Complete a drag-and-drop operation.

    self.dragTile = function (sourceTileIndex, destTileIndex) {

        try {
            self.wait(true);

            var sourceTile = self.tiles[sourceTileIndex];

            self.tiles.splice(sourceTileIndex, 1); // remove source tile from tile list

            if (sourceTileIndex < destTileIndex) {
                destTileIndex--;
            }

            self.tiles.splice(destTileIndex, 0, sourceTile); // insert dest tile

            // Regenerate tile ids.
            var tile;
            if (self.tiles != null) {
                for (var t = 0; t < self.tiles.length; t++) {
                    tile = self.tiles[t];
                    tile.id = 'tile-' + (t + 1).toString(); // tile id (tile_1, tile_2, ...)
                }
            }

            var scope = angular.element('#dashboard').scope();
            self.computeLayout();
            $scope.$apply(self);

            DataService.saveDashboard(self.tiles, false);
        } catch (e) {
            console.log('dragTile: EXCEPTION '); 
        }
        self.wait(false);
    };

    // Draw charts (tile types: donut, column, table) - execute JavaScript to invoke chart service.

    self.createCharts = function () {

        if (self.chartProvider == 'ChartJS') {
            $('.chartjs-donutchart').each(function () {
                self.drawDonutChart(this.id);
            });

            $('.chartjs-piechart').each(function () {
                self.drawPieChart(this.id);
            });

            $('.chartjs-columnchart').each(function () {
                self.drawColumnChart(this.id);
            });

            $('.chartjs-barchart').each(function () {
                self.drawBarChart(this.id);
            });
        }

        if (self.chartProvider == 'Google') {
            $('.donutchart').each(function () {
                self.drawDonutChart(this.id);
            });

            $('.piechart').each(function () {
                self.drawPieChart(this.id);
            });

            $('.columnchart').each(function () {
                self.drawColumnChart(this.id);
            });

            $('.barchart').each(function () {
                self.drawBarChart(this.id);
            });
        }
    }

    // Draw a donut chart

    self.drawDonutChart = function (elementId) {
        ChartService.drawDonutChart(self, elementId);
    }

    // Draw a pie chart

    self.drawPieChart = function (elementId) {
        ChartService.drawPieChart(self, elementId);
    }

    // Draw a column chart

    self.drawColumnChart = function (elementId) {
        ChartService.drawColumnChart(self, elementId);
    }

    // Draw a bar chart

    self.drawBarChart = function (elementId) {
        ChartService.drawBarChart(self, elementId);
    }

    // Compute layout based on current screen dimensions (self.tablecolumns()) and generate updated tile layout. Also marks tiles hidden if user not in required role for tile.
    // Inputs: self.tablecolumns() ........... number of tiles across.
    // Outputs: self.tiles ................... sets .x and .y property of each tile to indicate where it should be positioned.

    self.computeLayout = function () {
        if (self.tiles == null) return;

        var matrix = [];

        for (var r = 0; r < self.tilesdown; r++) {
            matrix.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // support up to 20 tile units across 
        }

        var numcols = self.tablecolumns();
        if (numcols < 1) numcols = 1;

        // This is used in template to render things like table <col> elements.
        self.tilesacross = numcols;
        self.tileunits = [];
        for (var u = 0; u < numcols; u++) {
            self.tileunits.push(u);
        }

        // set tile.hidden for each tile based on role assignments.

        var tile = null;
        for (var t = 0; t < self.tiles.length; t++) {
            tile = self.tiles[t];
            tile.hidden = false;
            if (tile.role) {
                if (!self.userInRole(tile.role)) {
                    tile.hidden = true;
                }
            }
        }

        // render layout array of rows

        var newlayout = [];

        var index = 0;
        var row = [];

        var tileid = 1;

        var xMargin = 16;
        var yMargin = 16;
        for (var t = 0; t < self.tiles.length; t++) {
            tile = self.tiles[t];

            tile.id = tileid.toString();
            tileid = tileid + 1;

            if (!tile.hidden) {

                if (index + parseInt(tile.width) > numcols) { // no more room in row. commit row and start new one.
                    newlayout.push(row);
                    row = [];
                    index = 0;
                }

                if (self.tilesacross < 2) self.tilesacross = 2; // minimum dashboard size is 2 tiles units across.

                var across = self.tilesacross - 1;
                if (across > 20) across = 20;       // enforce limit of 20 tile units across
                if (across < 1) across = 1;
                switch (tile.height) {
                    case '1':
                        switch (tile.width) {
                            case '1':
                                // find a 1x1 available location
                                loop_1_1:
                                    for (var r = 0; r < self.tilesdown; r++) {
                                        for (var c = 0; c < self.tilesacross; c++) {
                                            if (matrix[r][c] === 0) {
                                                tile.x = xMargin + (c * 216);
                                                tile.y = yMargin + (r * 216);
                                                matrix[r][c] = 1;
                                                //console.log('tile ' + tile.id + ' (1x1): r:' + r.toString() + ', c:' + c.toString() + ', x:' + tile.x.toString() + ', y:' + tile.y.toString());
                                                break loop_1_1;
                                            } // end if
                                        } // next c
                                    } // next r
                                break;
                            case '2':
                                // find a 2x1 available location
                                loop_2_1:

                                    for (var r = 0; r < self.tilesdown; r++) {
                                        for (var c = 0; c < across; c++) {
                                            if (matrix[r][c] === 0 && matrix[r][c + 1] === 0) {
                                                tile.x = xMargin + (c * 216);
                                                tile.y = yMargin + (r * 216);
                                                matrix[r][c] = 1;
                                                matrix[r][c + 1] = 1;
                                                //console.log('tile ' + tile.id + ' (2x1): r:' + r.toString() + ', c:' + c.toString() + ', x:' + tile.x.toString() + ', y:' + tile.y.toString());
                                                break loop_2_1;
                                            } // end if
                                        } // next c
                                    } // next r
                                break
                        } // end switch
                        break;
                    case '2':
                        switch (tile.width) {
                            case '1':
                                // find a 1x2 available location
                                loop_1_2:
                                    for (var r = 0; r < self.tilesdown - 1; r++) {
                                        for (var c = 0; c < self.tilesacross; c++) {
                                            if (matrix[r][c] === 0 && matrix[r + 1][c] === 0) {
                                                tile.x = xMargin + (c * 216);
                                                tile.y = yMargin + (r * 216);
                                                matrix[r][c] = 1;
                                                matrix[r + 1][c] = 1;
                                                //console.log('tile ' + tile.id + ' (1x2): r:' + r.toString() + ', c:' + c.toString() + ', x:' + tile.x.toString() + ', y:' + tile.y.toString());
                                                break loop_1_2;
                                            } // end if
                                        } // next c
                                    } // next r
                                break;
                            case '2':
                                // find a 2x2 available location
                                loop_2_2:
                                    for (var r = 0; r < self.tilesdown - 1; r++) {
                                        for (var c = 0; c < across; c++) {
                                            if (matrix[r][c] === 0 && matrix[r][c + 1] === 0 &&
                                                matrix[r + 1][c] === 0 && matrix[r + 1][c + 1] === 0) {
                                                tile.x = xMargin + (c * 216);
                                                tile.y = yMargin + (r * 216);
                                                matrix[r][c] = 1;
                                                matrix[r][c + 1] = 1;
                                                matrix[r + 1][c] = 1;
                                                matrix[r + 1][c + 1] = 1;
                                                //console.log('tile ' + tile.id + ' (2x2): r:' + r.toString() + ', c:' + c.toString() + ', x:' + tile.x.toString() + ', y:' + tile.y.toString());
                                                break loop_2_2;
                                            } // end if
                                        } // next c
                                    } // next r
                                break
                        } // end switch
                        break;
                } // end switch
                row.push(tile);
                index = index + parseInt(tile.width);
            } // end if !hidden
        } // next t 
        if (row.length > 0) {   // commit final row if not empty.
            newlayout.push(row);
        }

        $scope.tablerows = newlayout.length;

        if (!self.pickerInitialized) {
            $("#configTileColor").spectrum({
                showPaletteOnly: true,
                showInitial: true,
                preferredFormat: "hex",
                palette: [
                    ['#000000', '#666666', '#DDDDDD', '#292E6B', '#3476C9', '#009CCC', '#A8E7FA', '#7F1725', '#5C197B', '#B784AB', '#F599D1', '#E60017', '#981C17', '#DB552C', '#A07C17', '#FBBC3D', '#FBFD52', '#FFE797', '#00643A', '#339947', '#A7D050', '#FFFFFF']
                ]
            });
        }
    };

    // Validate a tile. If not valid, tile.haveData is set to false so it will not attempt to be rendered.

    self.validateTile = function (tile) {
        if (tile.hasOwnProperty('value')) {    // if no value property is present in the tile object, invalidate the tile
            tile.haveData = true;
        }
        else {
            tile.haveData = false;  // tile is missing a value property, so invalidate it.
        }

        // Check tile has a known type. Also do any special checking peculiar to that type.

        if (!tile.hasOwnProperty('type')) {
            tile.haveData = false;  // tile is missing a type property, so invalidate it.
        }
        else {
            switch (tile.type) {
                case 'bar':
                    if (!tile.hasOwnProperty('columns')) {
                        tile.haveData = false;  // tile is missing a columns property, so invalidate it.
                    }
                    break;
                case 'column':
                    if (!tile.hasOwnProperty('columns')) {
                        tile.haveData = false;  // tile is missing a columns property, so invalidate it.
                    }
                    break;
                case 'counter':
                    break;
                case 'donut':
                    if (!tile.hasOwnProperty('columns')) {
                        tile.haveData = false;  // tile is missing a columns property, so invalidate it.
                    }
                    break;
                case 'kpi':
                    if (!tile.hasOwnProperty('columns')) {
                        tile.haveData = false;  // tile is missing a columns property, so invalidate it.
                    }
                    break;
                case 'pie':
                    if (!tile.hasOwnProperty('columns')) {
                        tile.haveData = false;  // tile is missing a columns property, so invalidate it.
                    }
                    break;
                case 'table':
                    if (!tile.hasOwnProperty('columns')) {
                        tile.haveData = false;  // tile is missing a columns property, so invalidate it.
                    }
                    break;
                default:
                    tile.haveData = false;  // tile type is unrecognized, so invalidate it.
                    break;
            } // end switch
        } // end else

        if (!tile.haveData) {
            tile.classes = tile.sizeClass; 
        }
    }

    self.apply = function () {
        $scope.$apply();
    };

    self.tileColor = function (index) {
        return self.tiles[parseInt(index)-1].color;
    }

    self.tileX = function (index) {
        return self.tiles[parseInt(index) - 1].x;
    }

    self.tileY = function (index) {
        return self.tiles[parseInt(index) - 1].y;
    }

    // Return the best text color for a tile. Pass id ('1', '2', ...).

    self.tileTextColor = function (id) {
        return self.textColor(self.tiles[parseInt(id) - 1].color);
    }

    self.updateTileProperties = function () {
        var tile;
        if (self.tiles != null) {
            for (var t = 0; t < self.tiles.length; t++) {
                tile = self.tiles[t];
                tile.haveData = true;
                tile.id = 'tile-' + (t + 1).toString(); // tile id (tile_1, tile_2, ...)
                tile.bgClass = "tile-" + tile.color; // tile background color class (tile-red, tile-yellow, ...)
                tile.sizeClass = "tile_" + tile.width + "_" + tile.height; // tile size class (tile_1_1, tile_1_2, tile_2_1, tile_2_2)
                if (tile.haveData) {
                    tile.classes = tile.sizeClass; // full list of classes to customize tile appearance
                }
                else {
                    tile.classes = tile.sizeClass; 
                }

                tile.textColor = self.textColor(tile.color);

                //if (tile.color == 'white' || tile.color == 'yellow' || tile.color == 'gray') {
                //    tile.textColor = 'black';
                //}
                //else {
                //    tile.textColor = 'white';
                //}

                if (tile.type === 'table') {
                    if (tile.width == '1') {
                        tile.tableWidth = '168px';
                    }
                    else {
                        tile.tableWidth = '384px';
                    }
                    if (tile.height == '1') {
                        tile.tableHeight = '144px';
                    }
                    else {
                        tile.tableHeight = '364px';
                    }
                }

                self.validateTile(tile);
            } // next t

        }
    };

    // Load tile definitions and perform remaining initilization.

    self.LoadDashboard = function () {
        if (!DataService.requiresPromise) {
            self.tiles = DataService.getTileLayout();
            self.queries = DataService.queries;
            self.roles = DataService.roles;

            // Generate tile properties id, sizeClass, bgClass, and classes.
            var tile;
            if (self.tiles != null) {
                for (var t = 0; t < self.tiles.length; t++) {
                    tile = self.tiles[t];
                    tile.haveData = true;
                    tile.id = 'tile-' + (t + 1).toString(); // tile id (tile_1, tile_2, ...)
                    tile.bgClass = "tile-" + tile.color; // tile background color class (tile-red, tile-yellow, ...)
                    tile.sizeClass = "tile_" + tile.width + "_" + tile.height; // tile size class (tile_1_1, tile_1_2, tile_2_1, tile_2_2)
                    if (tile.haveData) {
                        tile.classes = tile.sizeClass;  // full list of classes to customize tile appearance
                    }
                    else {
                        tile.classes = tile.sizeClass;
                    }

                    tile.textColor = 'black'; // = self.textColor(tile.color);

                    if (tile.type === 'table') {
                        if (tile.width == '1') {
                            tile.tableWidth = '168px';
                        }
                        else {
                            tile.tableWidth = '384px';
                        }
                        if (tile.height == '1') {
                            tile.tableHeight = '144px';
                        }
                        else {
                            tile.tableHeight = '364px';
                        }
                    }

                    self.validateTile(tile);
                } // end for
            } // end if
            self.computeLayout();
            //$scope.$apply(); // already in a digest cycle when this code runs
            deferCreateCharts();

            return;
        }
        

        Promise.resolve(DataService.getTileLayout()).then(
            function (response) {
                self.tiles = response;
                self.queries = DataService.queries;
                self.roles = DataService.roles;

            // Generate tile properties id, sizeClass, bgClass, and classes.
            var tile;
            if (self.tiles != null) {
                for (var t = 0; t < self.tiles.length; t++) {
                    try {
                        tile = self.tiles[t];
                        tile.haveData = true;
                        tile.id = 'tile-' + (t + 1).toString(); // tile id (tile_1, tile_2, ...)
                        tile.bgClass = "tile-" + tile.color; // tile background color class (tile-red, tile-yellow, ...)
                        tile.sizeClass = "tile_" + tile.width + "_" + tile.height; // tile size class (tile_1_1, tile_1_2, tile_2_1, tile_2_2)
                        if (tile.haveData) {
                            tile.classes = tile.sizeClass;  // full list of classes to customize tile appearance
                        }
                        else {
                            tile.classes = tile.sizeClass; 
                        }

                        tile.textColor = self.textColor(tile.color);

                        if (tile.type === 'table') {
                            if (tile.width == '1') {
                                tile.tableWidth = '168px';
                            }
                            else {
                                tile.tableWidth = '384px';
                            }
                            if (tile.height == '1') {
                                tile.tableHeight = '144px';
                            }
                            else {
                                tile.tableHeight = '364px';
                            }
                        }

                        self.validateTile(tile);
                    }
                    catch (e) {
                        console.log('getTileLayout: ' + t.toString() + ' - exception ' + e)
                    }
                } // next t
            } // end if

            self.computeLayout();
            $scope.$apply();
            deferCreateCharts();
        });
    };

    self.LoadDashboard();

    // TileColorChanged(index) ..... tile color has changed. Recompute layout and re-render.

    self.TileColorChanged = function (index) {
        self.updateTileProperties();
        self.computeLayout();
        switch (self.tiles[self.configIndex].type) {
            case 'bar':
            case 'column':
            case 'donut':
            case 'pie':
                deferCreateCharts();
                break;
            default:
                break;
        }
    }

    // TileSizeChanged(index) ..... tile size has changed. Recompute layout and re-render.

    self.TileSizeChanged = function (index) {
        self.updateTileProperties();
        self.computeLayout();
        switch (self.tiles[self.configIndex].type) {
            case 'bar':
            case 'column':
            case 'donut':
            case 'pie':
                deferCreateCharts();
                break;
            default:
                break;
        }
    }

    // TileTypeChanged(index) ..... tile type has changed. If new type is a chart, re-draw chat.

    self.TileTypeChanged = function (index) {

        if (self.tileHasValidTypeAndDataSource(index)) {

            var tile = self.tiles[index];
            switch (tile.type) {
                case 'bar':
                case 'column':
                case 'donut':
                case 'pie':
                    deferCreateCharts();
                    break;
                default:
                    break;
            }
        }
    }

    // tileHasValidTypeAndDataSource ...... return true if specified tile has a valid type and a valid dataSource set that agree with each other. 0-based tile index.

    self.tileHasValidTypeAndDataSource = function (index) {
        if (!self.queries) return false;
        if (index < 0 || index >= self.tiles.length) return false;

        var tile = self.tiles[index];
        if (!tile.type || !tile.dataSource) return false;

        var queryFound = false;

        var valueType = null;
        var role = null;
        for (var q = 0; q < self.queries.length; q++) {
            if (self.queries[q].QueryName==tile.dataSource) {
                queryFound = true;
                valueType = self.queries[q].ValueType;
                role = self.queries[q].Role;
            }
        }

        if (!queryFound) return false;

        switch (tile.type) {
            case 'counter':
                if (valueType=='number') return true;
                return false;
            case 'kpi':
                if (valueType=='kpi-set') return true;
                return false;
            case 'table':
                if (valueType=='table') return true;
                return false;
            case 'bar':
            case 'column':
            case 'donut':
            case 'pie':
                if (valueType=='number-array') return true;
                return false;
            default:
                return false;
            }
        return false;
    }

    // UpdateTileData(index) ...... tile data source has changed - re-fetch tile data and update tile.value / tile.columns / tile.label.

    self.UpdateTileData = function (index) {

        self.wait(true);
        if (self.tileHasValidTypeAndDataSource(index)) {
            Promise.resolve(DataService.updateTileData(self.tiles[index].dataSource)).then(function (response) {
                tile = response;
                if (tile) {
                    self.tiles[index].value = tile.value;
                    if (tile.columns) self.tiles[index].columns = tile.columns;
                    if (tile.label) self.tiles[index].label = tile.label;
                    $scope.$apply();
                    self.wait(false);
                }
            });
        }
    }

    self.toggleRearrange = function () {
        self.rearranging = !self.rearranging;
        if (self.rearranging) {
            $('.dropdown-toggle').prop('disabled', true);
            toastr.options = {
                "positionClass": "toast-top-center",
                "timeOut": 0,
                "extendedTimeout": 0,
                onclick: function () {
                    self.exitRearrange();
                },
                onFadeOut: function () {
                    self.exitRearrange();
                },
                onHidden: function () {
                    self.exitRearrange();
                },
                onCloseClick: function () {
                    self.exitRearrange();
                },
                closeButton: true
            };
            toastr.info('Move tiles to arrange. Close this message when done.');
        }
        else {
            self.rearranging = false;
            $('.dropdown-toggle').prop('disabled', false);
            //toastr.options = {
            //    "positionClass": "toast-top-center",
            //    "timeOut": "1000",
            //};
            //toastr.info('Exiting rearrange tiles...');
        }
    };

    self.exitRearrange = function () {
        self.rearranging = false;
        $('.dropdown-toggle').prop('disabled', false);
        $scope.$apply(self);
    };

    //---------- Reorder Tles UI ----------

    // reorderTiles : Change tile order by moving tiles up/down from a list. Alternative to drag-and-drop for mobile devices.

    self.reordering = false;

    self.reorderTiles = function () {
        if (self.configuring) return;

        $('.dropdown-toggle').prop('disabled', true);   // disable drop-down menu on all tiles while Configure Tile dialog is open.

        self.clonedTiles = angular.copy(self.tiles);    // Make a copy of original tile configuration
        self.applied = true;
        self.configuring = true;

        self.reordering = true;
        return false;
    };

    //---------- Tile Confguration UI ----------

    // configureTile : Configure (edit) a tile. Displays configure tile dialog. 
    // Value is tile index ('1', '2', ..) or '0' (new tile) or '-n' (copy tile n). 
    // TODO: preserve original layout so cancel restores it.

    self.tileIndex = -1;    // configure tile index

    self.copyTile = function (id) {
        var index = parseInt(id.substring(12)) - 1;
        var newTile = angular.copy(self.tiles[index]);
        newTile.id = (self.tiles.length + 1).toString();
        newTile.title = self.tiles[index].title + ' copy';
        self.tiles.push(newTile);
        self.computeLayout();
        self.configureTile('tile-config-' + newTile.id);
    }

    self.configureTile = function (id) {
        if (self.configuring) return;

        $('.dropdown-toggle').prop('disabled', true);   // disable drop-down menu on all tiles while Configure Tile dialog is open.

        if (!id) // if no id specified, cancel configuration tile action
        {
            self.cancelConfigureTile();
        }
        else {
            self.clonedTiles = angular.copy(self.tiles);    // Make a copy of original tile configuration
            self.applied = true;
            self.configMessage = '';
            if (id == '0') {    // add new tile
                self.configureTileTitle = 'Add New Tile';
                self.tileIndex = -1;
                var color = '#888888'; 
                $('#configTileColor').val(color);
                $("#configTileColor").spectrum("set", color);
                $('#configTileLink').val('');
                self.configuring = true;
                self.configIndex = self.tiles.length;
                self.tiles.push({
                    id: (self.configIndex+1).toString(),
                    title: 'title',
                    type: 'counter',
                    color: color,
                    dataSource: 'inline',
                    height: '1',
                    width: '1',
                    link: null,
                    classes: 'tile_1_1',
                    columns: null,
                    label: 'label',
                    value: 1,
                    haveData: true
                });
                self.computeLayout();
            }
            else {  // edit existing tile
                var index = parseInt(id.substring(12)) - 1;      // tile-config-1 => 0, tile-config-2 => 1, etc.
                self.configureTileTitle = 'Configure Tile ' + (index+1).toString();
                self.tileIndex = index;
                self.configIndex = index;
                self.configTile = self.tiles[index];
                if (self.configTile) {
                    self.configuring = true;
                    self.configTileSave = angular.copy(self.configTile);
                    var color = self.configTile.color; 
                    $('#configTileColor').val(color);
                    $("#configTileColor").spectrum("set", color);
                    $('#configTileLink').val(self.configTile.link);
                }
            }
            //$('#configTileTitle').focus();
        }
        return false;
    };

    // cancelConfigTile : cancel a configure tile action (dismiss tile, clear configuring flags).

    self.cancelConfigureTile = function () {
        if (self.configuring) {
            self.configuring = false;
            self.configIndex = -1;
            self.configMessage = '';
            self.reordering = false;
            if (self.applied) {  // roll back changes from Apply button
                self.tiles = angular.copy(self.clonedTiles);
                self.computeLayout();
                deferCreateCharts();
                self.clonedTiles = null;
                self.applied = false;
            }
            $('.dropdown-toggle').prop('disabled', false);  // re-enable tile menus
        }
    };

    // saveConfigureTile : Save tile configuration. An Apply can be reverted with a cancel.
    // if tileIndex is -1, a new tile is being added.

    self.saveConfigureTile = function () {

        //self.wait(true);

        var index = self.tileIndex;

        if (self.tileIndex == -1) { // new tile
            self.tileIndex = self.configIndex;
            index = self.tileIndex;
        }

        self.configTile = self.tiles[index];

        // Validate config tile dialog

        if (!self.configTile.title) {
            self.configMessage = 'Title is required';
            return;
        }

        self.wait(true);

        DataService.saveDashboard(self.tiles, false);

        self.applied = false;
        self.tileIndex = -1;

        self.updateTileProperties();
        self.computeLayout();
        deferCreateCharts();
        toastr.options = {
            "positionClass": "toast-top-center",
            "timeOut": "1000",
        }
        toastr.info('Dashboard Changes Saved')

        self.configuring = false;
        self.configIndex = -1;
        self.reordering = false;
        self.configMessage = '';

        $('.dropdown-toggle').prop('disabled', false);  // re-enable tile menus

        self.wait(false);
    };

    self.moveTileUp = function (id) {
        var index = parseInt(id)-1;
        if (index >= 1 && index < self.tiles.length) {
            var tile1 = self.tiles[index];
            var tile2 = self.tiles[index - 1];
            self.tiles[index] = tile2;
            self.tiles[index - 1] = tile1;
            self.computeLayout();
            deferCreateCharts();
        }
    }

    self.moveTileDown = function (id) {
        var index = parseInt(id) - 1;
        if (index >= 0 && index < self.tiles.length-1) {
            var tile1 = self.tiles[index];
            var tile2 = self.tiles[index + 1];
            self.tiles[index] = tile2;
            self.tiles[index + 1] = tile1;
            self.computeLayout();
            deferCreateCharts();
        }
    }

    // removeTile : Remove a tile.

    self.removeTile = function(id) {
        if (!id) return;

        self.wait(true);

        if (self.tiles.length < 2) {
            toastr.options = {
                "positionClass": "toast-top-center",
                "timeOut": "1000",
            }
            toastr.info("Can't remove tile - dashboard must contain at least one tile");
            return; // can't delete all tiles, because we lose the tile menu and have no way to add new tiles
        }

        var index = parseInt(id.substring(12)) - 1;      // tile-remove-1 => 0, tile-remove-2 => 1, etc.

        self.tiles.splice(index, 1);
        self.computeLayout();
        deferCreateCharts();

        DataService.saveDashboard(self.tiles, false);

        toastr.options = {
            "positionClass": "toast-top-center",
            "timeOut": "1000",
        }

        toastr.info('Dashboard Tile Deleted');

        self.wait(false);

        return false;
    }

    // resetDashboard : reset user's dashboard

    self.resetDashboard = function () {

        self.wait(true);

        Promise.resolve(DataService.resetDashboard()).then(
            function (response) {
                self.LoadDashboard();
                self.wait(false);
            });
    };

    // saveDefaultDashboard : make user's dashboard the default dashboard for all users

    self.saveDefaultDashboard = function () {
        self.wait(true);
        DataService.saveDashboard(self.tiles, true);
        toastr.options = {
            "positionClass": "toast-top-center",
            "timeOut": "1000",
        }
        toastr.info('Default Dashboard Layout Saved');
        self.wait(false);
    };

    // textColor('#rrggbb') : Given a background color (rrggbb or #rrggbb). Return '#000000' or '#FFFFFF'.
    // Courtesty of https://24ways.org/2010/calculating-color-contrast/

    self.textColor = function (hexcolor) {
        var color = hexcolor;
        if (color.length === 7) color = color.substr(1);
        var r = parseInt(color.substr(0, 2), 16);
        var g = parseInt(color.substr(2, 2), 16);
        var b = parseInt(color.substr(4, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#000000' : '#FFFFFF';
    };

    // turn on / off wait cursor

    self.wait = function (wait) {
        if (wait) {
            self.waiting = true;
        }
        else {
            self.waiting = false;
        }
    };
}]
});
