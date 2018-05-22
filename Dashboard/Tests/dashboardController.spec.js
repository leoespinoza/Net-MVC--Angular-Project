/// <reference path="../Scripts/es6-promise.auto.min.js" />
/// <reference path="../Scripts/jquery-3.2.1.min.js" />
/// <reference path="../Scripts/Scripts/jquery-ui.min.js" />
/// <reference path="../Scripts/jquery-ui.touch-punch.js" />
/// <reference path="../Scripts/spectrum.js" />
/// <reference path="../Scripts/toastr.js" />
/// <reference path="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" />
/// <reference path="../Scripts/angular.js" />
/// <reference path="../Scripts/angular-mocks.js" />
/// <reference path="../app/app.module.js" />
/// <reference path="../components/dashboard/google.chart.service.js" />
/// <reference path=""https://www.gstatic.com/charts/loader.js" />
/// <reference path="../components/dashboard/demo.data.service.js" />
/// <reference path="../components/dashboard/dashboard.component.js" />


// Unit test (not complete, not ready for use)

// test support functions

function httpGetSync(filePath) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, false);
    xhr.send();
    return xhr.responseText;
}

function preloadTemplate(path) {
    return inject(function ($templateCache) {
        var response = httpGetSync(path);
        $templateCache.put(path, response);
    });
}

function loadFile(path) {
    return httpGetSync(path);
}

// tests

describe('component: dashboard', function () {
    var $rootScope = null;
    var element, scope;
    var ChartService, httpBackend;

    beforeEach(module('dashboardApp'));
    beforeEach(module('dashboard'));
    beforeEach(preloadTemplate('/components/dashboard/dashboard.template.html'));

    var ChartService, DataService, http, controller, $ctrl;

    beforeEach(inject(function (_$rootScope_, _$compile_, $injector) {

        $compile = _$compile_;
        $rootScope = _$rootScope_;

        scope = $rootScope.$new();

        //element = angular.element('<div style="width: 1920px"><dashboard id="dashboard"></dashboard></div>');

        // emulate index.html page, compile the page, and apply a digest cucle.

        //var html = loadFile('/index.html');
        //element = angular.element(html);

        element = angular.element('<head><title>Dashboard</title><meta charset="utf-8" /><link rel="icon" href="data:;base64,iVBORw0KGgo="><link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" /><link href="Content/css/dashboard.css" rel="stylesheet" /><link href="Content/css/toastr.css" rel="stylesheet" /><link href="Content/css/spectrum.css" rel="stylesheet" /><body><div style="width: 1920px"><dashboard id="dashboard"></dashboard></div></body>');

        $compile(element)(scope);
        scope.$digest();
        $ctrl = scope.$$childHead.$ctrl;
        //scope.$apply();
        //$rootScope.apply();
    }));

    // These tests confirm the controller contains expected properties 

    //it('$ctrl.debug has expected value', function () {
    //    expect($ctrl.debug).toEqual('08');
    //});

    //it('$ctrl.data has expected value', function () {
    //    //$rootScope.$digest();
    //    //scope.$digest();
    //    expect($ctrl.data).toEqual('03 tile count:8');
    //});


    it('$ctrl.title has expected value', function () {
        expect($ctrl.title).toContain('Dashboard');
    });

    it('$ctrl.chartProvider has expected value', function () {
        expect($ctrl.chartProvider).toContain('Google');
    });

    it('$ctrl.dataProvider has expected value', function () {
        expect($ctrl.dataProvider).toContain('Demo');
    });

    it('$ctrl.tilesacross has expected value', function () {
        var expectedTilesAcross = 8;
        expect($ctrl.tilesacross).toEqual(expectedTilesAcross);
    });

    it('$ctrl.tilesdown has expected value', function () {
        var expectedTilesDown = 10; 
        expect($ctrl.tilesdown).toEqual(expectedTilesDown);
    });

    it('$ctrl.tiles has expected length', function () {
        var expectedTileCount = 8;
        expect($ctrl.tiles.length).toEqual(expectedTileCount);
    });

    it('$ctrl.user.Username has expected value', function () {
        expect($ctrl.user.Username).toContain('john.smith');
    });

    // end expected controller property tests


    // This test invokes controller computeLayout and expects x and y tile properties.

    it('$ctrl.computeLayout sets tile.x and tile.y for every tile', function () {
        //expect($ctrl.pickerInitialized).toEqual(false);
        //$ctrl.LoadDashboard();
        //$ctrl.computeLayout();
        expect($ctrl.tiles.length).toBe(8);

        // every tile should now have an x and y property for positioning

        var tile = null;
        for (var t = 0; t < $ctrl.tiles.length; t++) {
            tile = $ctrl.tiles[t];
            expect(typeof tile.x).toBe("number");
            expect(typeof tile.y).toBe("number");
        }
    });


    //it('should contain a tile with title Site Traffic', function () {
    //    var expected = '';
    //    scope.item = {
    //        name: expected,
    //        active: true
    //    };

    //    scope.$digest();

    //    expect(element.text()).toContain(expected);
    //});















    //it('should display the controller defined title', function () {
    //    var expected = 'Site Traffic';
    //    scope.item = {
    //        name: expected,
    //        active: false
    //    };

    //    scope.$digest();

    //    expect(element.text()).toContain(expected);
    //});
});




