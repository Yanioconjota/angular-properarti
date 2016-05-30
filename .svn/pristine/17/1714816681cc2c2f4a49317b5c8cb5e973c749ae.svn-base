
var GetMainApp = function(){

	var isMobile = {
	    Android: function() {
	        return navigator.userAgent.match(/Android/i);
	    },
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	        return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i);
	    },
	    any: function() {
	        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	    }
	};

	var scrollTopLimit = 100;

	var mainImageWidth = 480;

	var firstPreload = false;

	var togglePathFolder = 'full-size'; 

	var settings = {};
	
	var extra = {
		
		fromMock				: false,
		
		timeout 				: { 
											fadeOut : 2000,
								  },

		dom 					: {
		
			rangeNumberDescription		: '#expand-radius .range-number-description',
			toggleLoginPanel 			: '#toggle-login-panel',
			warnings 					: '#warnings .message'
								  }
	};
	
	var lang = {};

	var globals = {};

	var getPreload = function( src ){ return $('<div class="preload"/>').append( $('<div class="overlay"/>') ).append( $('<div class="table fill"/>').append($('<div class="parent text-center"/>').append( $('<img src="'+src+'"/>') ))) };

	var fromJSON = function( url , callback ){ $.getJSON( 'json' +  url.substring( '' + url.lastIndexOf('/') , url.length ) + '.json' , function( data ){ if( typeof callback == 'function') { callback( data ) } } ) };

	var request = function( args ){

		var method = 'POST';
		var url = args[0];
		var data = args[1];
		var callback;

		if( args.length  == 3 ) {
			callback = args[2];
		} else if( args.length  == 4 && args[2] != undefined ){
			callback = arguments[3];
			if( arguments[2] != undefined ){
				method = arguments[2];
			} 
		} 

		if ( settings.fromMock && settings.fromMock === true ) {
			return fromJSON( url, callback );
		} 

		var ajaxObject = {
			url : url,
			type : method,
			data : data,
			dataType : 'JSON',
			success : function(data){ 
				if( typeof callback == 'function' ){
					callback(data) 
				}
			},
			error : function(){
				if( typeof callback == 'function' ){
					callback(false) 
				}
			}
		}

		$.ajax( ajaxObject );
	}

	return {

		init : function( s ){
			
			/*
			|  save locale default
			*/

			this.userLanguage = navigator.language || navigator.userLanguage;

			this.userLanguage = this.userLanguage.split('-')[0];


			/*
			|  ADD SETTINGS
			*/
			
			settings = this.addSettings( settings, extra, s);


			/*
			|  dom references
			*/

			globals = this.saveDomReferences( globals, settings, 'dom');


			/*
			|  AUTO LAUNCHERS
			*/

			this.startLaunchers.call( this, this.launchers );
		},

		isExplicit : function(a){
			return ( parseInt( a ) <= parseInt( mainApp.core.getFromSettings('moderation.explicit') ) ) ? true : false;
		},

		changePage : function(){
			var app = this;
			var thePage;
			var options = {};
			var callback = undefined;
			var len = arguments.length;	
			switch( len ){
				case 1 :
						if( typeof arguments[0] == 'string' ) {
							thePage = arguments[0];
						} 
				break
				case 2 :
						if( typeof arguments[0] == 'string' && typeof arguments[1] == 'function' ) {
							thePage = arguments[0];
							callback = arguments[1];
						} 
						else if( typeof arguments[0] == 'string' && typeof arguments[1] == 'object' ) {
							thePage = arguments[0];
							options = arguments[1];
						} 
				break
				case 3 :
						if( typeof arguments[0] == 'string' && typeof arguments[1] == 'object' && typeof arguments[2] == 'undefined'){
							thePage = arguments[0];
							options = arguments[1];
						} else 
						if( typeof arguments[0] == 'string' && typeof arguments[1] == 'object' && typeof arguments[2] == 'function' ){
							thePage = arguments[0];
							options = arguments[1];
							callback = arguments[2];
						} 
				break
			}
			$.mobile.changePage( thePage , options, true, true );
			$( thePage ).unbind('pageshow').bind('pageshow', function(event, ui) {
				if( typeof callback == 'function' ){ callback() }
	        });
		},

		returnPage : '#profiles',












		/*
		| starts launchers
		*/

		launchers : [


			/*
			|  prevent blink ( remove attr style display none )
			*/

			function(){
				globals.isMobile = isMobile.any(); 
			},



			/*
			| scroll top
			*/

			function(){
				$(window).scroll(function(){
					$('.back-to-top').toggleClass('hidden', $(this).scrollTop() < scrollTopLimit );
				});
			},


			/*
			| SET MAX RADIUS LIMIT ON SEARCH  QUERIE
			*/

			function(){
				globals.dom.rangeNumberDescription.html( settings.units[ this.userLanguage ].kilometers + 's: ' );
			},

		],


		/*
		| ends launchers
		*/















		/*
		| starts repo
		*/


		updateByField : function( data, callback ){
			var app = this;
			app.request( settings.endpoint + '/updateByField' , data, function( response ){
				//console.log( response );
				if( typeof callback == 'function' ){ callback( response ) }
			});
		},

		getLocation : function( callback ){
			var app = this;
			if ( navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition( function( position ) {
					callback ( {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					} );	
				}, function(err){
					app.alert( lang['alloow-location-code-error'][ err.code ]  
								+ ( ( globals.isMobile == null ) ? 'navegador' : 'dispositivo' ) );
				} );
			} else {
				callback( false ); 
			}
		},

		preload : function( container, src ){
			var preload = getPreload( src );
			if( container == undefined ){ alert('Preload has not container') }
			container.append( preload );
			return preload;
		},

		preloadRemove : function( preload , callback ){
			preload.remove();
		},

		startLaunchers : function( launchers ){
			for( var i in launchers ){ launchers[i].call( this )  }
		},

		request : function(){
			request( arguments );
		},

		loadJSON : function( name, callback){
			if( globals[name] ) {
				callback( globals[name] );
			} else{
				$.getJSON( '/' + name + '.JSON', function( data ){
					callback( data )
				})
			}
		},

		roleMainIsSmallest : function( height ){
			var heightRoleMain = this.pageRoleMain().height();
			return heightRoleMain < height ;
		},

		pageRoleMain : function(){ return  $.mobile.pageContainer.pagecontainer("getActivePage").find('div[data-role="main"]') },

		addCustomScroll : function( container ){
			container.mCustomScrollbar( { theme:"dark", advanced: { updateOnContentResize: true, updateOnBrowserResize: true } } ) ;
		},

		saveDomReferences : function( globals, settigs, key ){
			globals[key] = {};
			for( var i in settigs[key] ){
				if( typeof settigs[key][i] == 'object' ){
					if ( typeof globals[key][i] == 'undefined' ){
						globals[key][i] = {};	
					}
					for( var n in settigs[key][i] ){
						globals[key][i][n] = $( settigs[key][i][n] );
					}
				} else {
					globals[key][i] = $( settigs[key][i] );
				}
			}
			return globals;
		},

		/*
		| ends repo
		*/







		/*
		| starts modal
		*/

		warnings : function( string, object, callback ){
			var app = this;
			globals.dom.warnings.html( string );
			app.changePage( '#warnings', object, function(){
				callback( globals.dom.warnings );
			} );
		},	

		/*
		| ends modal
		*/








		/*
		| starts validations
		*/

		validations : {

			email : function isValidEmail(mail) {
			    return /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test( mail );
			},

		},

		isPremium : function(){
			return ( mainApp.core.getFromSettings( 'membership' ) == 'PREMIUM' )? true : false;
		},


		/*
		| ends validations
		*/












		/*
		| starts getters
		*/

		getFromSettings : function( key ){ var keys =  key.split('.'); var tmp; for( var i = 0; i < keys.length; i++ ){ tmp = i == 0 ? settings[ keys[i] ] : tmp[ keys[i] ] } return tmp; },

		getLang : function(){ return lang },

		getUserLanguage : function(){ return this.userLanguage}, 

		/*
		| ands getters
		*/





		/*
		| starts setters
		*/


		addSettings : function(settings, extra, s){
			settings = s;
			for( var i in extra){ settings[i] = extra[i] }
			return settings;
		},

		saveLang : function(s){
			lang = s;
		}

		/*
		| ends setters
		*/


	}
}


$(document).ready(function(){


	var language = navigator.language || navigator.userLanguage;
	
	mainApp.core = GetMainApp();
	

	/*
	| get settings
	*/

	mainApp.core.loadJSON( 'settings', function( settings ){
		
		/*
		| save global settings
		*/		

		SETTINGS = settings;


		SETTINGS.language = language; 	
		
		/*
		| init core
		*/		

		mainApp.core.init( SETTINGS );

		/*
		| lang
		*/

		mainApp.core.loadJSON( SETTINGS.language, function( lang ){
		
			mainApp.core.saveLang( lang )
			mainApp.Lang.init( lang );
	
			/*
			| user / slide
			*/

			mainApp.User.init( SETTINGS, lang );
			mainApp.Slide.init( SETTINGS, lang );
		});
	});
 } );
