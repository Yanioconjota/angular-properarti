'use-strict';

var Chat = function(){

	var globals = {};

	var settings = {};

	var extra = {

		format 					: 'YYYY-MM-DD HH:mm:ss', 

		page 					: 0,
		
		limit 					: 10,

		requestChat		: 'getChat',
		
		dom  			: {

							chat				: '#chat',
							main 				: '#chat div[data-role="main"]',
							footer 				: '#chat div[data-role="footer"]',
							template				: '#chat .template',
							userThumbail		: '#chat .user-thumbnail',
							messagesContainer	: '#messages-container > .container',
							back				: '#chat *[data-icon="back"]',
							inputText			: '#chat div[data-role="footer"] input[name="message"]',
							sendMessageButton	: '#chat div[data-role="footer"] button[data-icon="carat-r"]'
						}

	}; 

	var loggedUser = false;

	var users = [];	

	var newMessage = function( message, callback ){
		var theValue = $.trim( message.val() );
		if( theValue.length == 0 ){ return false; }
		var newMessage = { id_sender : globals.id_sender, id_receptor : globals.id_receptor, description : theValue };
		mainApp.core.request( settings.endpoint + '/newMessage' , newMessage, function( response ){ if( typeof callback == 'function' ){ callback( response ) } } );
	}

	return {

		init : function( rtte ){

			var app = this;
			
			/*
			|  ADD USER LOGGED
			*/

			loggedUser = mainApp.User.getLoggedUser();

			/*
			| rtte
			*/

			globals.rtte = rtte;


			/*
			| chat settings
			*/

			globals.id_receptor = globals.rtte.id;
			
			globals.id_sender = loggedUser.id;

			/*
			|  ADD SETTINGS
			*/
			
			settings = mainApp.core.addSettings( settings, extra, SETTINGS );

			/*
			|  dom references
			*/

			globals = mainApp.core.saveDomReferences( globals, settings, 'dom');

			
			/*
			|  init launchers / events 
			*/

			mainApp.core.startLaunchers.call( app, app.launchers );
		},






		/*
		|  starts launchers
		*/


		launchers : [			

			/*
			| get chat whit logged user
			*/

			function(){
				var app = this;
				
				var url = settings.endpoint + '/' + settings.requestChat;
				
				var data = { 
					id_sender : globals.id_sender,
					id_receptor : globals.id_receptor,
					page : settings.page,
					limit : settings.limit
				}

				var callback = function( response  ){
	
					/*
					| chat
					*/

					app.showChat( response.messages );

					/*
					| set events
					*/	

					mainApp.core.startLaunchers.call(app, app.events );
				}

				mainApp.core.request( url, data, callback );
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
			| open slide
			*/

			function(){
				mainApp.core.returnPage = '#chat';
				globals.dom.chat.find('button[data-icon="camera"]').unbind( 'click').bind( 'click', function(){ mainApp.Slide.getImagesUser( $(this).attr('data-userId') )} );
			},

			/*
			| back
			*/
			
			function(){
				globals.dom.chat.find('button[data-icon="back"]').unbind( 'click').bind( 'click', function(){ 
					globals.dom.main.mCustomScrollbar('destroy');
					globals.dom.messagesContainer.html('');
					mainApp.core.changePage('#profiles') 
				} );
			}
		],

		/*
		| ends events
		*/








		showChat : function( messages ) {
	
			var app = this;
			
			/*
			| header
			*/	

			app.headerContent( globals.rtte );

			/*
			| footer
			*/	

			globals.dom.footer.removeClass('hidden');
			
			/*
			|  messages
			*/	
		
			app.messages( messages );
		
			/*
			| open chat
			*/	

			globals.dom.chat.removeClass('hidden');
			
			mainApp.core.changePage('#chat', function(){
				
				/*
				| fix height main chat 
				*/

				globals.dom.main.css( { 'padding-top' : globals.dom.chat.find('*[data-role="header"]').height(), 'height' : $(window).height() - globals.dom.chat.find('*[data-role="footer"]').height() + 'px' } );
					

				/*
				| key up / press enter
				*/

				globals.dom.inputText.unbind( 'keyup' ).bind( 'keyup' , function(ev){ ( ev.keyCode ? ev.keyCode : ev.which ) == '13' ? app.setNewMessage() : false  } ).focus();

				/*
				| send button
				*/

				globals.dom.sendMessageButton.unbind('click').bind('click', function( ev ){ app.setNewMessage() } );

				/*
				| scroll
				*/

				app.showScroll();
			});
		},

		setNewMessage : function(){

			var app = this;

			var theValue = $.trim( globals.dom.inputText.val() );			
			if( theValue.length == 0 ){ return false; } 	

			newMessage.apply( app, [ globals.dom.inputText, function(){
	
				app.messages(  [ {
									id_receptor : globals.id_receptor,
									id_sender : globals.id_sender,
									description : theValue,
									create_at : moment().format( settings['date-format'] )
								} ] );

				globals.dom.inputText.val('');

				app.showScroll();

			} ] )
		},

		showScroll : function(){
			var messages = globals.dom.chat.find('.message');
			var len = messages.length;
			if( len == 1 ){ return false } ;
			var last = messages.last();
			var messagesHeihgt = (  last.height()
					+ parseInt( last.css('margin-top').replace(/px/g,'') )
					+ parseInt( last.css('margin-bottom').replace(/px/g,'') )
					+ parseInt( last.css('padding-top').replace(/px/g,'') )
					+ parseInt( last.css('padding-bottom').replace(/px/g,'')  ) ) * len;

			if( globals.dom.main.height() <= messagesHeihgt ) {
				mainApp.core.addCustomScroll( globals.dom.main ); 
				$('#chat .mCSB_container').css('height','initial');
				globals.dom.mCustomScrollbar = globals.dom.chat.find( '#mCustomScrollbar' );
			}
			if( globals.dom.mCustomScrollbar ) {
				globals.dom.mCustomScrollbar.mCustomScrollbar( "scrollTo","bottom", { scrollInertia: 600 } ) ;
			}
		},

		underSixtySeconds : function( now , then ) { 
			var now  = moment( now );
			var then = moment( then );

			duration = moment.duration( now.diff( then ) );

			var days = parseInt( duration.asDays() );
			var hours = duration.get('hours');
			var minutes = duration.get('minutes');
			var seconds = duration.get('seconds');
			
			return days == 0 && hours == 0 && minutes == 0 && seconds <= 60 
						? true 
						: false ;
		},

		groupMessages : function( messages ) { 

			var app = this;
			var aux = 0;
			var tmp = [ [] ];
			var len = messages.length;
			var duration;

			tmp[aux].push( messages[0] );
			
			if( len == 1 ) { return tmp } ;

			for( var i = 1; i < len; i++ ) { 
				
				if(  messages[i] != messages[i-1].id_receptor || ! app.underSixtySeconds( messages[i-1].create_at , messages[i].create_at ) ) {
					aux++ ;
				} 
				
				if( tmp[aux] == undefined ) { tmp[aux] = [] };

				tmp[aux].push( messages[i] ) ;

			}
			return tmp ;
		},

		messages : function( messages ){		

			var app = this;
			
			var len =  messages.length;

			if( len == 0 ) { return false };			
			
			/*
			| header date history onces
			*************** update on scroll
			*************** update on scroll
			*************** update on scroll
			*************** update on scroll
			*/
			globals.dom.chat.find( 'div[data-role="header"] .date-history' ).html( moment( messages[len-1].create_at ).locale( mainApp.core.getUserLanguage() ).format('LL') ) ;					

			/*
			| group by timestamp
			*/

			var groups = app.groupMessages( messages ) ;

			for( var n = 0; n < groups.length; n++ ){

				var len = groups[n].length;

				for( var i = 0; i < len; i++ ){

					var isLast = len == 1;
					
					/*
					| user icon flotation
					*/

					var isUserLogged = groups[n][i].id_receptor != loggedUser.id;
					var floatation = isUserLogged ? ' pull-right ' : ' pull-left ';

					/*
					| message template 
					*/

					var message = globals.dom.template.clone().removeClass('template') ;
						message.attr( { 'data-createat' : groups[n][i].create_at, 'data-idreceptor' : groups[n][i].id_receptor } ) ;
						message.toggleClass( 'last', false ) ; 
						message.find('.description').html( groups[n][i].description ) ;									
						message.find('.create_at').html( moment( groups[n][i].create_at ).format('HH:mm:ss') + 'hs' ) ;									
						message.find('.globe').addClass( floatation ) ;
				
					/*
					| user thumnail
					*/

					var sameGroup = globals.dom.lastMessage && groups[n][i].id_receptor == globals.dom.lastMessage.attr('data-idreceptor')
									&& app.underSixtySeconds( globals.dom.lastMessage.attr('data-createat'), groups[n][i].create_at ) ;
					
					if( sameGroup ) {
						globals.dom.lastMessage.removeClass('last');
						globals.dom.lastUserThumbail.remove();
					}

					if( isLast ) {
						message.toggleClass( 'last', true ) ; 
						globals.dom.lastUserThumbail = globals.dom.userThumbail.clone();
						globals.dom.lastUserThumbail.find('.cover').addClass( floatation ).css( 'background-image' , 'url(' + settings['path-to-images'] + '/users/thumbs/' + ( isUserLogged ? loggedUser.image : globals.rtte.image ) + ')');
						message.append( globals.dom.lastUserThumbail.removeClass('hidden') );
					}

					globals.dom.messagesContainer.append( message.removeClass('hidden') );
	
					globals.dom.lastMessage = message;
	
				}
			}
		},

		headerContent : function( user ){
			var app = this;
			var header = globals.dom.chat.find('div[data-role="header"]');
			var innerHtml = header.html();
			for( var i in user ){
				var str = '__' + i + '__';
				var regexp = new RegExp( str, "g" );				
				switch( i ){
					default : innerHtml = innerHtml.replace( regexp, user[i] );
				}
			}
			header.html( innerHtml );
		}
	}
}	

mainApp.Chat = Chat();