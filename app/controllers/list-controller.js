angular.module('app').controller('listController', ['InmuebleService', listController]);

function listController(inmuebleService){

  var lsctrl = this;

  inmuebleService.buscar().then(function(data){
    lsctrl.inmuebles = data;
  });

}

angular.module('app').filter('currencyChange', function() {

  return function(input) {

    var output;
    input = input.toUpperCase();
    switch (input) {
      case "USD":
        output = "U$S";
        break;
      case "ARS":
        output = "$";
        break;
    }

    return output;
  }

});