// https://stackoverflow.com/questions/15214760/unit-testing-angularjs-directive-with-templateurl

//function httpGetSync(filePath) {
//    var xhr = new XMLHttpRequest();
//    //xhr.open("GET", "/base/app/" + filePath, false);
//    xhr.open("GET", filePath, false);
//    xhr.send();
//    return xhr.responseText;
//}

//function preloadTemplate(path) {
//    return inject(function ($templateCache) {
//        var response = httpGetSync(path);
//        $templateCache.put(path, response);
//    });
//}


//describe('Component: dashboard', function () {
//    //beforeEach(module("ChartService"));

//    beforeEach(module('dashboard'));
//    beforeEach(preloadTemplate('/components/dashboard/dashboard.template.html'));


    //var ChartService, $httpBackend;

    //beforeEach(module('dashboard'));
    //beforeEach(inject(function (_ChartService_, _$httpBackend_) {
    //    ChartService = _ChartService_;
    //    $httpBacked = _$httpBackend_;
    //}));

    //var ChartService;
    //beforeEach(function () {
    //    //module('dashboard');
    //    inject(function ($injector) {
    //        ChartService = $injector.get('ChartService');
    //    });
    //});


    //var ChartService, $rootScope;
    //beforeEach(inject(function ($injector) {
    //    var $injector = angular.injector(['ng', 'dashboardApp']);
    //    ChartService = angular.module('dashboardApp').service('ChartService');
    //    //ChartService = $injector.get('ChartService');
    //    //$rootScope = $injector.get('$rootScope');
    //}));

    //it('ChartProvider.chartProvider', function () {
    //    expect(ChartService.chartProvider).toBe('Google');
    //});

    //module(function($provide) {
    //    $provide.value('ChartService', ChartService);
    //    });

    //var ChartService = null;
    //var element;
    //var scope;
    //beforeEach(inject(function ($rootScope, $compile, $templateCache, _ChartService_) {
    //    scope = $rootScope.$new();

    //    ChartService = _ChartService_;

    //    //ChartService = $injector.get('ChartService');
    //    scope.ChartSevice = ChartService;

    //    //var $injector = angular.injector([ 'ng', 'dashboard' ]);
    //    //ChartService = $injector.get( 'ChartService' );
    //    //scope.ChartService = ChartService;

    //    //it('ChartProvider.chartProvider', function () {
    //    //    expect(ChartService.chartProvider).toBe('Google');
    //    //});

    //    element = angular.element('<dashboard id="dashboard"></dashboard>');
    //    element = $compile(element)(scope);
    //    scope.outside = '1.5';
    //    //scope.ChartSevice = ChartService;
    //    scope.$apply();
    //}));

    //it('should render the text', function () {

    //    //expect(ChartService.chartProvider).toBe('Google');

    //    var tile1 = element.find('#tile-1');
    //    expect(tile1.$el.html().indexOf('xxxx') != -1).toBe(true);

    //    //var panel = element.find('.dashboard-panel');
    //    //expect(h1.text()).toBe('Unit Testing AngularJS 1.5');
    //});

    //var ChartService, $rootScope;
    //beforeEach(inject(function ($injector) {
    //    //var $injector = angular.injector(['ng', 'dashboard']);
    //    ChartService = angular.module('dashboardApp').service('ChartService');
    //    //ChartService = $injector.get('ChartService');
    //    //$rootScope = $injector.get('$rootScope');
    //}));

    //it('ChartProvider.chartProvider', function () {
    //    expect(ChartService.chartProvider).toBe('Google');
    //});

//});


//describe("DashboardController", function () {

//    var controller = $componentController$('dashboard', null, null, null);

//    //var $controller,
//    //    $scope,
//    //    ChartService,
//    //    DataService;

//    //beforeEach(module('dashboardApp'));

//    //beforeEach(function() {
//    //    ChartService = jasmine.createSpyObj('ChartService', ['drawDonutChart', 'drawPieChart', 'drawBarChart', 'drawColumnChart']);
//    //    DataService = jasmine.createSpyObj('DataService', ['getTileLayout']);

//    //    module(function ($provide){
//    //        $provide.value('ChartService', ChartService);
//    //        $provide.value('DataService', DataService);
//    //    });
//    //});

//    //beforeEach(inject(function (_$controller_, $rootScope) {
//    //    $scope = $rootScope.$new();
//    //    $controller = _$controller_('DashboardController', {
//    //        $scope: $scope
//    //    });
//    //}));

