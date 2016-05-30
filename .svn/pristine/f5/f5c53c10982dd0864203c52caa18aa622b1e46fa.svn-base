'use-strict';

var Slide = function(){

	var globals = {};

	var settings = {};

	var extra = {

		dom  			: {

							slide 				 	: '#slide',
							slideBtn				: 'a[href="#slide"]',
							back 					: '.slide-back',
							prev 					: '#slide *[data-icon="carat-l"]',
							next 					: '#slide *[data-icon="carat-r"]',
							profilesBtn				: 'a[href="#profiles"]',
						},

		fade  			: 300						

	}; 

	var loggedUser = false;

	var users = [];	

	var images = [];
	

	return {

		
		init : function( s , l ){

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
			|  ADD USER LOGGED
			*/

			loggedUser = mainApp.User.getLoggedUser();

			/*
			|  dom references
			*/

			globals = mainApp.core.saveDomReferences( globals, settings, 'dom');

			/*
			|  auto init launchers / events 
			*/

			mainApp.core.startLaunchers.call(app, app.events);


		},






		/*
		|  starts launchers
		*/


		launchers : [
			
			/*
			|  show slide component
			*/

			function () {
				mainApp.core.changePage("#slide");
			},


			/*
			| save image attrs
			*/

			function () {
				globals.css = {
					'background-image' : globals.dom.slide.css('background-image'),
					'background-size' : globals.dom.slide.css('background-size'),
					'background-position' : globals.dom.slide.css('background-position')
				}
			},



		],


		/*
		|ends launchers
		*/















		/*
		| starts slide
		*/

		slide : [




			/*
			|  first image 
			*/
			

			function(){ 
				this.currentTarget = 0;
			},


			/*
			| show
			*/

			function(){
				var app = this;
				app.show( true ); 
			}
		],



		/*
		| ends slide
		*/



		events : [

			/*
			| back profiles
			*/
			function(){
				var app = this;
				globals.dom.back.unbind('click').bind('click', function(){
					mainApp.core.changePage( mainApp.core.returnPage );
				});
			},

			/*
			| next prev
			*/

			function(){
				var app = this;
				globals.dom.next.unbind('click').bind('click', function(){
					app.nextImage();
				});
				globals.dom.prev.unbind('click').bind('click', function(){
					app.prevImage();
				});
			}
		],

		/*
		| ends events
		*/





		show : function( first , direction ){
			var app = this;
			app.cloneCurrentImage( first );	
			app.setNewImageDown();	
			app.fadOutCurrentImage();
		},

		nextImage : function(){
			var app = this;
			app.currentTarget = images[ app.currentTarget + 1 ] == undefined ? app.currentTarget = 0 : app.currentTarget + 1;
			app.fadOutCurrentImage( function(){
				app.show(undefined , 'next');
			} );
		},

		prevImage : function(){
			var app = this;
			app.currentTarget =  images[ app.currentTarget - 1 ] == undefined ? app.currentTarget = images.length - 1 : app.currentTarget - 1;
			app.fadOutCurrentImage( function(){
				app.show(undefined , 'prev');
			} );
		},
		
		cloneCurrentImage : function( first){
			var app = this;
			var clonnedCss = globals.css;
				clonnedCss['cursor'] = 'default';
				clonnedCss['z-index'] = parseInt( globals.dom.slide.find('div[data-role="main"]').css('z-index') ) + 1 ;
			if( first ){
				clonnedCss['background-image'] = 'none';
			}
			app.currentImageClonned = $('<div class="easein clonned" />');
			app.currentImageClonned.css( clonnedCss );
			app.currentImageClonned.addClass('clearfix fill grow white-background fixed left top clonned');
			app.currentImageClonned
			globals.dom.slide.append( app.currentImageClonned );
		},

		setNewImageDown : function(){
			var app = this;
			var url; 
			if ( mainApp.core.isExplicit( images[ app.currentTarget ].moderation ) ){
				url = 'url(' + settings['path-to-images'] + '/under-review.jpg)';
			} else {
				var image = images[ app.currentTarget ];
				url = 'url(' + settings['path-to-images'] + '/users/galleries/user-' + globals.userId +'/'+ image.description + ')';
			}
			globals.css['background-image'] = url;
			globals.dom.slide.css( globals.css );
		},

		fadOutCurrentImage : function( callback ){
			var app = this;
			app.currentImageClonned.fadeOut( settings.transition, function(){ 
				$(this).remove();
				if( typeof callback == 'function' ){ callback() } ;
			} );
		},

		getImagesUser : function ( userId ) {
			var app = this;
			
			globals.userId = userId;

			var preload = mainApp.core.preload( globals.dom.slide, settings['path-to-images'] + '/435.GIF' );
			var url = settings.endpoint + '/imagesUser';
			var data = { id_user : globals.userId };
			var callback = function( i ){

				preload.remove();

				images = i;
				
				/*
				|  no image				
				*/

				if ( images.length == 0 ) {

					console.log('no images');
					return false;
				}
				/*
				|  events				
				*/

				mainApp.core.startLaunchers.call( app, app.launchers );


				/*
				|  start slide				
				*/

				mainApp.core.startLaunchers.call( app, app.slide );
			}
			
			mainApp.core.request( url, data, callback );
		},

		getImages : function(){
			return images;
		}
	}
}	

mainApp.Slide = Slide();