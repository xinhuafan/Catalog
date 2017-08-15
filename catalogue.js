var app = angular.module('catalogueApp', ['ngRoute', 'infinite-scroll']);
app.factory('catalogueService', function($http) {
    var catalogueObj = {};
    catalogueObj.fetchCatalogueDetails = function() {
        return $http.get("catalogue.json");
    }

    catalogueObj.loadMore = function(rawSource, curSource) {
      curSource = rawSource.slice(0, curSource.length + 10);
      return curSource;
    }

    catalogueObj.get = function(source, id) {
      var i;
      for (i in source) {
        if (source[i].id == id) {
          return source[i];
        }
      }
    }

    catalogueObj.remove = function(id) {
      var i;
      for (i in catalogueObj.catalogues) {
        if (catalogueObj.catalogues[i].id == id) {
          catalogueObj.catalogues.splice(i, 1);
          break;
        }
      }
    }
    
    catalogueObj.save = function(source, newproduct) {
      if (newproduct.id == null) {
        newproduct.id = source.length + 1;
        source.push(newproduct);
      } else {
        var i;
        for (i in source) {
          if (source[i].id == newproduct.id) {
            source[i] = newproduct;
            break;
          }
        }
      }

      return source;
    }

    return catalogueObj;
});

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "listView.html",
        controller: "listViewCtrl"
    })
    .when("/gridView", {
        templateUrl: "gridView.html",
        controller: "gridViewCtrl"
    })
    .when("/newProduct", {
        templateUrl: "newProduct.html",
        controller: "newProductCtrl"
    })
    .when("/editProduct/:id", {
        templateUrl: "editProduct.html",
        controller: "editProductCtrl"
    })
    .otherwise({
        redirectTo: "/listView.html"
    });
});

app.controller('listViewCtrl', function ($scope, catalogueService) {
  catalogueService.fetchCatalogueDetails().success(function(data) {
    var source = data.data;
    for (var i = 1; i <= source.length; i++) {
      source[i - 1].id = i;
    }

    $scope.catalogues = source.slice(0, 10);
    $scope.loadMore = function(rawSource, curSource) {
      $scope.catalogues = catalogueService.loadMore(source, $scope.catalogues);
    }

    $scope.deleteProduct = function(id) {
      $scope.catalogues = catalogueService.remove($scope.catalogues, id);
    }
  });
});

app.controller('gridViewCtrl', function ($rootScope, $scope, catalogueService) {
  catalogueService.fetchCatalogueDetails().success(function(data) {
    var source = data.data;
    for (var i = 1; i <= source.length; i++) {
      source[i - 1].id = i;
    }

    $scope.catalogues = source.slice(0, 10);
    $scope.loadMore = function(rawSource, curSource) {
      $scope.catalogues = catalogueService.loadMore(source, $scope.catalogues);
    }

    $scope.deleteProduct = function(id) {
      $scope.catalogues = catalogueService.remove($scope.catalogues, id);
    }
  });  
});

app.controller('newProductCtrl', function ($scope, catalogueService) {
  catalogueService.fetchCatalogueDetails().success(function(data) {
    var source = data.data;
    for (var i = 1; i <= source.length; i++) {
      source[i - 1].id = i;
    }

    $scope.catalogues = source.slice(0, 10);
    $scope.saveChanges = function() {
      $scope.catalogues = catalogueService.save($scope.catalogues, $scope.newproduct);
      $scope.newproduct = {};
    }
  });  
});

app.controller('editProductCtrl', function ($scope, catalogueService, $routeParams) {
  catalogueService.fetchCatalogueDetails().success(function(data) {
    var source = data.data;
    for (var i = 1; i <= source.length; i++) {
      source[i - 1].id = i;
    }

    $scope.catalogues = source.slice(0, 10);
    $scope.newproduct = angular.copy(catalogueService.get($scope.catalogues, $routeParams.id));
    $scope.saveChanges = function() {
      $scope.catalogues = catalogueService.save($scope.catalogues, $scope.newproduct);
      $scope.newproduct = {};
    }
  });
});
