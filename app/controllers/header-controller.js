angular.module('app').controller('headerController',function(){

  var hctrl = this;

  hctrl.operacion = [
    {name:"Venta",id:"0"},
    {name:"Alquiler",id:"1"},
    {name:"Alquiler Temporal",id:"2"}
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

});
