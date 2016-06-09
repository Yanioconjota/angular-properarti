angular.module('app').controller('listController', ['InmuebleService', listController]);

function listController(inmuebleService){

  var lsctrl = this;

  lsctrl.ordenListado = [
    {name : "Precio", id:0, jsonAttribute: "price"},
    {name : "Direccion", id:1, jsonAttribute: "address_title"},
    {name : "Superficie", id:2, jsonAttribute: "surface_total"}
  ];

  lsctrl.ordenSelected = lsctrl.ordenListado[0]

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
