function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      oldonload();
      func();
    }
  }
}

function addResizeEvent(func) {
  var oldresize = window.onresize;
  if (typeof window.onresize != 'function') {
	window.onresize = func;
  } else {
	window.onresize = function() {
	  oldresize();
	  func();
	}
  }
}

function extendOnClick(el, func) {
  var oldonclick = el.onclick;
  if (typeof el.onclick != 'function') {
    el.onclick = func;
  } else {
    el.onclick = function(evt) {
      oldonclick(evt, this);
      func(evt,this);
      return false;
    }
  }
}

var classesForTracking = [' order', ' promotion', ' featured', ' adbanner'];

function popUpsAndTrackingFunctions()
{
  if (!document.getElementsByTagName) return false;
  var links = getAnchorAndAreaLinks();
  
  for (var i=0; i<links.length; i++) 
  {
    var linkClassAttribute = links[i].className;
    var linkRelAttribute = links[i].getAttribute("rel");
    
    if(linkRelAttribute) 
    {    
        if (linkRelAttribute.indexOf("samewindow") != -1) 
          {
             if(isTrackingClass(linkRelAttribute, linkClassAttribute))
             {
                   extendOnClick(links[i],stopDefault);
             }
          }
    }
    if(linkClassAttribute) 
    {
        var parsedClassAttribute = linkClassAttribute.split(" ");
        for(var j=0; j<parsedClassAttribute.length; j++)
        {
            if ( parsedClassAttribute[j] == "promotion")
            { 
                extendOnClick(links[i], getPromotionOmnitureVars);
            }

            if ( parsedClassAttribute[j] == "order")
            {
                extendOnClick(links[i], getOrderOmnitureVars);
            }
            
            if ( parsedClassAttribute[j] == "featured")
            {
                extendOnClick(links[i],getFeaturedOmnitureVars);
            }
        }       
    }
     
    var linkRelAttribute = links[i].getAttribute("rel");  
    if(linkRelAttribute)
    {
        var parsedLinkAttribute = linkRelAttribute.split(" ");
        for(var j=0; j<parsedLinkAttribute.length; j++)
        {
            if ( parsedLinkAttribute[j] == "player") 
            {
                extendOnClick(links[i],showPlayer);
             }
             else
             {
                if (parsedLinkAttribute[j] == "external") 
                {
                    extendOnClick(links[i],popUp);
                }
                else  
                {
                    if (parsedLinkAttribute[j] == "forgot_password") 
                   {
                       links[i].onclick = function() 
                       { 
                          displayWindow("http://www.sonypictures.com/spn/spn_forgot_password_screen.php","forgot_password",395,170,"directories=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0,titlebar=0,toolbar=0");
                          return false;
                       }
                    }
                }
             }
         }
     }      
  } 
}

function getAnchorAndAreaLinks()
{
  var links = document.getElementsByTagName("a");
  var areas = document.getElementsByTagName("area");  
  var links_temp = new Array();
  
  for(var i=0; i<areas.length; i++)
  {
	  links_temp[i] = areas[i];  
  }

  var count = links_temp.length;
  for(var i=0; i<links.length; i++)
  {
	links_temp[count] = links[i];
    count = count+1;
  }

  return links_temp;
}

function isTrackingClass(linkRelAttribute, linkClassAttribute)
{
  if(linkRelAttribute) 
  {    
    if (linkRelAttribute.indexOf("samewindow") != -1) 
    {
         for(var i=0; i<classesForTracking.length; i++)
         {
             var trackingClass = classesForTracking[i];
             if(linkClassAttribute.indexOf(trackingClass) != -1)
             {
                   return true;
             }
         }         
    }
  } 
  return false;     
}

function stopDefault(evt, link)
{
   if(!e) 
     var e = (window.event) ? window.event : evt;

    e.cancelBubble = true;
    e.returnValue = false;

    if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
    }
}

function sameWindow(link)
{
    if(link == null)
      link = this;
    var winURL = link.getAttribute("href");
    setTimeout(function () {window.location.href=winURL;},100);
}

function openLinkInSameWindow(link)
{
    var linkClassAttribute = link.className;
    var linkRelAttribute = link.getAttribute("rel"); 
    if( linkRelAttribute != null && linkClassAttribute != null )
    {
        if (linkRelAttribute.indexOf("samewindow") != -1 && (isTrackingClass(linkRelAttribute, linkClassAttribute)))
             {
                   sameWindow(link);
             }
    }
}


function getFeaturedOmnitureVars(evt, link)
{
    if (link == null)
          link = this;
          
    var url = link.getAttribute("href");
    var parsedClassAttribute = link.className.split(" ");
    var uniqueId = parsedClassAttribute[0];
    if (isOmnitureExists())
    {
        sCode.trackFeaturedContentClick(url, uniqueId);  
    }
    openLinkInSameWindow(link);
}

