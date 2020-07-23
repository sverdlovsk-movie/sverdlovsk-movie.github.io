	
var __assetQueue;
var __introAnimation;
var __sizeMode = "";  // "small" for 768 and smaller | "large" for everything else

var __currentGallerySlide = 1;


var __videoBgOriginalWidth = 1400;
var __videoBgOriginalHeight = 700;

var __bgImageOriginalWidth = 1920;
var __bgImageOriginalHeight = 1180;



var __YTPlayerLarge;

var __showConsoleLog = true;

var __loaderManifest = [
]
	
function onYouTubeIframeAPIReady(){
	trace("onYouTube api ready");
	
	initVideoGallery();
	
}


function onPlayerStateChange(e){
	if (e.data == 0){
		 $.fancybox.close(true);
	  }
}
	
	


/* ==============================================
 DOC READY
============================================== */
$(document).ready(function(e) {
   	preloadSite();
	
	resizeHandler();
	$(window).resize(resizeHandler);
	
	
	
	FastClick.attach(document.body);
});


preloadSite = function(){
	
	buildManifestFromElements();
	
	__assetQueue = new createjs.LoadQueue();
	
	__assetQueue.addEventListener("complete", loaderComplete);
	__assetQueue.on("progress", loaderProgress, this);
	
	__assetQueue.loadManifest(__loaderManifest);
	
	$("#preloader_Logo").css({"visibility":"visible"});
	
}

buildManifestFromElements = function(){
	$("*").each(function() {
		findImageInElement(this);
	});
}

