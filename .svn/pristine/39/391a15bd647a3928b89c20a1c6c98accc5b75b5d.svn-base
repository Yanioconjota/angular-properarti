'use-strict';

var Goomap = function(){

	var globals = {};

	var settings = {};

	var extra = {

		resizeDelay 	: 500,

		map  			: {

							configs					: {

														zoom 				: 15,
														scrollwheel			: true,
														scaleControl		: true,
														disableDefaultUI	: true
							
													},

							contentInfowindow 		: '<div class="infowindow">' +
															'<div>' +
																'<div id="bodyContent"> ' +
																	'<div class="table pointer cover" style="background-image:url(__image__)" data-userid="__id__">' +
																		'<div></div>' +
																	'</div>' +
																'</div>' +	
															'</div>'	+
														'</div>'	
								
						},

		dom  			: {

							goomap 					: '#goomap',
							goomapBtn				: 'a[href="#goomap"]',
							profilesBtn				: 'a[href="#profiles"]',
							back 					: '.goomap-back'
						
						}

	}; 

	var loggedUser = false;

	var users = [];	

	return {

		init : function(){

			var app = this;
			

			/*
			|  ADD USER LOGGED
			*/


			loggedUser = mainApp.User.getLoggedUser();

			/*
			|  ADD SETTINGS
			*/
			
			settings = mainApp.core.addSettings( settings, extra, SETTINGS );


			/*
			|  dom references
			*/

			globals = mainApp.core.saveDomReferences( globals, settings, 'dom');


			/*
			|  auto init launchers / events 
			*/

			mainApp.core.startLaunchers.call( app, app.launchers );
			mainApp.core.startLaunchers.call(app, app.events);


		},






		/*
		|  starts launchers
		*/


		launchers : [			

			function(){
				this.inizialize();
			}
		],


		/*
		|ends launchers
		*/









		/*
		| starts events
		*/


		events : [


			/*
			| back profiles
			*/

			function(){
				var app = this;
				globals.dom.back.unbind('click').bind('click', function(){
					mainApp.core.changePage("#profiles", function(){
						app.infowindow.close();
					} );
				});
			}
		],

		/*
		| ends events
		*/






		/*
		| starts markers
		*/

		markers : {

			all : {},

			get : function( user ){

				var app = this;

				/*
				| configs
				*/
				var latlng = app.getLatlon( user.latlng );
				
			    marker = new google.maps.Marker( {
											        position : new google.maps.LatLng( latlng.lat, latlng.lng ),
											        map : app.map
											    } );

				/*
				| click
				*/		
				google.maps.event.addListener( marker, 'click', ( function( marker, user ) {
					return function() {
						var content = app.getReplacedContent( user, settings.map.contentInfowindow );
						app.infowindow.setContent( content );
						app.infowindow.open( app.map, marker );
					}
				})( marker , user ));
		        
				return marker;
			},

			placeUser :  function ( user ) {
				var app = this;
				
				var latlng = app.getLatlon( user.latlng );
				
				var position = new google.maps.LatLng( latlng.lat, latlng.lng );

				/*
				| show map
				*/

				mainApp.core.changePage("#goomap", function(){ 

					/*
					| set center
					*/
					
					app.map.setCenter( position );
					
					setTimeout( function(){

						google.maps.event.trigger( app.map, 'resize');
						
						/*
						| open infowindow
						*/

						app.map.setCenter( position );
						app.infowindow.open( app.map, app.markers.all[ user.id ] );
						app.infowindow.setContent( app.getReplacedContent( user, settings.map.contentInfowindow ) );

					}, settings.resizeDelay );
				} );
			},
		},


		/*
		| ends markers
		*/




		inizialize : function(){
			var app = this;

			if( typeof google == 'undefined' ){ 
				app.waitGoogle();
				return false;
			}
			
			/*
			| map 
			*/

			settings.map.configs.MapTypeId = google.maps.MapTypeId.ROADMAP;
			app.map = new google.maps.Map( document.getElementById('map'), settings.map.configs );
		
			/*
			| infowindow 
			*/

			app.infowindow = new google.maps.InfoWindow();
			
			/*
			| CLICK INSIDE 
			*/

			google.maps.event.addListener( app.infowindow, 'domready', function() {
				$('#bodyContent .pointer').bind('click', function(){
					mainApp.Chat.init.call( mainApp.Chat, mainApp.Profiles.getUsers( $(this).attr('data-userid') ) );	
				} );
			});

			/*
			| markers 
			*/

			users = mainApp.Profiles.getUsers();

			if( users ){
				app.markers.all = [];
				for( var i in users ){
					app.markers.all[  users[i].id ] = app.markers.get.call( app, users[i] );
				}
			}
		} ,

		waitGoogle : function(){
			var app = this;
			setTimeout(function(){
				app.inizialize();
			}, 500)
		},

		getLatlon : function ( str ) {
			var aStr = ( str ) ? str.split(',') : null ;
			return ( str == null ) ? false : { lat : aStr[0], lng : aStr[1] }
		},
		
		getReplacedContent : function( user, content ){
			for( var i in user){
				var regExp = new RegExp( '__' + i +'__' , 'g');
				switch( i ){
					case 'image' : 
							content = content.replace( regExp, settings['path-to-images'] + '/users/thumbs/' + user[i] );
						break;
					default : content = content.replace( regExp, user[i] );
				}
			}
			return content;
		},

		getZomm : function(){ return settings.map.configs.zoom },

		getMap : function(){ return this.map }

	}
}	

mainApp.Goomap = Goomap();