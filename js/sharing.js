var _photoSharingInited = false;
var _photoShareBoxWidth;
var _photoShareBoxHeight;


//setTimeout( function(){sharePhotoOnPinterest(2)}, 2000 );





/* ==============================================
 PHOTO SHARING BOX
============================================== */
initPhotoSharing = function(small) {
	trace("initPhotosharingFire");
		if ( _photoSharingInited ) return;
		_photoSharingInited = true;

		_photoShareBoxHeight = $(".photoShareBox").height();
		
		/*$(".photoShareBox").css( "width", 200 + "px" );
		$(".photoShareWrapper").css( "width", __basePhotoShareWidth + "px" );
		$(".photoShareBox").css( "height", _photoShareBoxHeight + "px" );

		
		$("#nav .photoShareWrapper").click( function() {
			
			if ( !$(this).hasClass("open") ) {
				$(this).addClass("open");
				$(this).css( "width", __basePhotoShareWidth + 100 + "px" );
				$(".photoShareBox a").css( "display", "block" );
			} else {
				$(this).removeClass("open");
				$(this).css( "width", __basePhotoShareWidth + "px" );
				$(".photoShareBox a").css( "display", "none" );
			}

		});
		
		$("#galleryLarge .photoShareWrapper").hover( function() {
				$(this).animate( {width:__basePhotoShareWidth + 100}, 100 );
				$(".photoShareBox a").css( "display", "block" );
			}, function() {
				$(this).stop();
				$(this).animate( {width:__basePhotoShareWidth}, 100 );
				//$(".photoShareBox a").css( "display", "none" );
			}
		);*/
		
		$(".sharePhotoFB").click( function() {
			trace("fbShareClicked");
			sCode.trackOutboundClick("facebook.com", "sharefacebook_button_photo"+__currentGallerySlide);
			sharePhotoOnFacebook(__currentGallerySlide);
		});
		
		$(".sharePhotoTwitter").click( function() {
			sCode.trackOutboundClick("twitter.com", "sharetwitter_button_photo"+__currentGallerySlide);
			sharePhotoOnTwitter(__currentGallerySlide);
		});
		
		$(".sharePhotoPinterest").click( function() {
			sCode.trackOutboundClick("pinterest.com", "sharepinterest_button_photo"+__currentGallerySlide);
			sharePhotoOnPinterest(__currentGallerySlide);
		});
		
}




collapsePhotoSharing = function() {
		$(".photoShareBox a").css( "display", "none" ); 
		$(".photoShareWrapper").css( "width", _photoShareBoxWidth + "px" );
}





/* ==============================================
 PHOTO SHARING METHODS
============================================== */

function sharePhotoOnFacebook($id){
    
    var shareMsg = encodeURIComponent(_fbMessage);
	var shareImage = encodeURIComponent(__rootURL + "images/gallery/thumb" + $id + ".jpg");
	var shareURL = encodeURIComponent(__rootURL+"#photo"+$id);
	//if ($urlExtension) { shareURL = shareURL + $urlExtension; }
	var url = "https://www.facebook.com/dialog/feed?app_id=" + "760867563956508" + "&description=" + shareMsg + "&picture=" + shareImage + "&display=popup&link=" + shareURL + "&redirect_uri=" + __rootURL + "redirect.html";
	window.open(url, "_blank");
}

function sharePhotoOnTwitter($id){
	
	var str = encodeURI(_twitterMessage + " ") + "%23"+ encodeURI( _shareHashTag + " " + __rootURL);
	var url = "https://twitter.com/intent/tweet?text=" + str + "%23photo" + $id;
	window.open(url, "_blank");
}

function sharePhotoOnPinterest($id){
	
	var shareMsg = encodeURI(_pinterestMessage) + " %23" + encodeURI(_shareHashTag);
	var link = encodeURI(__rootURL) + "%23photo" + $id;
	var image = encodeURI(__rootURL + "images/gallery/gallery"+$id+".jpg");

		
	var url = "http://www.pinterest.com/pin/create/button/?url=" + link + "&description=" + shareMsg + "&media=" + image;
	console.log("SHARING URL " + link);
	var windowName = "pinterestPhotoShare";

	window.open(url, windowName);
}
	
	
	
	