(function() {
'use strict';

    angular
        .module('mapa')
        .controller('MapaController', MapaController);

    MapaController.$inject = ['MapaService', '$mdDialog'];
    function MapaController(MapaService, $mdDialog) {
        var vm = this;
        var alert;
        vm.dataFromServer = [];
        vm.titulo = 'Procesando petición.';
        vm.loadingData = false;
        vm.dataLoaded = false;
        MapaService.initMap();
        function showLoading() {
            //Show loading
            vm.loadingData = true;
            vm.titulo = 'Procesando petición.';
        }
        
        function hideLoading() {
            //Hide loading
            vm.loadingData = false;
            vm.titulo = 'Resultados de la consulta.';
        }
        
        function showAlert(title, body) {
            alert = $mdDialog.alert({
                title: title,
                textContent: body,
                ok: 'OK'
            });
            $mdDialog
                .show( alert )
                .finally(function() {
                alert = undefined;
                });
        }
    }
})();