function getPromotionOmnitureVars(evt, link)
{
    if (link == null)
          link = this;
          
    var url = link.getAttribute("href");
    var parsedClassAttribute = link.className.split(" ");
    var uniqueId = parsedClassAttribute[0];
    if (isOmnitureExists())
    {
        sCode.trackOutboundClick(url, uniqueId);  
    }
    openLinkInSameWindow(link);
}

function getOrderOmnitureVars(evt, link)
{
    if (link == null)
          link = this;
    
    var url = link.getAttribute("href");
    var parsedClassAttribute = link.className.split(" ");
    if (parsedClassAttribute !=  null && parsedClassAttribute.length > 1) {
	    if (parsedClassAttribute.length == 3) {
			var uniqueId = parsedClassAttribute[1];
		} else {
			var uniqueId = parsedClassAttribute[0];
		}
	}
    if (isOmnitureExists())
    {
        sCode.trackOutboundClickToBuy(url,uniqueId);
    }
    openLinkInSameWindow(link);
}
 
function isOmnitureExists()
{
    if (s != null && (s.pageName.length != 0))
        return true;
    else return false;
}
 
function popUp(evt, link) 
{
  if(link == null)
    link = this;
  winURL = link.getAttribute("href");
  window.open(winURL,'_blank');
  return false;
}

//*********************
function showPlayer(evt, link) {
//*********************
if(link == null)
    link = this;
pURL = link.getAttribute("href");
displayWindow(pURL,"Player",620,460,"directories=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0,titlebar=0,toolbar=0");
return false;
}


//*********************
function displayWindow(theURL,winName,width,height,features) { //v3.1
//*********************
  var window_width = width;
  var window_height = height;
  var newfeatures= features;
  var window_top = (screen.height-window_height)/2;
  var window_left = (screen.width-window_width)/2;
  newWindow=window.open(''+ theURL + '',''+ winName + '','width=' + window_width + ',height=' + window_height + ',top=' + window_top + ',left=' + window_left + ','+ newfeatures + '');
  newWindow.focus();
}

//*********************
function MM_openBrWindow(theURL,winName,features) { //v2.0
//*********************
  window.open(theURL,winName,features);
}

//*********************
function mm_openbrwindow(theURL,winName,features) { //v2.0
//*********************
  window.open(theURL,winName,features);
}

//***************************************************
function popFull(url,name){
//***************************************************
var w = 480, h = 340;

if (document.all || document.layers) {
   w = screen.availWidth;
   h = screen.availHeight;
}else{
    w = screen.width;
    h = screen.height;
}

var url;
var popW;
var popH;

window.open(url,name,'width=' + w + ',height=' + h + ',top=0,left=0');
}

function getCacheBuster()
{
    var cacheBuster = "?preventCache=" + new Date().valueOf();
    return cacheBuster;
}

function compressWhiteSpace(s)
{
  // Copyright 2001 by Mike Hall.
  // See http://www.brainjar.com for terms of use.

  s = s.replace(/\s+/g, " ");
  s = s.replace(/^\s(.*)/, "$1");
  s = s.replace(/(.*)\s$/, "$1");

  s = s.replace(/\s([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])/g, "$1");
  s = s.replace(/([\x21\x25\x26\x28\x29\x2a\x2b\x2c\x2d\x2f\x3a\x3b\x3c\x3d\x3e\x3f\x5b\x5d\x5c\x7b\x7c\x7d\x7e])\s/g, "$1");

  return s;
};

function setSearchFields(){
    function setFields(inputId, defaultString, formId){
        var node = document.getElementById(inputId);
        if(node){
            node.value=defaultString;
            node.onfocus = function(){
                if(this.value == defaultString){
                    this.value = "";    
                }
            };
            node.onblur = function(){
                if(this.value == ""){
                    this.value = defaultString;
                }
            };
            if(document.getElementById(formId) != null)
            {
                document.getElementById(formId).onsubmit = function (){
                    if(node.value == defaultString || node.value == ""){
                        alert("Please enter a search term to proceed with search.");
                        return false;
                    }
                };
            }
        }
    }
    setFields("search","search","searchform");
    setFields("catalogsearch","Enter Titles, Director or Actor","searchcatalogform");
}





