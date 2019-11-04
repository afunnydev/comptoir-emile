/*
Theme Name: Oli
Description: Coming Soon
Author: Erilisdesign
Theme URI: http://erilisdesign.com/preview/themeforest/html/oli/
Author URI: http://themeforest.net/user/erilisdesign
Version: 1.6
*/

(function($) {
	"use strict";

	// Vars
	var body = $('body'),
		animated = $('.animated'),
		preloader = $('#preloader'),
		preloaderDelay = 350,
		preloaderFadeOutTime = 800,
		countdown = $('.countdown[data-countdown]');
	
	// Mobile
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		body.addClass('mobile');
	}

	function detectIE() {
		if (navigator.userAgent.indexOf('MSIE') != -1)
			var detectIEregexp = /MSIE (\d+\.\d+);/ // test for MSIE x.x
		else // if no "MSIE" string in userAgent
			var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/ // test for rv:x.x or rv x.x where Trident string exists

		if (detectIEregexp.test(navigator.userAgent)){ // if some form of IE
			var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number
			if (ieversion >= 9) {
				return true;
			}
		}
		return false;
	}

	function getWindowWidth() {
		return Math.max( $(window).width(), window.innerWidth);
	}

	function getWindowHeight() {
		return Math.max( $(window).height(), window.innerHeight);
	}

	
	// Preloader
	function init_ED_Preloader() {

		// Hide Preloader
		preloader.delay(preloaderDelay).fadeOut(preloaderFadeOutTime);

	}


	// Animations
	function init_ED_Animations() {
		if( !body.hasClass('mobile') ) {

			$('.animated').appear();

			if( detectIE() ) {
				$('.animated').css({
					'display':'block',
					'visibility': 'visible'
				});
			} else {
				
				$('.animated').on('appear', function() {
					var elem = $(this);
					var animation = elem.data('animation');
					if ( !elem.hasClass('visible') ) {
						var animationDelay = elem.data('animation-delay');
						if ( animationDelay ) {
							setTimeout(function(){
								elem.addClass( animation + " visible" );
							}, animationDelay);
						} else {
							elem.addClass( animation + " visible" );
						}
					}
				});
				
				/* Starting Animation on Load */
				$('.onstart').each( function() {
					var elem = $(this);
					if ( !elem.hasClass('visible') ) {
						var animationDelay = elem.data('animation-delay');
						var animation = elem.data('animation');
						if ( animationDelay ) {
							setTimeout(function(){
								elem.addClass( animation + " visible" );
							}, animationDelay);
						} else {
							elem.addClass( animation + " visible" );
						}
					}
				});
				
			}

		}
	}
	
	
	//	Backgrounds
	function init_ED_PageBackground() {
		if(body.hasClass('image-background')) { // IMAGE BACKGROUND

			body.backstretch("demo/background/image-1.jpg");

		} else if( body.hasClass('slideshow-background') ) { // SLIDESHOW BACKGROUND

			body.backstretch([
				"demo/background/image-1.jpg",
				"demo/background/image-2.jpg",
				"demo/background/image-3.jpg"
			], {duration: 3000, fade: 1200});

		} else if(body.hasClass('youtube-background')) { // YOUTUBE VIDEO BACKGROUND
			if(body.hasClass('mobile')) {

				// Default background on mobile devices
				body.backstretch("demo/video/video.jpg");

			} else {
				$(".player").each(function() {
					$(".player").mb_YTPlayer();
				});
			}
		} else if(body.hasClass('youtube-list-background')) { // YOUTUBE LIST VIDEOS BACKGROUND
			if(body.hasClass('mobile')) {

				// Default background on mobile devices
				body.backstretch("demo/video/video.jpg");

			} else {

				var videos = [
					{videoURL: "0pXYp72dwl0",containment:'body',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, ratio:"4/3", addRaster:true},
					{videoURL: "9d8wWcJLnFI",containment:'body',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, ratio:"4/3", addRaster:false},
					{videoURL: "nam90gorcPs",containment:'body',autoPlay:true, mute:true, startAt:0,opacity:1, loop:false, ratio:"4/3", addRaster:true}
				];

				$(".player").YTPlaylist(videos, true);

			}
		} else if($('body').hasClass('mobile')) { // MOBILE BACKGROUND - Image background instead of video on mobile devices
			if(body.hasClass('video-background')) {

				// Default background on mobile devices
				body.backstretch("demo/video/video.jpg");

			}	
		}
	}
	
	
	// Layout
	function init_ED_Layout() {
		/* FULLPAGE */	
		$('#fullpage').fullpage({
			anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage', 'lastPage'],
			menu: '#menu',
			scrollingSpeed: 540,
			autoScrolling: true,
			scrollBar: true,
			easing: 'easeInQuart',
			resize : false,
			paddingTop: '80px',
			paddingBottom: '80px',
			responsive: 1000,
		});

		$('a.go-slide').on( 'click', function() {
			var elem = $(this),
				slideID = elem.data('slide');
				
			$.fn.fullpage.moveTo(slideID);
		});
		
		if( body.hasClass('mobile') ) {
			$('#main-nav a').on( 'click', function() {
				$('.navbar-toggle').trigger('click');
			});
		};
	}
	
	
	function init_ED_Plugins() {

		/* RESPONSIVE VIDEO - FITVIDS */
		$(".video-container").fitVids();


		/* FLEXSLIDER */
		$('.flexslider').flexslider({
			animation: "fade",
			animationLoop: true,
			slideshowSpeed: 7000,
			animationSpeed: 600,
			controlNav: false,
			directionNav: false,
			keyboard: false,
			start: function(slider){
				body.removeClass('loading');
			}
		});


		/* COUNTDOWN */
		if (countdown.length) {			
			countdown.each(function() {
				var $this = $(this),
					finalDate = $(this).data('countdown');
				$this.countdown(finalDate, function(event) {
					$this.html(event.strftime(
						'<div class="counter-container"><div class="counter-box first"><div class="number">%-D</div><span>Day%!d</span></div><div class="counter-box"><div class="number">%H</div><span>Hours</span></div><div class="counter-box"><div class="number">%M</div><span>Minutes</span></div><div class="counter-box last"><div class="number">%S</div><span>Seconds</span></div></div>'
					));
				});
			});
		}


		/* MAILCHIMP */
		$('.mailchimp').ajaxChimp({
			callback: mailchimpCallback,
			url: "mailchimp-post-url" //Replace this with your own mailchimp post URL. Don't remove the "". Just paste the url inside "".  
		});

		function mailchimpCallback(resp) {
			 if (resp.result === 'success') {
				$('.success-message').html(resp.msg).fadeIn(1000);
				$('.error-message').fadeOut(500);

			} else if(resp.result === 'error') {
				$('.error-message').html(resp.msg).fadeIn(1000);
			}  
		}


		/* Start Javascript for Subscription Form */
		// $('.subscription-form').submit(function(event) {
		// 	var email = $('#email').val();
		// 	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

		// 	$.ajax({
		// 		url:'subscribe.php',
		// 		type :'POST',
		// 		dataType:'json',
		// 		data: {'email': email},

		// 		success: function(data){
		// 			if(data.error){
		// 				$('.error-message').fadeIn();
		// 			}else{
		// 				$('.success-message').fadeIn();
		// 				$(".error-message").hide();
		// 			}
		// 		}
		// 	});
		// 	return false;
		// });

		$('#email').focus(function(){
			$('.error-message').fadeOut();
			$('.success-message').fadeOut();
		});

		$('#email').keydown(function(){
			$('.error-message').fadeOut();
			$('.success-message').fadeOut();
		});

		$("#email").on( 'click', function() {
			$("#email").val('');
		});


		/* PLACEHOLDER */
		$('input, textarea').placeholder();
		
	}

	// CONTACT FORM
	// function init_ED_ContactForm() {
	// 	var $contactForm = $('.contact-form');
	// 	if( $contactForm.length < 1 ){ return true; }

	// 	$contactForm.each( function(){
	// 		var element = $(this),
	// 			elementAlert = element.attr('data-alert-type'),
	// 			elementResult = element.find('.contact-form-result');

	// 		element.find('form').validate({
	// 			submitHandler: function(form) {
	// 				elementResult.hide();

	// 				$(form).ajaxSubmit({
	// 					target: elementResult,
	// 					dataType: 'json',
	// 					success: function( data ) {
	// 						elementResult.html( data.message ).fadeIn( 400 );
	// 						if( data.alert != 'error' ) { $(form).clearForm(); }
	// 					}
	// 				});
	// 			}
	// 		});

	// 	});
	// }
	
	// window load function
	$(window).on('load', function() {
		init_ED_Preloader();
		init_ED_Animations();
	});
	
	// document.ready function
	jQuery(document).ready(function($) {
		init_ED_PageBackground();
		init_ED_Layout();
		init_ED_Plugins();
		// init_ED_ContactForm();
	});

})(jQuery);