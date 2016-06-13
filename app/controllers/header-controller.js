angular.module('app').controller('headerController',['InmuebleService', headerController]);

  function headerController(inmuebleService){

    var hctrl = this;

    hctrl.operacion = [
      {name:"Venta",id:"0", operacion: "operation_name"},
      {name:"Alquiler",id:"1", operacion: "operation_name"},
      {name:"Alquiler Temporal",id:"2", operacion: "operation_name"}
    ];

    hctrl.operacionSelected = hctrl.operacion[0];

    hctrl.ambiente = [
      {name:"Indistinto",id:"0"},
      {name:"Monoambiente",id:"1"},
      {name:"2 ambientes",id:"2"},
      {name:"3 ambientes",id:"3"},
      {name:"4 o mas ambientes",id:"4"}
    ];

    hctrl.ambienteSelected = hctrl.ambiente[0];

    hctrl.superficie = [
      {name : "Superficie", id:0, jsonAttribute: "surface_total"}
    ];

    hctrl.superficieSelected = hctrl.superficie[0];
  }
