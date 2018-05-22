'use strict';

// SqlDataService : DataService, contains functions for access tile layouts and data for tiles (SQL Server version, all data comes from database).
//
// dataProvider ............. returns the name of the data provider ("demo")
// getTileLayout ............ returns the master tile layout for the dashboard

var dbg = null;

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

dashboardApp.service('DataService', function ($http) {

    var self = this;

    self.queries = [];

    this.roles = ['Accounting', 'Admin', 'Employee', 'Executive', 'Manager', 'Sales', 'Manufacturing', 'Marketing'];

    self.requiresPromise = true;

    self.username = null;
    self.isAdmin = null;

    self.dataProvider = function () {
        return 'SQL Server';
    }

    // -------------------- getUser : return user information.

    self.getUser = function () {

        var url = '/Dashboard/GetUser';

        var request = $http({
            method: "GET",
            url: url,
        });

        return (request.then(getUser_handleSuccess, handleError));
    };

    self.getParameterByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    // -------------------- getTileLayout : Returns the master layout for tiles (returns tiles array) ------------------

    self.getTileLayout = function () {   // TODO: add dashboard-name as param

        var request = $http({
            method: "GET",
            url: "/Dashboard/GetDashboard",
        });

        return (request.then(getTileLayout_handleSuccess, handleError));
    };

    // -------------------- saveDashboard : updates the master layout for tiles (returns tiles array). If isDefault=true, this becomes the new default dashboard layout. ------------------

    self.saveDashboard = function (newTiles, isDefault) { 

        var Dashboard = {
            DashboardName: null,
            IsAdmin: false,
            Username: null,
            Tiles: [],
            Queries: null,
            IsDefault: isDefault
        };

        var tile = null;
        var Tile = null;

        // create tile object with properties

        for (var t = 0; t < newTiles.length; t++) {
            tile = newTiles[t];
            Tile = {
                Sequence: t+1,
                Properties: [
                    { PropertyName: 'color', PropertyValue: tile.color },
                    { PropertyName: 'width', PropertyValue: parseInt(tile.width) },
                    { PropertyName: 'height', PropertyValue: parseInt(tile.height) },
                    { PropertyName: 'title', PropertyValue: tile.title },
                    { PropertyName: 'type', PropertyValue: tile.type },
                    { PropertyName: 'dataSource', PropertyValue: tile.dataSource },
                    { PropertyName: 'columns', PropertyValue: JSON.stringify(tile.columns) },
                    //{ PropertyName: 'value', PropertyValue: JSON.stringify(tile.value) }, // No need to store value - it is queried dynamically
                    { PropertyName: 'label', PropertyValue: tile.label },
                    { PropertyName: 'link', PropertyValue: tile.link },
                    { PropertyName: 'format', PropertyValue: tile.format },
                    { PropertyName: 'role', PropertyValue: tile.role }
                ]
            };
            Dashboard.Tiles.push(Tile);
        };

        var request = $http({
            method: "POST",
            url: "/Dashboard/SaveDashboard",
            data: JSON.stringify(Dashboard),
            headers : {
                'Content-Type': 'application/json'
            }

        });

        return (request.then(handleSuccess, handleError));
    };

    // -------------------- updateTileData :  Runs a data query and returns tile with updated properties (value, columns, label) ------------------

    self.updateTileData = function (query) {   // TODO: add dashboard-name as param

        if (query) {

            var url = "/Dashboard/UpdateTileData/" + query.replaceAll(' ', '%20');

            var request = $http({
                method: "GET",
                url: url,
            });

            return (request.then(updateTileData_handleSuccess, handleError));
        }
        else {
            console.log('DataService.updateTileData query: null');
        }
    }

    // resetDashboard : reset user's dashboard

    self.resetDashboard = function () {
        var request = $http({
            method: "GET",
            url: "/Dashboard/DashboardReset/",
        });
    }

    // -------------------- Ajax success/failure handlers --------------------

    // process success response to updateTileData. Populate and return tile.

    function updateTileData_handleSuccess(response) {
        var tile = response.data;

        var name = null;
        var value = null;

        var tile = {};
        for (var p = 0; p < response.data.Properties.length; p++) {
            name = response.data.Properties[p].PropertyName;
            value = response.data.Properties[p].PropertyValue;
            switch (name) {
                case 'columns': // column values beginning with [ are evaluated into arrays.
                    tile[name] = eval(value);
                    break
                case 'width':       // treat these property value as integers
                case 'height':
                    tile[name] = value; // parseInt(value);
                    break;
                case 'value':
                    if (value.substring(0, 1) == '[') {
                        tile[name] = eval(value);
                    }
                    else {
                        tile[name] = value;
                    }
                    break;
                default:    // treat all other property values as strings
                    tile[name] = value;
                    break;
            }
        }

        return tile;
    }

    // process success response to getUser. Return user object.

    function getUser_handleSuccess(response) {
        return response.data;
    }


    function getTileLayout_handleSuccess(response) {

        var tile = null;
        var tiles = [];

        var name = '';
        var value = '';

        // create tile object with properties

        for (var t = 0; t < response.data.Tiles.length; t++) {
            tile = {};
            for (var p = 0; p < response.data.Tiles[t].Properties.length; p++) {
                name = response.data.Tiles[t].Properties[p].PropertyName;
                value = response.data.Tiles[t].Properties[p].PropertyValue;
                switch (name) {
                    case 'columns': // column values beginning with [ are evaluated into arrays.
                        tile[name] = eval(value);
                        break
                    case 'width':       // treat these property value as integers
                    case 'height':
                        tile[name] = value; // parseInt(value);
                        break;
                    case 'value':
                        if (value.substring(0, 1) == '[') {
                            try {
                                tile[name] = eval(value);
                            }
                            catch (e) {
                                tile.value = 0;
                                console.log('eval failed: ' + e);
                                console.log(value);
                            }
                        }
                        else {
                            tile[name] = value;
                        }
                        break;
                    default:    // treat all other property values as strings
                        tile[name] = value;
                        break;
                } // end switch
            }
            tiles.push(tile);   // add tile to tiles array
        }

        self.queries = [];
        if (response.data.Queries != null)
        {
            for (var q = 0; q < response.data.Queries.length; q++) {
                self.queries.push({
                    QueryName: response.data.Queries[q].QueryName,
                    ValueType: response.data.Queries[q].ValueType,
                    Role: response.data.Queries[q].Role
                });
            }
        }

        self.roles = response.data.Roles;

        return tiles;
    }

    function handleSuccess(response) {
    }

    function handleError(response) {
        console.log('data.handleError: error ' + response);
    }

});
