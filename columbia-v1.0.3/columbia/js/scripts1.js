/*

	Theme: "Flurity"
	Description: Main JS Code
	Author: flGravity (http://themeforest.net/user/flGravity)
	Last Modified: 16/05/2012
	
*/


(function(){

	/* External Plugins */
	var plugins = function(){
		//tipsy plugin
		$('a[title]').tipsy({gravity:'s',fade:true,opacity:0.8,offset:5});
		
		//tweetable plugin
		$('.tweetfeed').tweetable({username:'codecanyon',limit:4});
		
		//rollbar plugin for tweet feeds	
		$('#tweetscroll').rollbar({scroll:'vertical',pathPadding:'2px',blockGlobalScroll:true});
		
		//rollbar plugin for section content
		$('.section-content').not('.noscroll').rollbar({
			pathPadding:'0px',
			sliderSize:'38%',
			blockGlobalScroll:false,
			lazyCheckScroll:500,
			scrollTime: 300
		});
		
		//prettyPhoto plugin
		$("a[rel^='prettyPhoto']").prettyPhoto({deeplinking:false,theme:'pp_default'});
		
		//flexslider plugin
		$('.slider').flexslider({animation:"fade",directionNav:true,slideshow:false});
		
		//jcarousel
		$('.carousel ul').jcarousel({
			buttonNextHTML:'<div>&rarr;</div>',
			buttonPrevHTML:'<div>&larr;</div>',
			wrap: 'circular',
			scroll: 1
		});
		
		//waitforimages plugin (image preloading animation)		
		$('body').css('overflow','hidden').waitForImages({
			finished: function(){
				$('#preloader').delay(1000).fadeOut('slow',function(){
					$('body').css('overflow','auto');
				});
			},
			each: function(n,c){
				$('#preloader #indicator').stop(true).animate({width:parseInt(n*100/c)+'%'},'fast');
				$('#preloader #progress').text(parseInt(n*100/c)+'%');
			},
			waitForAll: true
		});
		
		//google map
		$('#map').gMap({
			controls: false,
			markers: [{address: 'Los Angeles, United States', html:'_address'}],
			maptype: 'roadmap',
			zoom: 15,
			scrollwheel: false
		});
		
		//email form validation plugin
		$('#contact-form').validate({
			rules: {
			    name: "required",
			    email: {
			    	required: true,
			    	email: true
			    },
			    message: "required"
			},
			messages: {
				name: "Please enter your name",
				email: {
					required:  "Please enter your email",
					email: "Email address not invalid"
				},
				message: "Please enter a message"
			},
			submitHandler: function(form){
				var msg = $('.response_msg');
				var showmsg = function(text,timeout){
					msg.text(text).fadeIn('fast',function(){
						$(this).delay(timeout).fadeOut('fast');
					});
				};
				$.ajax(form.action, {
					type: form.method,
					data: $(form).serialize(),
					success: function(data,status,xhr){
						showmsg(data,3000);
						form.reset();
					},
					error: function(xhr,status,error){
						showmsg(status,3000);
					}
				});
				
				return false;
			}
		});
	};
	
	/* End External Plugins */
	
	
	/* Window onLoad */
	$(window).load(function(){
		//adjust "section-content" div position
		var section_pos = function(){
			$('.section-content').each(function(){
				var d = $(window).height()-$(this).outerHeight();
				if (d>0) $(this).css('top', d/2);
			});
		};
		section_pos();
		$(window).bind('resize',section_pos);
	});	
	/* End Window onLoad */
	
	/* DOM Ready */
	$(document).ready(function(){
	
		//code to highlight menu items on page scroll
		(function(){
			var navigation = {
				links: $('#nav a'),
				sections: new Object,
				lock: false,
				active: null
			};
			 
			function mapLinks(){
				$('.fancyscroll-section').each(function(){
					navigation.sections[$(this).css('top')] = navigation.links.filter('[href="#/'+this.id+'"]');
				});
			}
			
			//run now and on every window resize
			mapLinks();
			
			//function to switch between menu items
			navigation.choose = function(pos){
				if (navigation.active) { navigation.active.removeClass('active'); }
				navigation.active = navigation.sections[pos];
				navigation.active.addClass('active');
			};
			
			//activate fancyScroll plugin
			var fancy = new fancyScroll({
				easingFunc: 'easeInOutCubic',
				easingTime: 1200,
				deepLinking: false,
				autoScroll: '#/home',
				goTopHash: '#/home',
				goTopTarget: 'home',
				goTopClass: 'gohome',
				goTopShowAfter: $('.fancyscroll-section:first').height()-10,
				onScroll: function(h,v) {
					if(navigation.lock){ return; }
					for(var i in navigation.sections){
						if(v >= parseInt(i,10)){
							var pos = i;
						} else {
							break;
						}
					}
					//change URL
					var h = navigation.sections[pos].attr('href') || "#/home";
					if(window.location.hash != h){
						this.changeURLHash(h);
						navigation.choose(pos);
					}
				},
				onScrollEnd: function(){
					navigation.lock = false;
				},
				onScrollStart: function(s){
					navigation.choose($(s).css('top'));
					navigation.lock = true;
				}
			});
			
			//logo returns to home section
			fancy.addScroll('home_link','home');
			
			//register fancyScroll click handlers for menu items and "flurity-nav" links
			$('#nav a').add('a[rel="flurity-nav"]').filter('[href^="#/"]').each(function(){
				fancy.addScroll(this,$(this).attr('href').substr(2));
			});
			
			//media queries change size of sections and their top positions
			$(window).bind('resize',function(){
				mapLinks();
				//update fancyscroll background map
				fancy.updateMap();
			});
		})();
		
		/* init flurity plugins (js/jquery.flurity-plugins.js) */
		
		//portfolio
		$('.portfolio').flurity('portfolio',{
			listOffset: 50,
			onWork:function(){
				this.work.closest('.section-content').trigger('rollbar','reset');
			},
			onList:function(){
				this.closest('.section-content').trigger('rollbar','reset');
			}
		}); 
		
		//blog
		$('.blog').flurity('blog',{
			onEntry: function(){
				this.closest('.section-content').trigger('rollbar','reset');
			},
			onList: function(){
				this.closest('.section-content').trigger('rollbar','reset');
			},
			script: 'comments.php'
		});
		
		//placeholder fix for IE
		$('input[type="text"],input[type="email"],textarea').flurity('placeholder_fix');
		//multitab
		$('.multitab').flurity('multitab');
		//hover on list
		$('ul.hover').flurity('hover_list',{opacity:0.7});
		//hover
		$('.hover').not('ul').flurity('hover',{opacity:0.7});
		//toggle list
		$('.toggle-list').flurity('toggle',{time: 500});
		
		
		/* init all external plugins */
		plugins();
	});
	
	/* End DOM Ready */
	
})();