//    it('should be defined and call services', function () {
//        expect($controller).toBeDefined();
//        //expect(ChartService.get).toHaveBeenCalled();
//        expect(DataService.getTileLayout).toHaveBeenCalled();
//    });

//    var element;
//    var scope;
//    beforeEach(inject(function ($rootScope, $compile) {
//        scope = $rootScope.$new();
//        element = angular.element('dashboard');
//        element = $compile(element, { $scope: scope })(scope);
//        //scope.outside = '1.5';
//        scope.$apply();
//    }));

//    it('Chart Provider should be "Google"', function () {
//        controller = element.controller('dashboard');
//        expect(controller.ChartProvider).toBe('Google');
//    });
//});



////describe("DashboardController", function () {
////    beforeEach(module('dashboardApp'));

////    var $controller, $scope, $window, $http, ChartService, DataService;

////    beforeEach(inject(function (_$controller_, _$rootScope_, _$window_, _$http_, _ChartService_, _DataService_) {
////        $scope = _$rootScope_.$new();
////        ChartService = _ChartService_;
////        DataService = _DataService_;
////        $window = _$window_;
////        $http = _$http_;

////        //spyOn(ChartService, 'method');
////        //spyOn(DataService, 'method');

////        $controller = angular.controller('dashboard');
////        //_$controller_(angular.controller('dashboard'),
////        //    {
////        //        $scope: $scope,
////        //        $window: _$window_,
////        //        $http: _$http_,
////        //        ChartService: ChartService,
////        //        DataService: DataService
////        //    });
////    }));

////    describe('$scope.ChartProvider', function () {
////        it('checks the ChartProvider has expected value of "Google"', function () {
////            //$scope.label = '12345';
////            //$scope.addNewPoint();
////            expect($scope.ChartProvider).toEqual('Google');
////        });
////    });
////});


//////describe('DashboardController ', function () {

//////    var $controller,
//////       $scope,
//////       $http,
//////       $window,
//////       ChartService,
//////       DataService;

//////    beforeEach(module('dashboardApp'));

//////    beforeEach(function () {
//////        ChartService = jasmine.createSpyObj('ChartService', ['get', 'save']);
//////        DataService = jasmine.createSpyObj('DataService', ['get', 'save']);

//////        module(function ($provide) {
//////            $provide.value('ChartService', ChartService);
//////            $provide.value('DataService', DataService);
//////        });
//////    });

//////    beforeEach(inject(function (_$controller_, $rootSope) {
//////        $scope = $rootScope.$new();
//////        $controller = _$controller_('DashboardController', {
//////            $scope: $scope
//////        });
//////    }));

//////    describe('$scope.ChartProvider'), function () {
//////        it('ChartProvider should be "Google"', function () {
//////            expect(scope.ChartProvider).toBe('Google');
//////        });
//////    }

//////});

////////describe('DashboardController ', function () {
////////    //initialize Angular
////////    //var app = module('dashboardApp');
////////    beforeEach(module('dashboardApp'));
////////    //beforeEach(module('dashboard'));

////////    //beforeEach(inject(function ($http) { }));
////////    //beforeEach(inject(function ($window) { }));

////////    beforeEach(inject(function($rootScope, $window, $http, _ChartService_, _DataService_, $controller) {
////////        var DashboardController = $controller('DashboardController', {
////////            '$rootScope': $rootScope,
////////            '$window': $window,
////////            '$http': $http,
////////            'ChartService': _ChartService_,
////////            'DataService': _DataService_
////////        }); 
////////    }));



////////    //parse out the scope for use in our unit tests.
//////////    var scope;
////////    //beforeEach(inject(function ($controller, $rootScope) {
////////    //    scope = $rootScope.$new();
////////    //    var ctrl = $controller('DashboardController',
////////    //        {
////////    //            $scope: scope,
////////    //            ChartService: angular.module('dashboard').service('ChartService'),
////////    //            DataService: angular.module('dashboard').service('DataService')
////////    //        });
////////    //}));

////////    //beforeEach(inject(function ($controller, $rootScope) {
////////    //    scope = $rootScope.$new();
////////    //    var ctrl = $controller('DashboardController',
////////    //        {
////////    //            $scope: scope,
////////    //            ChartService: angular.module('dashboard').service('ChartService'),
////////    //            DataService: angular.module('dashboard').service('DataService')
////////    //        });

////////    //    //inject(function ($http) { });
////////    //}));

////////    it('initial value is 5', function () {
////////        expect(scope.value).toBe(5);
////////    });
////////});

/////////// <reference path="D:\VSScratch\NgUTJasmine\NgUTJasmine\scripts/angular.js" />
/////////// <reference path="D:\VSScratch\NgUTJasmine\NgUTJasmine\scripts/angular-mocks.js" />
/////////// <reference path="D:\VSScratch\NgUTJasmine\NgUTJasmine\scripts/appController.js" />

function deferCreateCharts() {}