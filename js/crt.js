//Variables *****************************************************************
/*
let db, confStore, dataStore, capStore;
let arrHRes = {3120,1920,1680,1400,1280,1024}
let confArr =  {keyCo: 1, color: 'greenC', brightness: 1, contrast: 1,						//Screen color
		barrel: true, scale: 100, mx: -0.37, my: -1.05, mw: 1.5, mh: 1, cw: 640, ch: 480,}	//CRT geometry
let confArrAnt = confArr;
 tall > 07 - 1.3 < wide
*/
//Initialization functions ***************************************************/

let arrsBarrels = {"wide": {scale:95,mx:-0.3, my:-1.11,mw:1.65,mh:2.9,cw:2537,ch:3149},
				"square": {scale:100,mx:-0.3, my:-0.9,mw:1.5,mh:2.5,cw:2019,ch:480},
				"tall": {scale:50,mx:-0.23, my:-0.83,mw:1.65,mh:2.5,cw:803,ch:2471}}
let actConf = {keyCo: 1, color: 'greenC', brightness: 1, contrast: 1,						//Screen color
				barrel: true, "arrsBarrels": arrsBarrels};
let actRatio = "wide";
let antRatio = "wide";
document.getElementById("label_ratio").innerHTML = "<br><br>Aspect ratio: " + actRatio;

function barrelCheck(ele,wich)
{
	//console.log("for " + document.getElementById(ele).id + " the filter " + wich.id + " is now " + wich.checked);
	if (wich.checked){document.getElementById(ele).style.filter = "url(#SphereMapTest) url(#contrast) url(#brightness) url(#colorfill)";}
	else {document.getElementById(ele).style.filter = "url(#contrast) url(#brightness) url(#colorfill)";}
}


// observe window resize
window.addEventListener('resize', resizeHandler);

// initial call
resizeHandler();

// calculate size and barrel settings
function resizeHandler() {

  // get window width
	const iw = window.innerWidth;
	const ih = window.innerHeight;
 
  // determine named proportion
	rat = iw/ih;
	let size = "square";
	if (rat < 0.8){size = "tall";}
	else if (rat > 1.5){size = "wide";}
	actRatio = size;
	if(actRatio != antRatio)
		{
			console.log("Ratio changed from " + antRatio + " to " + actRatio);
			antRatio = actRatio;
			document.getElementById("label_ratio").innerHTML = "<br><br>Aspect ratio: " + actRatio;
			//modConfig(false);
		}
}

function getRndInteger(min, max)
{//Shamelesly from https://www.w3schools.com/js/tryit.asp?filename=tryjs_random_function2
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

var moveSlider = function(slider, direction){
	var value = slider.value;
	var circle = document.getElementById("despMap");
	circle.setAttributeNS(null, "scale", value);
};
var moveSMT = function(slider, direction){
	var value = slider.value;
	var circle = document.getElementById("SphereMapTest");
	circle.setAttributeNS(null, direction, value);
};
var resizeLens = function(slider, direction){
	var value = slider.value;
	var circle = document.getElementById("mapa");
	circle.setAttributeNS(null, direction, value);
};
var moveRoot = function(slider, direction) {
	var value = slider.value;
	var circle = document.getElementById("svg-root");
	circle.setAttributeNS(null, direction, value);
}
var changeImg = function(imagdest, imgn) {
	//var newImg = imgn.value;
	document.getElementById(imagdest).setAttribute('href', imgn);
	chngConf("1024");
};

var changeSource = function(vidURL) {
	var newVid = vidURL.value;
	document.getElementById("tubVid").src = newVid;
};

var brcon = function(slider,what) {
	var value = slider.value;

	var myId =what+"R";
	document.getElementById(myId).setAttributeNS(null, "slope", value);	
	myId =what+"G";
	document.getElementById(myId).setAttributeNS(null, "slope", value);	
	myId =what+"B";
	document.getElementById(myId).setAttributeNS(null, "slope", value);
	if(what == "con")
	{
		var myIntercept= -(0.5 * value) + 0.5;	
		myId =what+"R";
		document.getElementById(myId).setAttributeNS(null, "intercept", myIntercept);
		myId =what+"G";
		document.getElementById(myId).setAttributeNS(null, "intercept", myIntercept);
		myId =what+"B";
		document.getElementById(myId).setAttributeNS(null, "intercept", myIntercept);
	}
};

function chngConf(res){
	console.log("Setting :" + res + "configs");
		document.getElementById('brrlChck').checked = actConf.barrel; //Write the HTML CRT barrel check element and apply conf.
		barrelCheck('content', document.getElementById('brrlChck'));
		//CRT skew and position.
		document.getElementById('slider-x').value = actConf.scale;
		moveSlider(document.getElementById('slider-x'), 'scale');
		
		document.getElementById('slider-mx').value = actConf.mx;
		moveSMT(document.getElementById('slider-mx'), 'x');
		document.getElementById('slider-my').value = actConf.my;
		moveSMT(document.getElementById('slider-my'), 'y');
		
		document.getElementById('slider-mw').value = actConf.mw;
		moveSMT(document.getElementById('slider-mw'), 'width');
		document.getElementById('slider-mh').value = actConf.mh;
		moveSMT(document.getElementById('slider-mh'), 'height');
		
		document.getElementById('slider-lw').value = actConf.lw;
		resizeLens(document.getElementById('slider-lw'), 'width');
		document.getElementById('slider-lh').value = actConf.lh;
		resizeLens(document.getElementById('slider-lh'), 'height');

		 //Set screen colour, contrast and brightness.
		setColor('colA','svg-root', actConf.color);
		document.getElementById('slider-con').value = actConf.contrast; //Change sliders values.
		document.getElementById('slider-br').value = actConf.brightness;
		brcon(document.getElementById('slider-con'),'con');
		brcon(document.getElementById('slider-br'),'br');
		setTimeout(function() {
			winalert(div_mesg.id,1,0.1,0,Number(div_mesg.style.opacity));
		}, 300);//Wait and fade out
	console.log("Configs for :" + res + "set");
}	