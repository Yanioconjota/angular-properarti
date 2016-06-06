(function(){

	function InmuebleService(httpHelper)
    {
		var inmuebleService = this;
		
        inmuebleService.buscar = function()
        {
        	var promise = httpHelper.get('/app/server/properati.txt', {});
					return promise;
        	//promise.then(callbackBuscar);
        }

		var callbackBuscar = function (data) {
			console.log(data);
		}

		inmuebleService.obtenerPorId = function (id)
		{
			var promise = httpHelper.get('/app/server/uno.txt', {id: id});
        	var resultado = promise.then(function (data) {
        		var uno = data.filter(function(item) {
        			                    return item.id === id;
        		                });

        		return uno[0];
        	});

			return resultado;
		}


	}

	angular.module('app').service('InmuebleService', ['HttpHelper', InmuebleService]);


})()
