(function(){

	function HttpHelper($http) 
    {
		var httpHelper = this;
		
        httpHelper.get = function(url, params) 
        {
        	var promise = $http.get(url, params);
        	var dataPromise = promise.then(processResponse);
        	return dataPromise;
        }
		
		var processResponse = function (response) 
		{
			return response.data;
		}

	}
	
	angular.module('app').service('HttpHelper', ['$http', HttpHelper]);
	
	
})()
