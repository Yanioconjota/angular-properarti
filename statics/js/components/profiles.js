'use-strict';

var Profiles = function(){

	var users = [];
	
	var userLogged = false;

	var lang = {};

	var globals = {};

	var settings = {};

	var extra = {

		
		page 					: 1,

		currentRadius			: 5,
		
		limit 					: 10,
		
		profileLoaderDelay		: 1500,

		requestUsers 			: 'getUsers',
		requestExtra 			: 'getExtra',
		
		cleanEmpty				:  "user_name,latlng,last_connection,description,date,address",
		membershipsItems 		:  "show_last_connection,show_location,show_age",

		dom 					: {

									profilesContainer		: '#profiles .profiles-container',
									templateExpandRadius 	: '#expand-radius',
									rangeNumber 	 		: '#expand-radius .range-number',
									expandRadius 	 		: '#expand-radius .radius',
									refresh 		 		: '#expand-radius .ui-icon-refresh',
									profile 				: '#profile',
									body 					: 'body'
								}
	};

	var template;

	return {

		init : function( s, u ){

			var app = this;

			/*
			|  ADD lang
			*/

			lang = mainApp.core.getLang(); 

			/*
			|  ADD SETTINGS
			*/
			
			settings = mainApp.core.addSettings( settings, extra, s );

			/*
			|  dom references
			*/

			globals = mainApp.core.saveDomReferences( globals, settings, 'dom', 'profiles');


			/*
			|  relation tables
			*/

			globals.extra = {};

			/*
			|  GET USER LOGGED
			*/


			userLogged = u;
			
			/*
			|  AUTO INIT LAUNCHERS
			*/

			mainApp.core.startLaunchers.call( app, app.launchers );

		},












		/*
		| starts events
		*/


		events : [ 
		

			/*
			| open ui-footer
			*/

			function(){

				var app = this;
				
				var opened = [];
			
				$('.profile *[data-icon="carat-u"]')
														.unbind('click')
														.bind( 'click', function() { 

													
															var e = $(this);

															var id_user = e.attr('data-userId');
															var className = e.attr( 'class' );
															var str = 'ui-icon-carat-' + ( ( e.hasClass('ui-icon-carat-u') ) ? 'd' : 'u' ) 

															className = className.replace(/(ui-icon-carat-u)|(ui-icon-carat-d)/g, str);
															e.attr( 'class', className );
															
															var footer = e.closest('.ui-footer');	
															var profiles = globals.dom.profile.children();
															
															/*
															| save once them just open
															*/
															
															
															if( globals.extra[ id_user ] == undefined ){

																opened = app.searchIdUser( opened , id_user );

																app.getExtraFromUser( id_user, e, function(){
																	footer.toggleClass( 'active' );
																} );
																
															} else {
																footer.toggleClass( 'active' );
															}
														} );
			},


			/*
			| view location
			*/

			function(){
				var app = this;
				var userLogged = mainApp.User.getLoggedUser();
				$('.profile *[data-icon="navigation"]').unbind('click').bind( 'click', function(o){ 
					mainApp.Goomap.markers.placeUser.call( mainApp.Goomap, app.getUsers( $(this).attr('data-userid') ) );
				} );
			},

			/*
			| chat
			*/

			function(){
				var app = this;
				var userLogged = mainApp.User.getLoggedUser();
				$('.profile *[data-icon="comment"]').unbind('click').bind( 'click', function(o){ 
					mainApp.Chat.init.call( mainApp.Chat, app.getUsers( $(this).attr('data-userid') ) );
				} );
			}

		],

		eventExpandRadius : function ( container ) {
			var app = this;
			container.find('.ui-icon-refresh').unbind('click').bind('click', function(){ 
				globals.currentRadius = $(this).closest('.expand-radius').find('.range-number').eq(1).val();
				app.getUsersFromDB();
			} );
		},

		searchIdUser : function( opened, id_user ){
			if( opened.indexOf( id_user ) == -1 ){
				opened.push( id_user );
			} else {
				for( var i = 0; i < opened.length; i++ ){ 
					opened[i] == id_user 
						? opened.splice( i , 1 ) 
						: false ;
				}
			} 
			return opened;
		},

		/*
		| ends events
		*/







		/*
		| starts launchers
		*/


		launchers : [

			
			/*
			|  GET USERS
			*/

			function(){

				var app = this;

				var currentRadius = $.cookie('currad');
				
				globals.currentRadius = currentRadius ? currentRadius : settings.currentRadius ;	

				/*
				|  SAVE CURRENT RADIUS
				*/
				
				if( currentRadius == undefined ){ $.cookie('currad', globals.currentRadius ) } ;
	
				/*
				|  GET USERS
				*/
				
				app.getUsersFromDB();

			}
		],


		/*
		| ends launchers
		*/







		/*
		| starts profile user
		*/

		checkMembership : function( u, profile ){
			var app = this;
			var a = settings.membershipsItems.split(',');
			for( var i in a ){
				if( u[ a[i] ] == 0 ) {
					profile.find( '.' + a[i]).remove();
				}
			}
			return profile			
		},

		cleanEmptyAttrs : function( u, profile ){
			globals.cleanEmpty = settings.cleanEmpty.split(',');
			for( var i in globals.cleanEmpty ){ 
				if( u[ globals.cleanEmpty[i] ] == null || u[ globals.cleanEmpty[i] ] == '0000-00-00' ) {
					profile.find( '.'+globals.cleanEmpty[i] ).remove();
				}
			}	
			return profile
		},

		getUserProfile : function(u){
			
			var app = this;

			/*
			| replace content
			*/

			var innerHtml = app.replaceContent( u, template.removeAttr('id').html() );
			
			/*
			| name classes
			*/

			var theClassName = template.attr('class').replace(/hidden/g, ''); 


			/*
			| user profile
			*/

			var profile = $('<'+ template[0].tagName +'/>')
															.addClass( theClassName )
															.html( innerHtml )
															.css( 'background-image' ,  'url(' + settings['path-to-images'] + '/users/thumbs/' + u.image + ')' );

			/*
			| check membership
			*/	

			profile = app.checkMembership( u, profile );
			
			/*
			| clean  empty attributes 
			*/

			profile = app.cleanEmptyAttrs( u, profile );
			
			/*
			| save user id
			*/

			profile.find('.ui-footer button[data-icon*="carat-"]').attr('data-userId', u.id );
			
			/*
			| open slide
			*/

			profile.find('button[data-icon="camera"]').unbind( 'click').bind( 'click', function(){ mainApp.Slide.getImagesUser( $(this).attr('data-userId') )} );


			/*
			| zoom profile
			*/
			
			profile.find('.zoom-in').bind('click', function(){ 

				var fullSize = profile.clone(true , true)

											.addClass('full-size')
											.css( {
												'-webkit-background-size': settings['thumbnail-full-size'],
												'-moz-background-size': settings['thumbnail-full-size'],
												'-o-background-size': settings['thumbnail-full-size'],
												'background-size': settings['thumbnail-full-size']
											} );

				fullSize.find('.back')
									.removeClass('hidden')
									.bind('click', function(){
										globals.dom.profilesContainer.find('.full-size')
																					.fadeOut(function(){
																						$(this).remove();	
																					});
									});
				globals.dom.profilesContainer.append( fullSize );
			} );


			/*
			| append
			*/
			
			globals.dom.profile.append( profile.fadeIn() );
		},

		/*
		| ends profile user
		*/







		/*
		| starts buttons
		*/

		buttons : {

			back : function( container ){
				var app = this;
				var last = globals.dom.profile.find('> *:last-child').clone().html('').attr('style', '').removeClass('hidden');
				var back = $('<div class="table"/>')
									.append( $('<div class="text-center"/>')
													.html( '<a href="index.html" class="inline no-float ui-btn ui-shadow ui-corner-all ui-icon-back ui-btn-icon-notext">Back</a>' ) ); 
					back.unbind('click').bind( 'click', function(){ 
						settings.page = 1;
						globals.acummUsers = 0;
						app.getUsersFromDB() ;
					} );
				container.append( last.append( back ) ) ;
			},

			moreUsers : function( container ){
				var app = this;
				var last = globals.dom.profile.find('> *:last-child').clone().html('').attr('style', '').removeClass('hidden');
				var more = $('<div class="table"/>')
									.append( $('<div class="text-center"/>')
													.html( '<a href="index.html" class="inline no-float ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext">More</a>' ) ); 
					more.unbind('click').bind( 'click', function(){ 
						settings.page++;
						app.getUsersFromDB() ;
					} );
				last.append( more );
				container.append( last ) ;
			}
		},


		/*
		| ends buttons
		*/










		getUsersFromDB : function(){
			
			var app = this;
			
			var url = settings.endpoint + '/' + settings.requestUsers;

			var data = { 
				limit : settings.limit, 
				page : settings.page, 
				km : globals.currentRadius
			};

			if( userLogged.latlng != null ){
				var a = userLogged.latlng.split(',');
				data.lat = a[0];
				data.lng = a[1];
			}



			/*
			|  UPDATE CURRENT RADIUS
			*/

			$.cookie('currad', globals.currentRadius );

			var path = settings['path-to-images'] + '/482.GIF';
			var preload = mainApp.core.preload( globals.dom.body, path );
			var callback = function( response ){
	
				/*
				| last conections
				*/
				
				globals.lastConections = {};
				
				/*
				| save girls
				*/

				globals.usersResponse = response;
				
				/*
				| show girls if there are
				*/
				
				if( globals.usersResponse.users.length > 0 ){
					preload.remove(); 
					if ( jQuery.mobile.activePage.attr('id') != 'profiles' ){
						mainApp.core.changePage('#profiles', function(){
							app.getProfiles();
						} );
					} else {
						app.getProfiles(); 
					}

					/*
					| force chat
					$('.profile').eq(4).find('*[data-icon="comment"]').trigger('click')	
					*/

				} 

				/*
				| if no girls shows expand radius controlls on warning page ( full screen )
				*/

				else {
				
					/*
					|  setting expand controls
					*/

					mainApp.core.changePage('#expand-radius', function(){
						preload.remove(); 
						var expandRadius = $('#expand-radius');
						globals.dom.expandRadius.html( globals.currentRadius + settings.units[ mainApp.core.getUserLanguage() ].kilometers );
						app.eventExpandRadius( expandRadius.removeClass('hidden').addClass('full-size') );
						app.fixExpandControls( expandRadius );
					} );
				}
			};

			mainApp.core.request( url, data, callback );	
		},

		getProfiles : function( callback ){

			var app = this;
						
			/*
			| save templeate and clean
			*/

			template = globals.dom.profile.find('.template').clone(true, true);
			
			globals.dom.profile.html('');
			
			/*
			| count users
			*/

			if( typeof globals.acummUsers == 'undefined' ){ globals.acummUsers = 0 }
			
			globals.acummUsers += settings.limit;

			/*
			| create dom profiles
			*/

			for( var i in globals.usersResponse.users ){ app.getUserProfile( globals.usersResponse.users[i] ) } ;

			
			var countUsers = parseInt( globals.usersResponse.count );
			

			var areMore = ( globals.acummUsers < countUsers ) ? true : false;
			
			/*
			| more users
			*/

			if ( areMore ) {
				app.buttons.moreUsers.call( app, globals.dom.profile ) ;

				/*
				| reset search
				*/
		
				if ( settings.page > 1 ){
					app.buttons.back.call( app, globals.dom.profile ) ;
				}
			} 

			/*
			| expand radius & reset page index
			*/

			else {
				app.buttons.back.call( app, globals.dom.profile ) ;
				globals.acummUsers = 0;
				settings.page = 1;
				app.getExpandControls( globals.dom.profile ) ;
			}

			/*
			| custom scroll ui footer
			*/
			
			mainApp.core.addCustomScroll( globals.dom.profile );

			/*
			| events
			*/

			mainApp.core.startLaunchers.call( app, app.events );

			/*
			| init map
			*/

			mainApp.Goomap.init();


			/*
			| CALLBACK
			*/

			if( typeof callback == 'function' ) { callback() } ;
		},

		getExpandControls : function(){
			var app = this;
			var last = globals.dom.profile.find('> *:last-child').clone().html('').attr('style', '').removeClass('hidden');
			var expandRadius = globals.dom.templateExpandRadius.clone(true, true).removeAttr('id');
				expandRadius
					.css('display','block')
					.html( expandRadius.html().replace(/__TITLE__/g, lang['expand-radius'] ) )
					.find('#radius')
						.attr('max', settings.units[ mainApp.core.getUserLanguage() ]['max-limit-radius'] )
						.attr('value', globals.currentRadius);
	
			globals.dom.profile.append( last.append( expandRadius.page() ) );
			app.eventExpandRadius( globals.dom.profile );
			app.fixExpandControls( globals.dom.profile );
			globals.dom.profile.find('.expand-radius').removeClass('hidden');
		},
		
		fixExpandControls : function( container ){
			
			var app = this;

			/*
			| make tables with 2 rows
			*/

			if( container.find('.fixed-table').html() != undefined ){ return false } ;

			var expandRadius = container.find('.range-number').addClass('hidden').clone( true, true );
			var expandRadiusDescription = container.find('.range-number-description').addClass('hidden').clone(true, true);
			var parentRadiusContainer = container.find('.ui-slider-track').parent();

			var table = $('<div class="table fill fixed-table"/>'); 
				var a = $('<div class="half text-right"/>').append( expandRadius.removeClass('hidden') ); 
				var b = $('<div class="half text-left"/>').append( expandRadiusDescription.removeClass('hidden') );
				parentRadiusContainer.append( table.append(a).append(b) );

			/*
			| refresh clone range number
			*/

			var rageNumbers = container.find('.range-number');
			rageNumbers.eq(0).unbind( "change").bind( "change", function(event, ui) {
				rageNumbers.eq(1).attr( 'value' , $( event.currentTarget ).val() )	
			} );
		},

		getUsers : function(id){
			if( id != undefined ){
				for ( var i in globals.usersResponse.users ){ 
					if( globals.usersResponse.users[i].id == id ){
						return globals.usersResponse.users[i];
					}
				}
			} else{
				return globals.usersResponse.users;
			}
		},

		getAge : function (dia_nacim,mes_nacim,anio_nacim) {
		    fecha_hoy = new Date();
		    ahora_anio = fecha_hoy.getYear();
		    ahora_mes = fecha_hoy.getMonth();
		    ahora_dia = fecha_hoy.getDate();
		    edad = (ahora_anio + 1900) - anio_nacim;
		    if ( ahora_mes < (mes_nacim - 1))
		    {
		      edad--;
		    }
		    if (((mes_nacim - 1) == ahora_mes) && (ahora_dia < dia_nacim))
		    { 
		      edad--;
		    }
		    if (edad > 1900)
		    {
		    edad -= 1900;
		    }
		  return edad;
		},

		getExtraFromUser : function( id_user , event, myCallback ){
			var app = this;

			var url = settings.endpoint + '/' + settings.requestExtra;
			
			var data = { 
				id_user : id_user
			};
			
			var uiFooter = event.closest('.ui-footer');
			var profile = uiFooter.closest('.profile');
			var userData = uiFooter.find('.user-data');
			var userNav = uiFooter.find('.user-nav');

			var containers = {};
			
			globals.extra[ id_user ] = {};

			var path = settings['path-to-images'] + '/482.GIF';
			var preload = mainApp.core.preload( profile , path );

			var callback = function( data ){
				
				preload.remove();
				
				/*
				| save data
				*/

				for( var i in data ){
					
					globals.extra[ id_user ][ i ] = data[i]
	
					containers[ i ] = uiFooter.find('.' + i );
					
					/*
					| new item container
					*/

					var theNode = containers[ i ].children().eq(0);
					var classNameNode = theNode.attr('class');
					var classNameContainer = containers[ i ].attr('class').replace(/item/g,'');

					/*
					| add items
					*/

					if( globals.extra[ id_user ][ i ].length > 0 ){
						
						/*
						| clean template and title relation table
						*/

						containers[ i ]
							.html('')
							.append( $('<div/>')
										.addClass( classNameContainer )
										.append( $('<small/>')
													.addClass( classNameNode )
													.addClass( 'bold' )
													.html( lang[ i ] ) ) );
						
						/*
						| content
						*/

						var row = $('<div/>').addClass( classNameContainer ); 
						for( var n = 0; n < globals.extra[ id_user ][ i ].length; n++ ){
							row.append( $('<small />').addClass( classNameNode ).html( globals.extra[ id_user ][ i ][n].description + '. ' ) );
						}

						containers[ i ].append( row );
					}

					/*
					| remove container
					*/

					else {
						containers[ i ].remove();
					}


				}
					
				/*
				| add scrollbar
				*/

				userData.css( 'height' , profile.height() 
										- userNav.height()
										- parseInt( userData.css('margin-top').replace(/px/g, '') ) );
				mainApp.core.addCustomScroll( userData );
				myCallback();
			}
			
			setTimeout(function(){
				mainApp.core.request( url, data, callback );
			}, settings.profileLoaderDelay );
		},

		replaceContent : function(user, content){
			var app = this;
			for( var i in user ){
				var str = '__' + i + '__';
				var regexp = new RegExp( str, "g" );				
				switch( i ){
					
					case 'distance' : 
						var unityOrMts = app.getUnityOrMts( user[i] );
						content = content
									.replace( /__u__/g, unityOrMts[0] )
									.replace( /__mts__/g, unityOrMts[1] );
					break;

					
					case 'date' : 
						content = content.replace(/__date__/g, app.getAge( user[i].substring(8, 10), user[i].substring(5, 7), user[i].substring(0, 4) ) ); 
					break;
				
					case 'address' : 
						user[i] = user[i].substring( 0, user[i].length - 7 ) + '.';
						content = content.replace( regexp, user[i] );
					break;
				
					case 'last_connection' :
						globals.lastConections[ user.id ] = app.getLastConecction( user.id, user[i] );
						if(  globals.lastConections[ user.id ] ){
							var on = ( user[i] != null ) ? 'on' : ''; 
							content = content.replace(/__on__/g, on); 
							content = content.replace(/__last_connection__/g, globals.lastConections[ user.id ] ); 
						}
					break;

					default : content = content	
											.replace( regexp, user[i] ) ;
				}

					content = content
								.replace(/__unitHeight__/g, settings.units[ mainApp.core.getUserLanguage() ].height )
								.replace(/__unitWeight__/g, settings.units[ mainApp.core.getUserLanguage() ].weight );	


			}
			return content;
		},

		getLastConecction : function( userId, lastConnection ){
			if( lastConnection == null ) { return false; }

			/*
			| asignar el valor de las unidades en milisegundos
			*/

			var msecPerMinute = 1000 * 60;
			var msecPerHour = msecPerMinute * 60;
			var msecPerDay = msecPerHour * 24;
			
			/*
			| asignar la fecha en milisegundos
			*/
			
			var date = new Date(lastConnection);
			var dateMsec = new Date();

			var interval = dateMsec - date.getTime();

			var days = Math.floor(interval / msecPerDay );
			interval = interval - (days * msecPerDay );

			var hours = Math.floor(interval / msecPerHour );
			interval = interval - (hours * msecPerHour );

			var minutes = Math.floor(interval / msecPerMinute );
			interval = interval - (minutes * msecPerMinute );

			var seconds = Math.floor(interval / 1000 );

			var innerHtml = '';

			if( days > 365 ){
				innerHtml =  'el ' + lastConnection.substring(0, 10);
			} 

			else {

				innerHtml += 'Hace ';

				if ( days > 0 && days < 365 ){
					innerHtml += days + " dia" + ( ( days > 1 ) ? 's ' : ' ' );
				} 

				else if ( days > 365 && years > 0 ){
					innerHtml += years + " a&ntilde;o, " ;
				}

				if( days <= 1 && hours > 0 ){
					innerHtml += hours + " " + settings.units[ mainApp.core.getUserLanguage() ].hours + " "; 
				} 

				if( days <= 1 && minutes > 0 ){
					innerHtml += minutes + " " + settings.units[ mainApp.core.getUserLanguage() ].minutes;
				} 
			}
			return innerHtml;
		},

		getUnityOrMts : function(distance){
			var limit = 1000;
			var mts = parseFloat( distance ).toFixed(3) * 1000;
			var unity = ( mts > limit ) ? settings.units[ mainApp.core.getUserLanguage() ].kilometers : settings.units[ mainApp.core.getUserLanguage() ].meters;
			mts = ( mts < limit ) ? mts : ( mts / 1000 ).toFixed(1);
			return [unity, mts];
		}

	};
};

mainApp.Profiles = Profiles();
