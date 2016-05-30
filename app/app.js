(function(){

	"use strict";

	angular

		.module("app",  ["ui.router"] )

		.config(function($stateProvider, $urlRouterProvider) {

		 	$urlRouterProvider.otherwise("/");

			$stateProvider

			 .state('project', {
				 url: "/",
				 templateUrl: "partials/home.html"
			 } )

		} );

})()