findImageInElement = function (element) {
   var url = "";

   if ($(element).css("background-image") != "none") {
	  var url = $(element).css("background-image");
   } else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
	  var url = $(element).attr("src");
   }

   if (url.indexOf("gradient") == -1) {
	  url = url.replace(/url\(\"/g, "");
	  url = url.replace(/url\(/g, "");
	  url = url.replace(/\"\)/g, "");
	  url = url.replace(/\)/g, "");

	  var urls = url.split(", ");

	  for (var i = 0; i < urls.length; i++) {
		 if (urls[i].length > 0) {
			var extra = "";
			if ($.browser.msie && $.browser.version < 9) {
			    extra = "?" + Math.floor(Math.random() * 3000);
			}
			//qLimages.push(urls[i] + extra);
			var obj = {id: urls[i], src:urls[i] + extra};
			__loaderManifest.push(obj);
			//trace("url = " + urls[i]);
		 }
	  }
   }
}

loaderProgress = function(e){
	var progress = Math.floor(e.progress * 100);
	trace("progress = " + progress);
	$("#preload_horizontal_mask").stop(true,false).animate({"left":progress + "%"});
}

loaderComplete = function(){
	trace("loaderComplete");
 	//return;
	if(__sizeMode == "large"){
		$("#preload_horizontal_mask").animate({"opacity":0}, function(){
				$(this).css({"display":"none"});

			$("#preloader_blur").animate({"opacity":0}, function() {
				$(this).css({"display":"none"});
				$("#preload_top").animate({"top":"-60%"});
				$("#preloader_Logo").animate({"top":"-60%"});
				$("#preload_bottom").animate({"bottom":"-60%"}, function() {
					$("#preload_wrapper").css({"display":"none"});
				});
			})
		})
		
		initSite();

	}
	else{
		$("#preload_horizontal_mask").animate({"opacity":0}, function(){
				$(this).css({"display":"none"});

			$("#preloader_blur").animate({"opacity":0}, function() {
				$(this).css({"display":"none"});
				$("#preload_top").animate({"top":"-60%"});
				$("#preload_bottom").animate({"bottom":"-60%"}, function() {
					$("#preload_wrapper").css({"display":"none"});

				});
			})
		})
		
		initSite();

		}
}

initSite = function(){
	
	if(isIE8()){
		$("#main_wrapper").css({"display":"none"});
		$("#logo-redirect").css({"display":"block"});
		$("#cornerLogo2").css({"display":"block"});

		trace("IE8 MODE");
		$('#cover').stop(true, false).animate({"opacity":0}, function(){
			$(this)
		});
	}else{
		$("#main_wrapper").css({"display":"block"});
		$("#logo-redirect").css({"display":"none"});
		$("#cornerLogo2").css({"display":"none"});

		
		trace("NORMAL");
		
		//init scroll bars on content containers
		initCustomScrollBars();
		
		initNav();
	
		initPhotoGallery();
		initPhotoSharing();
		
		
		// start youtube api
		var tag = document.createElement('script');
		
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);	
		
		
		if(__isDesktop){
			//bg video
			$("#bgVideo_player").videoBG({
				mp4:'videos/annie_video.mp4',
				ogv:'videos/annie_video.ogv',
				webm: 'videos/annie_video.webm',
				scale:true,
				zIndex:0	
			});	
			
			resizeHandler();
		}
		else{
			$("#bgVideo_wrapper").css({"display":"none"});
		}
		
		// legal slider
		$("#clickForLegal").click(function(e){
			e.preventDefault();
			var sliderHeight = $("#legalSlide_wrapper").height();
			$("#legalSlide_wrapper").stop(true, false).animate({"bottom":0 + "px"});
			
		});
		
		$("#legalSlide_closeBtn").click(function(){
			var sliderHeight = $("#legalSlide_wrapper").height();
			$("#legalSlide_wrapper").stop(true, false).animate({"bottom": - sliderHeight + "px"});
		});
	}
}

initCustomScrollBars = function(){
/* 	$("#storyPage .content, #castPage .content, #plotPage .content").tinyscrollbar({thumbSize:0}); */
	
	$("#storyPage, #castPage, #plotPage").css({"display":"none"});
}


deeplinkHandler = function(){
	// change current gallery image if there's a hash
	var h = window.location.hash;
	if ( h ) {
		var id = h.split("photo")[1];
		__currentGallerySlide = id;
		showTargetSlide();
		trace("deeplink photo __currentGallerySlide = " + __currentGallerySlide);
	}
	
	// If not deep linking an image, fade in the home page
	if ( __sizeMode == "large" ) {
		if ( !h ) {
			$("#home_nav .navLabel").click();
			$('#movieOverlayTrigger').click();
			trace("!h");
		} else {
			//__needsIntro = false;
			showLargeSection("gallery");
		}
	} else {
		if ( !h ) {
			collapseAllSmallContent();
		} else {
			setTimeout( function() { smallNavClickHandler( $("#gallery_nav .navLabel")[0] ) }, 500 );
		}
	}
}



/* ==============================================
 BUTTON LISTENERS
============================================== */
initNav = function(){
	
	// reset for both large and small modes
	$("#movie_nav, #trailer_nav, #story_nav .navLabel, #castCrew_nav .navLabel, #plot_nav .navLabel, #gallery_nav .navLabel, #home_content .closeBtn, .trailerBtn, #cornerLogo").unbind("click");
	
	// add listeners depending on the mode
	if(__sizeMode == "large"){
		$("#movie_nav").bind("click", (function(){
			showLargeSection("movie");
			$("#movieOverlayTrigger").click();
			$(this).addClass("selected");
			if(typeof sCode !== 'undefined') sCode.trackVideo('movie','start');
		}));
		
		$("#trailer_nav").bind("click", (function(){
			showLargeSection("trailer");
			$("#trailerOverlayTrigger").click();
			$(this).addClass("selected");
			if(typeof sCode !== 'undefined') sCode.trackVideo('trailer','start');
		}));
		
		$("#story_nav .navLabel").click(function(){
			showLargeSection("story");
			
			$(this).addClass("selected");
			
			if(typeof sCode !== 'undefined') sCode.trackPageView("story.html")
		});
		
		$("#plot_nav .navLabel").click(function(){
			showLargeSection("plot");
			
			$(this).addClass("selected");
			
			if(typeof sCode !== 'undefined') sCode.trackPageView("plot.html");
			
		});

		$("#castCrew_nav .navLabel").click(function(){
			showLargeSection("castCrew");
			
			$(this).addClass("selected");
			
			if(typeof sCode !== 'undefined') sCode.trackPageView("castcrew.html");
			
		});
		
		$("#gallery_nav .navLabel").click(function(){
			showLargeSection("gallery");
			
			$(this).addClass("selected");
			
			if(typeof sCode !== 'undefined') sCode.trackPageView("gallery.html");
			
		});
		
		$("#home_content .closeBtn, #galleryLarge .closeBtn, .xBtn, #cornerLogo").click(function(){
			
			showLargeSection("home");
			$('#overlay').animate({"opacity":0});
			$("#overlay").css({"display":"none"});
			
		});
		
	}
	
	
	if(__sizeMode == "small"){
		
		// add event listeners
		$("#movie_nav").bind("click", (function(){
			$("#movieOverlayTrigger").click();
			$(this).addClass("selected");
			if(typeof sCode !== 'undefined') sCode.trackVideo('movie','start');
		}));
		
		$("#story_nav .navLabel").bind("click", (function(){
			smallNavClickHandler(this);	
			//$(this).addClass("selected");
			
			if(typeof sCode !== 'undefined') sCode.trackPageView("story.html")
		}));
		
		$("#plot_nav .navLabel").bind("click", (function(){
			smallNavClickHandler(this);	
			//$(this).addClass("selected");
			
			if(typeof sCode !== 'undefined') sCode.trackPageView("plot.html");
		}));

		$("#castCrew_nav .navLabel").bind("click", (function(){
			smallNavClickHandler(this);	
			//$(this).addClass("selected");
			
			if(typeof sCode !== 'undefined') sCode.trackPageView("castcrew.html");
		}));
		
		$("#gallery_nav .navLabel").bind("click", (function(){
			smallNavClickHandler(this);
			//$(this).addClass("selected");
			if(typeof sCode !== 'undefined') sCode.trackPageView("gallery.html");
		}));
	}
	
}

showLargeSection = function(section){
	$(".navLabel.selected").removeClass("selected");
	
	$("#trailerPage, #moviePage, #storyPage, #castPage, #plotPage, #homePage, #galleryLarge").stop(true,false).animate({"opacity":"0"},function(){
		
		$(this).css({"display":"none"});
		
		switch(section){
			
			case "home":
				$("#homePage").css({"opacity":"0", "display":"block"}).stop(true,false).animate({opacity:1});
				$("#sideBar_wrapper").css({"opacity":".2", "display":"block"}).stop(true,false).animate({opacity:1});
				break;
				
			case "story":
				$("#storyPage").css({"opacity":"0", "display":"block"}).stop(true,false).animate({opacity:1}, function(){
/* 					$("#storyPage .content").data("plugin_tinyscrollbar").update(); */
					$("#sideBar_wrapper").css({"opacity":"1", "display":"block"}).stop(true,false).animate({opacity:.2});
				});
				break;
			
			case "plot":
				$("#plotPage").css({"opacity":"0", "display":"block"}).stop(true,false).animate({opacity:1}, function(){
/* 					$("#plotPage .content").data("plugin_tinyscrollbar").update(); */
					$("#sideBar_wrapper").css({"opacity":"1", "display":"block"}).stop(true,false).animate({opacity:.2});
				});
				break;

			case "castCrew":
				$("#castPage").css({"opacity":"0", "display":"block"}).stop(true,false).animate({opacity:1}, function(){
/* 					$("#castPage .content").data("plugin_tinyscrollbar").update(); */
					$("#sideBar_wrapper").css({"opacity":"1", "display":"block"}).stop(true,false).animate({opacity:.2});
				});
				break;

			case "trailer":
				$("#trailerPage").css({"opacity":"0", "display":"block"}).stop(true,false).animate({opacity:1}, function(){
					$("#sideBar_wrapper").css({"opacity":"1", "display":"block"}).stop(true,false).animate({opacity:.2});
				});
				break;
				
			case "movie":
				$("#moviePage").css({"opacity":"0", "display":"block"}).stop(true,false).animate({opacity:1}, function(){
					$("#sideBar_wrapper").css({"opacity":"1", "display":"block"}).stop(true,false).animate({opacity:.2});
				});
				break;
			
			case "gallery":
				$("#galleryLarge").css({"opacity":"0", "display":"block"}).stop(true,false).animate({opacity:1});
				break;
				
			default:
				break;
			
		}	
		
		$("#legalSlide_closeBtn").click();
		
	});
}

smallNavClickHandler = function(selector){
	
	collapseSmallContent();
	
	if( !$(selector).parent("li").hasClass("selected") ){
		revealSmallContent(selector);
	}
	else{
		$(selector).parent("li").removeClass("selected");
	}
	
}

revealSmallContent = function(selector){
	var selectorHeight = parseInt($(selector).height());
	trace("selectorHeight = " + selectorHeight);
	
	var contentHeight = parseInt($(selector).next(".content").height());
	trace("contentHeight = " + contentHeight);
	
	trace("test = " + $("#gallery").height()); 
	
	var growToHeight = selectorHeight + contentHeight;
	
	// remove marker from selected nav item
	$('.selected').removeClass("selected");
	
	// show selected
	$(selector).parent("li").addClass("selected").stop(true, false).animate({"height":"auto"},function(){
		$(this).css({"height":"auto"});	
	});
}

collapseSmallContent = function(){
	$(".selected").stop(true, false).animate({"height":"50px"});
}

collapseAllSmallContent = function(){
	
	// remove marker from selected nav item
	$('.selected').removeClass("selected");
	$(".video, #story_nav, #gallery_nav, #castCrew_nav, #plot_nav").stop(true, false).css({"height":"50px"});
}





/* ==============================================
 HANDLE RESIZE
============================================== */
resizeHandler = function(){
	var currentWidth = $(window).width();
	trace("currentWidth = " + currentWidth);
	//850px
	if(currentWidth <= 1000){
		// if just switched modes
		if(__sizeMode == "large"){
			collapseAllSmallContent();
		}		
		__sizeMode = "small";
		}
	else{		
		// if just switched modes
		if(__sizeMode == "small"){
			showLargeSection("home");
		}
	
		__sizeMode = "large";			
	}
	
	resizeBodyHeight();
	
	initNav();
}


resizeBodyHeight = function(){
	
	// reset all modifier classes
	$(".small").removeClass("small");
	
	resizeBackground();
	
	var availHeight = $(window).height();
	var availWidth = $(window).width();
	
	if(__sizeMode == "large"){
		
		$("#main_wrapper").css({"overflow":"hidden"});
		
		// BANNER WRAPPER
		var topNavHeight = $("#nav_wrapper").height();
		var footerHeight = $("#footer_wrapper").height();
		
		var newHeight = availHeight - topNavHeight - footerHeight;
		
		
		trace("---------------- resizeBodyHeight ------------------");
		trace("availHeight = " + availHeight);
		trace("topNavHeight = " + topNavHeight);
		trace("footerHeight = " + footerHeight);
		trace("newHeight = " + newHeight);
		
		
		trace("newHeight = " + newHeight + "      |       availHeight = " + availHeight + "       |       topNavHeight = " + topNavHeight + "        |         footerHeight = " + footerHeight);
		$("#body_wrapper").height(newHeight).css({"top":topNavHeight + "px"});
		
		// hide small footer
		$("#smallFooter_wrapper").css({"display":"none"});
		// resize the background
		$("#bgImg").css({"position":"absolute"});

		//swap to large splash image
		$("#bgImg_social").css({"display":"none"});
		$("#bgImg").css({"display":"block"});
		$("#bgImg_small").css({"display":"none"});
		
		//swap watch trailer
		//$("#trailer_nav .navLabel span").css({"display":"none"});
		
		//
		$("#cornerLogo_wrapper").css({"display":"block"});
		
		//
		$(".trailerBtn").css({"display":"block"});
		
		//
		$(".closeBtn").css({"display":"block"});
		
		//
		$("#legalSlide_wrapper").css({"display":"block"});
		
	}
	
	if(__sizeMode == "small"){
		$("#main_wrapper").css({"overflow":"visible"});
		
		// BANNER WRAPPER
		$("#body_wrapper").height("auto").css({"top":"0px"});
		
		// add small class to main wrapper
		$("#main_wrapper").addClass("small");
		
		// show small footer
		$("#smallFooter_wrapper").css({"display":"block"});
		
		// resize the background
		var heightToWidthOfBgImg = __bgSmallImageOriginalHeight / __bgSmallImageOriginalWidth;
		
		$("#bgImg_small").attr({"width":"100%", "height":(availWidth * heightToWidthOfBgImg)}).css({"position":"relative", "left":"0px", "top":"0px"});
		
		
		//swap to small splash image
		$("#bgImg_social").css({"display":"block","height":"100px"});
		$("#bgImg").css({"display":"none"});
		$("#bgImg_small").css({"display":"block"});
		
		//add watch trailer
		//$("#trailer_nav .navLabel span").css({"display":"block"});
		
		//
		$("#cornerLogo_wrapper").css({"display":"none"});
		
		//
		$(".trailerBtn").css({"display":"none"});
		
		$(".closeBtn").css({"display":"none"});
		 
		 //
		 $("#track-layer").css({"display":"none"});
		
		
		//
		$("#legalSlide_wrapper").css({"display":"none"});
		
		// hide all large content
		$("#trailerPage, #moviePage, #homePage, #castPage, #plotPage, #storyPage, #galleryLarge").css({"display":"none"});
		
		
	}
	
	//center preloader logo
	var logoWidth = $("#preloader_Logo").width();
	var newLogoLeft = (availWidth - logoWidth) / 2;
	$("#preloader_Logo").css({"left":newLogoLeft});
	
}

resizeBackground = function(){
	var availWidth = $(window).width();
	var availHeight = $(window).height();
	var widthToHeight = availWidth / availHeight;
	var heightToWidth = availHeight / availWidth;
	
	var widthToHeightOfBgImg = __bgImageOriginalWidth / __bgImageOriginalHeight;
	var heightToWidthOfBgImg = __bgImageOriginalHeight / __bgImageOriginalWidth;
	
	var widthToHeightOfVideoBg = __videoBgOriginalWidth / __videoBgOriginalHeight;
	var heightToWidthOfVideoBg = __videoBgOriginalHeight / __videoBgOriginalWidth;
	
	
	trace("availWidth = " + availWidth);
	trace("availHeight = " + availHeight);
	trace("widthToHeight = " + widthToHeight);
	trace("widthToHeightOfBgImg = " + widthToHeightOfBgImg);
	
	// resize video bg
	if (widthToHeight > widthToHeightOfVideoBg ){
		// resize to fit width
		var ratioHeight = availWidth * heightToWidth + "px";
		if(__sizeMode == "large"){
			$("#bgVideo_wrapper .videoBG").css({"width":availWidth, "height":(availWidth * heightToWidthOfVideoBg)}).css({"left":"0px", "top":"0px"});
		}
		// center vertically
		var newTop = ( $("#bgVideo_wrapper .videoBG").height() - availHeight ) / 2;
		$("#bgVideo_wrapper .videoBG").css({"top": - newTop + "px", "left": "0px"});
		
		trace("newTop = " + newTop);
	}
	else{
		// resize to fit height
		var ratioWidth = availHeight * widthToHeightOfVideoBg + "px";
		
		$("#bgVideo_wrapper .videoBG").css({"width":ratioWidth, "height":availHeight});
		
		// center horizontally
		var newLeft = ( $("#bgVideo_wrapper .videoBG").width() - availWidth ) / 2;
		
		$("#bgVideo_wrapper .videoBG").css({"left": - newLeft + "px", "top": "0px"}); 
		
		trace("newLeft = " + newLeft);
		
	}
	
	// resize image bg
	if (widthToHeight > widthToHeightOfBgImg ){
		// resize to fit width
		var ratioHeight = availWidth * heightToWidth + "px";
		if(__sizeMode == "large"){
			$("#bgImg").css({"width":availWidth, "height":(availWidth * heightToWidthOfBgImg)}).css({"left":"0px", "top":"0px"});
		}
		
		// center vertically
		var newTop = ( $("#bgImg").height() - availHeight ) / 2;
		$("#bgImg").css({"top": "0px", "left": "0px"});  //$("#bgImg").css({"top": - newTop + "px", "left": "0px"}); 
		
		trace("newTop = " + newTop);
	}
	else{
		// resize to fit height
		var ratioWidth = availHeight * widthToHeightOfBgImg + "px";
		
		$("#bgImg").css({"width":ratioWidth, "height":availHeight});
		
		// center horizontally
		var newLeft = ( $("#bgImg").width() - availWidth ) / 2;
		
		$("#bgImg").css({"left": - newLeft + "px", "top": $("0").height() - "px"}); //$("#bgImg").css({"left": - newLeft + "px", "top": "0px"}); 
		
		
		trace("newLeft = " + newLeft);
	}
	
}


/* ==============================================
 PHOTO GALLERY
============================================== */

initPhotoGallery = function(){
	trace('init photo gallery');
	
	var totalSlides = $("#gallery li").length;
	
	// prep small gallery
	$("#gallery li:nth-child(1)").addClass("showing");
	
	// prep large gallery
	$("#galleryLargeSlide").css({"background-image": "url(" + $(".showing img").attr("src") + ")" });
	
	// show caption
	var caption = $(".showing img").data("caption");
	$(".caption").html(caption);
	
	
	// init button listeners
	$(".prevArrow").click(function(){
		if(__currentGallerySlide == 1){
			__currentGallerySlide = totalSlides;	
		}
		else{
			__currentGallerySlide--;
		}
		
		showTargetSlide();
	});
	
	$(".nextArrow").click(function(){
		__currentGallerySlide++;
		
		if(__currentGallerySlide > totalSlides){
			__currentGallerySlide = 1;
		}
		
		showTargetSlide();
	});
}

showTargetSlide = function(){
	trace("target slide = " + __currentGallerySlide);
	
	// asssign new showing image
	$(".showing").removeClass("showing");
	$("#gallery li:nth-child(" + __currentGallerySlide + ")").addClass("showing");
	
	if(__sizeMode == "small"){
		$(".showing").css({"opacity":1}).stop(true, false).animate({"opacity":1});
		$("#galleryLargeSlide").css({"background-image": "url(" + $(".showing img").attr("src") + ")"})
	}
	
	if(__sizeMode == "large"){
		// show slide
		$("#galleryLargeSlide").css({"background-image": "url(" + $(".showing img").attr("src") + ")", "opacity":1}).stop(true, false).animate({"opacity":1});
	}
	
	// show caption
	var caption = $(".showing img").data("caption");
	$(".caption").html(caption);
}


/* ==============================================
 VIDEO GALLERY
============================================== */

initVideoGallery = function(){
	trace("init video gallery");
	
	$('#movieOverlayTrigger').fancybox({
		openEffect  : 'fade',
		closeEffect : 'fade',
		width : "100%",
		height : "100%",
		autoSize : false,
		margin : [50, 0, 50, 0],
		padding : 0,
		scrolling : 'no'
		});	
		
	$('#trailerOverlayTrigger').fancybox({
		openEffect  : 'fade',
		closeEffect : 'fade',
		width : "100%",
		height : "100%",
		autoSize : false,
		margin : [50, 0, 50, 0],
		padding : 0,
		scrolling : 'no'
		});	

	
	deeplinkHandler();
}



/* ==============================================
 MISC
============================================== */

// --- for debugging ---
if ( ! window.console ) console = { log: function(){} };

function trace(msg){
	if(__showConsoleLog){
		console.log(msg);	
	}
}

// -- check if IE8 --
function isIE8(){
	if (navigator.appVersion.indexOf("MSIE") != -1){
    	if(parseFloat(navigator.appVersion.split("MSIE")[1]) == 8){
        	return true;
        }
   	}  
    
    return false;
}


// -- check if IE9 --
function isIE9(){
	if (navigator.appVersion.indexOf("MSIE") != -1){
    	if(parseFloat(navigator.appVersion.split("MSIE")[1]) == 9){
        	return true;
        }
   	}  
    
    return false;
}


// -- check if IE --
function isIE(){
	if (navigator.appVersion.indexOf("MSIE") != -1){
    	return true;
   	}  
    
    return false;
}


