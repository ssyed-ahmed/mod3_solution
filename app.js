(function() {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
      var search = this;

      search.searchTerm = "";

  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {

        var promise = $http({
          method: 'GET',
          url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
        });

        promise.then(function(result) {
            var items = result.data;
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (item.description.toLowerCase().indexOf(searchTerm) !== -1) {
                return true;
              }
            }
            return false;
        })
        .catch(error) {
          console.log("Error while fetching menu items.", error);
        }
        return promise;
    };
  }

})();
