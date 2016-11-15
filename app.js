(function() {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService);

  NarrowItDownController.$inject = ['MenuSearchService', '$q'];
  function NarrowItDownController(MenuSearchService, $q) {
      var search = this;

      search.searchTerm;

      search.getMatchedMenuItems = function(searchTerm) {
        var deferred = $q.defer();
        var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
        promise.then(function(result) {
          var items = result;
          $q.resolve(items);
          return items;
        },
        function(error) {
          console.log("Error while fetching menu items.", error);
        });
        return deferred.promise;
      }

  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
        var foundItems = [];
        return $http({
          method: 'GET',
          url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
        }).then(function(result) {
            var items = result.data.menu_items;
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (item.description.toLowerCase().indexOf(searchTerm) !== -1) {
                foundItems.push(item);
              }
            }
            return foundItems;
        },
        function(error) {
          console.log("Error while fetching menu items.", error);
        });
    };
  }

})();
