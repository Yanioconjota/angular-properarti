'use-strict';

var Lang = function(){

	var settings = {};
	
	var extra = {};

	var lang = {};

	var selector = '*[data-lang]';

	return {

		init : function( l ){

			var app = this;



			lang = l;



			/*
			|  AUTO INIT LAUNCHERS
			*/

			mainApp.core.startLaunchers.call( app, app.launchers );


		},

		launchers : [
		
			function(){
				this.lang();
			}
		
		],

		lang : function(){
			var app = this;
			$.each( $(selector), function(){
				var key = $(this).attr('data-lang');
				
				$(this)
					.html( lang[key] )
					.removeAttr('data-lang');

			} );	
		},

		get : function(){
			return lang; 	
		}
	}

}	

mainApp.Lang = Lang();