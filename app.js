(function() {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItems);

  function FoundItems() {
    var ddo = {
      restrict: 'E',
      templateUrl: 'searchResults.html',
      scope: {
        itemsList: '=myItemsList'
        // onRemove: '&'
      }
      //controller: NarrowItDownDirectveController,
      //controllerAs: 'dirSearch',
      //bindToController: true
    };

    return ddo;
  }

  function NarrowItDownDirectveController() {
    var dirSearch = this;

    dirSearch.remove = function(myIndex) {
      dirSearch.onRemove({index: myIndex});
    }

  }

  NarrowItDownController.$inject = ['MenuSearchService', '$q'];
  function NarrowItDownController(MenuSearchService, $q) {
      var search = this;

      search.searchTerm;

      search.foundItems = [];

      search.nothingFound = false;

      search.getMatchedMenuItems = function(searchTerm) {
        var deferred = $q.defer();
        var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
        promise.then(function(result) {
          var items = result;
          deferred.resolve(items);
          search.foundItems = items;
          if (search.foundItems.length === 0) {
            search.nothingFound = true;
          } else {
            search.nothingFound = false;
          }
          return search.foundItems;
        },
        function(error) {
          console.log("Error while fetching menu items.", error);
          deferred.reject();
        });
        return deferred.promise;
      };

      search.removeItem = function(index) {
        search.foundItems.splice(index, 1);
      };
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
          throw new Error("Error while fetching menu items.", error);
        });
    };
  }

})();