if(typeof($)!="undefined"){

    $(document).ready(function(){
        
        var headerLabel = $("#previews-new-styling #sonywidenavfeatures ul#sonynavsub li span"); 
        if($("#homevideo-content").length>0){
            headerLabel.addClass("dvd").append('<a href="http://www.sonypictures.com/previews/homevideo/" title="On DVD &amp; Blu-ray&trade;">On DVD &amp; Blu-ray&trade;</a>');
        }
        else if ($("#movies-content").length>0){
            headerLabel.addClass("movies").append('<a href="http://www.sonypictures.com/previews/movies/" title="At the Movies">At the Movies</a>');;
        }
        else if ($("#tv-content").length>0){
             headerLabel.addClass("tv").append('<a href="http://www.sonypictures.com/previews/tv/" title="On Television">On Television</a>');;
        }
        headerLabel= null;
        
        sonyCommonToggleTheaterLights = previewsActions.theaterLights;

        if($("#previews-new-styling").length > 0){
            previewsActions.tabNavigation();
        }
        /* check if IE6 - for hover menu fixx*/
        
        jQuery.each(jQuery.browser, function(i, val) {
            if(i=="msie" && jQuery.browser.version.substr(0,1)=="6"){
                var subNavElement = $("#sonywidenavcontent ul #sonynavpreviews");
                subNavElement.bind("mouseover",
                    function(){
                        $(this).addClass("hover");
						$("#sonywidenavcontentcontainer select").css({visibility:'hidden'});
                    }
                );
                subNavElement.bind("mouseout",
                    function(){
                        $(this).removeClass("hover");
						$("#sonywidenavcontentcontainer select").css({visibility:'visible'});
                    }
                );
                subNavElement = null;
            }
        });
   });
    
    var previewsActions = function() {
        
        var tabNavigation = function(){
           $(".homevideo-section").hide();
           $("#now_available").show();
           $("#homevideo-categories a").click(function(){
               $("#homevideo-categories a").removeClass("current");
               $(this).addClass("current");
               $(".homevideo-section").hide();
               var change = $(this).attr("href");
               $(change).show();
           });
        };
        var theaterLights = function(){
            var dimLights = $(".dim-lights");
            if(dimLights.length == 0 ){
        var contentContainer = $("#contentcontainer");
                contentContainer.prepend("<div class='dim-lights'></div>");
                dimLights = $(".dim-lights");
        var footer = $("#footer");
        var height = contentContainer.height() + footer.height() + parseInt(footer.css('padding-top').match(/^[0-9]+/)) + parseInt(footer.css('padding-bottom').match(/^[0-9]+/));
        var width = contentContainer.width();
        dimLights.css({"height": height, "width": width, "opacity": 0.8});
                dimLights.fadeIn("slow");
                dimLights.click(function(){
                    dimLights.fadeOut("slow", function(){
                        $(this).remove();
                    });
                });
            }
            else {
                dimLights.fadeOut("slow", function(){
                    $(this).remove();
                });
            }
        };

        return {
            tabNavigation: tabNavigation,
            theaterLights: theaterLights
        };
    } ();
}else if( navigator.appVersion.indexOf ( "MSIE 6" ) != -1){
	addLoadEvent(function(){
		var sonynavpreviews = document.getElementById('sonynavpreviews');

		if(sonynavpreviews){
			sonynavpreviews.onmouseover = function(){
				this.className = 'hover';
				hideSelectElements(document.getElementById('sonywidenavcontentcontainer'));
			}

			sonynavpreviews.onmouseout = function(){
				this.className = '';
				showSelectElements(document.getElementById('sonywidenavcontentcontainer'));
			}
		}
	});
}

function hideSelectElements(ele){
	var select_elements = null

	if(ele)
		select_elements = ele.getElementsByTagName("select");
	else
		select_elements = document.getElementsByTagName("select");

	for ( i = 0; i != select_elements.length; i++ ) {
		select_elements[i].disabled = true;
		select_elements[i].style.visibility = "hidden";
	}
}

function showSelectElements(ele){
	var select_elements = null

	if(ele)
		select_elements = ele.getElementsByTagName("select");
	else
		select_elements = document.getElementsByTagName("select");

	for (i = 0; i != select_elements.length; i++) {
		select_elements[i].disabled = false;
		select_elements[i].style.visibility = "visible";
	}
}

function navHoverEvent(){
	if( navigator.appVersion.indexOf ( "MSIE 6" ) != -1){
		var mainnav = document.getElementById('sony-main-nav');
		if(mainnav){
			var mainnavlistitems = mainnav.getElementsByTagName('li');
			for(var i=0; i<mainnavlistitems.length; i++){
				if(mainnavlistitems[i].getAttribute('id') != ''){
		
					if(mainnavlistitems[i].className)
							mainnavlistitems[i].tempclass = mainnavlistitems[i].className;
		
					mainnavlistitems[i].onmouseover = function(){
						this.className = 'over';
					}
		
					mainnavlistitems[i].onmouseout = function(){
						if(this.tempclass)
							this.className = this.tempclass;
						else
							this.className = '';
					}
				}
			}
		}
	}
}

addLoadEvent(navHoverEvent);
addLoadEvent(popUpsAndTrackingFunctions);
addLoadEvent(setSearchFields);