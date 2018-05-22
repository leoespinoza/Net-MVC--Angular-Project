'use strict';

// DemoDataService : DataService, contains functions for access tile layouts and data for tiles (demo version, all data is inline).
//
// dataProvider ............. returns the name of the data provider ("demo")
// getTileLayout ............ returns the master tile layout for the dashboard

dashboardApp.service('DataService', function ($http) {

    var self = this;

    self.tiles = [];

    self.requiresPromise = false;

    this.queries = [{ QueryName: 'inline', ValueType: 'number', Role: null }, { QueryName: 'inline', ValueType: 'number-array', Role: null }];

    this.roles = ['Accounting', 'Admin', 'Employee', 'Executive', 'Manager', 'Sales', 'Manufacturing', 'Marketing'];

    self.dataProvider = function () {
        return 'Demo';
    };

    // -------------------- getUser : return user information.

    self.getUser = function () {

        switch (self.getParameterByName('user')) {
            case 'marcia.brady':
                return {
                    Username: 'marcia.brady',
                    IsAdmin: true
                };
                break;
            case 'stuart.downey':
                return {
                    Username: 'stuart.downey',
                    IsAdmin: true
                };
                break;
            default:
                return {
                    Username: 'john.smith',
                    IsAdmin: true
                };
        } // end switch
        return null;
    }

    this.getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // -------------------- getTileLayout : Returns the master layout for tiles (returns tiles array) ------------------

    this.getTileLayout = function (dashboardName) {
        
        return self.tiles;
    };

    this.updateTileData = function (query) {
        return null;
    };

    // -------------------- saveDashboard : updates the master layout for tiles (returns tiles array) ------------------

    self.saveDashboard = function (newTiles, isDefault) {
        self.tiles = newTiles;
    };

    // resetDashboard : reset user's dashboard

    self.resetDashboard = function () {
        self.tiles = [
                        {
                            title: 'Site Traffic',
                            type: 'counter',
                            width: '1', height: '1',
                            color: '#E60017',
                            dataSource: 'inline',
                            value: '1365',
                            label: 'Site Visits',
                            link: '/App/Customers'
                        },
                        {
                            title: 'Orders',
                            type: 'counter',
                            width: '1', height: '1',
                            color: '#DB552C',
                            dataSource: 'inline',
                            value: '100',
                            label: 'Orders',
                            link: '/App/Orders'
                        },
                        {
                            title: 'Customer Satisfaction',
                            type: 'kpi',
                            width: '2', height: '1',
                            color: '#292E6B',
                            dataSource: 'inline',
                            columns: ['Poor', 'Adequate', '', 'Excellent'],
                            label: '50 / 100',
                            value: 50
                        },
                        {
                            title: 'Monthly Revenue',
                            type: 'kpi',
                            width: '2', height: '1',
                            color: '#666666',
                            dataSource: 'inline',
                            columns: ['$0', '$10K', '$20K', '$30K'],
                            label: '$15,000',
                            value: 50
                        },
                        {
                            title: 'Time Management',
                            type: 'donut',
                            width: '1', height: '2',
                            color: '#00643A',
                            dataSource: 'inline',
                            columns: ['Work', 'Eat', 'Commute', 'Watch TV', 'Sleep', "Exercise"],
                            value: [11, 2, 2, 2, 7, 4]
                        },
                        {
                            title: 'Employees',
                            type: 'table',
                            width: '2', height: '2',
                            color: '#A07C17',
                            dataSource: 'inline',
                            columns: [['EmpNo', 'number'], ['Last Name', 'string'], ['First Name', 'string'], ['Salary', 'number'], ['FTE', 'boolean']],
                            value: [
                                        [1,  'Reynolds', 'Mike', 10000, true],
                                        [2,  'Ellis', 'Jim', 8000, false],
                                        [3,  'Kramer', 'Alice', 12500, true],
                                        [4,  'Dempsey', 'Bob', 7000, true],
                                        [5,  'Cassidy', 'Cheryl', 7000, true],
                                        [6,  'Meredith', 'Don', 7000, true],
                                        [7,  'Spacek', 'Edith', 7000, true],
                                        [8,  'Gershen', 'Frank', 7000, true],
                                        [9,  'Hague', 'Gary', 7000, true],
                                        [10, 'Martin', 'Hazel', 7000, true],
                                        [11, 'Sullen', 'Ira', 7000, true],
                                        [12, 'Dolan', 'Jacob', 7000, true],
                                        [13, 'Adams', 'Loretta', 7000, true],
                                        [14, 'Parker', 'Mary', 7000, true],
                                        [15, 'Johnson', 'Neil', 7000, true],
                                        [16, 'Bower', 'Obadiah', 7000, true],
                                        [17, 'Dennison', 'Peter', 7000, true],
                                        [18, 'Smith', 'Quincy', 7000, true]
                            ],
                            link: '/App/Employees'
                        },
                        {
                            title: 'Charity Fundraising',
                            type: 'kpi',
                            width: '1', height: '2',
                            color: '#5C197B',
                            dataSource: 'inline',
                            columns: ['$0', '$5K', '$10K', '$15K'],
                            label: '$7,500',
                            value: 50
                        },
                        {
                            title: 'Precious Metals',
                            type: 'column',
                            width: '2', height: '2',
                            color: '#009CCC',
                            dataSource: 'inline',
                            columns: ['Copper', 'Silver', 'Gold', 'Platinum'],
                            value: [8.94, 10.49, 19.30, 21.45],
                            format: '${0}'
                        }
        ];

    };

    self.resetDashboard();

});


