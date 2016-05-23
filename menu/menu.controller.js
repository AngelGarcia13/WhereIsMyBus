(function() {
'use strict';

    angular
        .module('menu')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$mdSidenav', '$location'];
    function MenuController($mdSidenav, $location) {
        var vm = this;
        vm.goTo = goTo;
        vm.toggleList = toggleMenuList;
        
        /**
         * Navigate to
        */
        function goTo(param) {
            $location.path(param);   
        }
        
        /**
         * Hide or Show the 'left' sideNav area
        */
        function toggleMenuList() {
            $mdSidenav('left').toggle();
        }
    }
})();