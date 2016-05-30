'use-strict';

var User = function(){

	var settings = {};

	var requestUri = {
		newAcount : 'createAccount',
		login : 'getUser'
	}

	var extra = {
		
		lengthPassword 			: 3,

		delay 					: {

			showlogin : 3000

		},

		dom 					: {
			loginForm 				: '#login form',
			createAccountForm 		: '#new-account form',
			
			errors 						: {
				errorPassToShort		: '.pass-short',
				diferentPassword		: '.diferent-password',
				userExists				: '.user-exists',
				notFount				: '.not-found',
				noEmail					: '.no-email',
				noPass	 				: '.no-pass'
			}
		}
	}

	var lang = {};

	var globals = {};

	var userLogged = false;

	var preload = false;

	var initProfiles = function( updateLatLng ){
			
		var app = this;

		/*
		|  get device location
		*/
		
		mainApp.core.getLocation( function( position ){
			
			if( ! position ){
				mainApp.core.warnings( lang['no-logation'] );
				return false;	
			}
			
			var deviceLatLng = [ position.lat, position.lng ].join(', ');


			/*
			|  from device refresh
			*/
			
			if( updateLatLng != false ){
				app.getFromUser( 'latlng', function( latlng ){
					app.checkLatLng( latlng, deviceLatLng );
				} );
			} 


			/*
			|  from login
			*/

			else{
				app.checkLatLng( userLogged.latlng, deviceLatLng );
			}
		} );
	};

	var loginCallback = function( user, preload ){

		var app = this;

		mainApp.core.preloadRemove( preload );

		if( user ){

			/*
			| save userLogged
			*/

			userLogged = user[0];
			
			$.cookie('UL', JSON.stringify( userLogged ) );

			/*
			| save last connection
			*/

			mainApp.core.updateByField( { userId : userLogged.id , fields : { last_connection : '"' + moment() + '"' } } );
			
			/*
			| reset login form
			*/

			app.resetFields();
			
			/*
			| show profiles
			*/
			
			initProfiles.call( app, false );

		} else {
			app.resetFields();
			globals.dom.errors.notFount.addClass('active');
		}
	} 

	return {

		init : function( s , l){

			var app = this;

			/*
			|  ADD LANG
			*/

			lang = l;		

			/*
			|  ADD SETTINGS
			*/

			settings = mainApp.core.addSettings( settings, extra, s );

			/*
			|  dom referens
			*/

			globals = mainApp.core.saveDomReferences( globals, settings, 'dom');



			/*
			|  CHECK IF LOGGED USER
			*/


			userLogged = app.getLoggedUser();	


			if( userLogged ){

				/*
				|  REDIRECT TO PROFILES
				*/
				initProfiles.call( app );
				
				return false;
						
			}


			/*
			| show login
			*/

			mainApp.core.changePage("#login", function(){

				/*
				|  AUTO INIT LAUNCHERS
				*/
			
				mainApp.core.startLaunchers.call( app, app.launchers );
			} );
		},


		





		/*
		|  STARTS LAUNCHERS
		*/

		launchers : [


			/*
			| login
			*/

			function(){

				var app = this;

				globals.dom.loginForm.unbind('submit').bind( 'submit', function(){
					app.login( $(this) ) ;
				} );
				
			},
		
			/*
			| new account form 
			*/

			function(){
				var app = this;
				
				globals.dom.createAccountForm.unbind('submit').bind( 'submit', function(){
					app.newAcount( $(this) );
				} );
			
			}

		],
		
		/*
		| ends launchers
		*/
		


			













		/*
		| starts getters
		*/

		getLoggedUser : function() {
			var u = $.cookie( 'UL' );
			if( u ){
				u.source = 'cookie';
				userLogged = JSON.parse( u );
				return userLogged;
			} else {
				return  false;
			}	
		},

		updateLoggedUser : function( callback) {
			var app = this;
			mainApp.core.request( settings.endpoint + '/getUserById' , { id : userLogged.id }, 
									function( user ){
										userLogged = user[0];
										$.cookie( 'UL' , JSON.stringify( userLogged ) );
										if( typeof callback == 'function' ) { callback() } ;
									});
		},
		
		getFromUser : function( column, callback) {
			var app = this;
			mainApp.core.request( settings.endpoint + '/getFromUser' , 
									{ 
										id : userLogged.id, 
										column : column, 
									}, 
									function( response ){
										if( typeof callback == 'function' ) { callback( response[0].column ) } ;
									});
		},
		

		/*
		| ends getters
		*/







		

		checkLatLng : function(latlng, deviceLatLng){
			var app = this;
			if( latlng != deviceLatLng ){
				
				/*
				| save lat lng
				*/

				mainApp.core.updateByField( { userId : userLogged.id , fields : { latlng : '"' + deviceLatLng + '"' } }, function(){
					
					/*
					| update user
					*/

					app.updateLoggedUser( function(){
						mainApp.Profiles.init( settings, userLogged );
					} );
				} );
			} else {
				mainApp.Profiles.init( settings, userLogged  );
			}
		},

		logout : function(){
			$.cookie( 'UL', null, { path : '/' } ) ;
		},

		login : function( form ){
			
			var app = this;

			var url  = settings.endpoint + '/' + requestUri.login;

			var data = form.serializeObject();

			data.email = $.trim( data.email );
			
			data.password = $.trim( data.password );
			
			var callback = function( user ){
				loginCallback.apply( app, [ user, preload ]);						
			}

			/*
			| email
			*/

			if( ! mainApp.core.validations.email( data.email ) ){
				app.resetFields()
				globals.dom.errors.noEmail.addClass('active');
			}

			/*
			| pass
			*/
		
			else if( data.password.length == 0  ){
				app.resetFields();
				globals.dom.errors.noPass.addClass('active');
			} 


			/*
			| get
			*/
		
			else {
				app.resetFields();
				preload = mainApp.core.preload( form, settings['path-to-images'] + '/435.GIF' );
				mainApp.core.request( url, data, callback);
			}
		},

		newAcount : function( form ){
			
			var app = this;

			var url = settings.endpoint + '/' + requestUri.newAcount;

			var data = form.serializeObject();

			data.email = $.trim( data.email );
			data.passwordI = $.trim( data.passwordI );
			data.passwordII = $.trim( data.passwordII );

			var callback = function( data ){

				mainApp.core.preloadRemove( preload );

				if( ! data.id ){
					app.resetFields();	
					globals.dom.errors.userExists.addClass('active').html( data.message );
				} else {
					app.resetFields();	
				}
			
			}

			/*
			| equals password
			*/

			if ( data.passwordI != data.passwordII ){
				app.resetFields();	
				globals.dom.errors.diferentPassword.addClass('active');
			} 


			/*
			| valid email
			*/
			else if( ! mainApp.core.validations.email( data.email ) ){
				app.resetFields();	
				globals.errors.noEmail.addClass('active');
			} 



			else{

				/*
				| short pass
				*/
				
				if( data.passwordI.length <= settings.lengthPassword ) {
					app.resetFields();
					globals.dom.errors.errorPassToShort.addClass('active');
				} 
				

				/*
				| create
				*/

				else{
					app.resetFields();	
					preload = mainApp.core.preload( form, settings['path-to-images'] + '/435.GIF' );
					mainApp.core.request( url, data, callback );
				}

			}

		},

		resetFields : function(){
			$.each( globals.dom.errors, function(){
				$(this).removeClass('active');
			} );
		},

	}

}	

mainApp.User = User();