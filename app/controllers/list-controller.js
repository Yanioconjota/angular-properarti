angular.module('app').controller('listController', ['InmuebleService', listController]);

function listController(inmuebleService){

  var lsctrl = this;

  lsctrl.ordenListado = [
    {name : "Relevancia", id:0, jsonAttribute: " ", reverse: false},
    {name : "Precio Ascendente", id:1, jsonAttribute: "price", reverse: false},
    {name : "Precio Descendente", id:2, jsonAttribute: "price", reverse: true},
    {name : "Fecha", id:3, jsonAttribute: "updated_on", reverse: false},
    {name : "Superficie", id:4, jsonAttribute: "surface_total", reverse: false}
  ];

  lsctrl.ordenSelected = lsctrl.ordenListado[0];

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
