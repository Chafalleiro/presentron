//* presentron.js data routines and data
const fileNdx = {"store": "files","keys": ["keyFi", true]}; //Indices
const fileStruct = {"store": "files","index":"keyFi","keys": ["keyFi","name","icon","description","path"]}; //Fields
const fileScr = {"store": "files","fields": {
											"keyFi":{"type":"index", "info": "Register key."},
											"name":{"type":"text", "info": "Name of the slidecart."},
											"icon":{"type":"emoji", "info": "An icon associated with this cart."},
											"description":{"type":"text", "info": "What is this cart about."},
											"path":{"type":"filepath", "info": "Where is this cart stored."}//can be changed to URL
											}}; //Fields

var fileData = {"store":"files", "indexes":fileNdx, "struct":fileStruct, "screen": fileScr}; //This object contains the structure of the configuration datasets and display fields
objStructs["files"] = fileData;
var arrFiles = [];
var arrAntFiles = [];

const slideNdx = {"store": "slides","keys": ["keySl", true]}; //Indices
const slideStruct = {"store": "slides","index":"keySl","keys": ["keySl","title","slide","description","dirt","damage","aged"]}; //Fields
const slideScr = {"store": "slides","fields": {
											"keySl":{"type":"index", "info": "Register key."},
											"title":{"type":"text", "info": "Title of the slide."},
											"slide":{"type":"img", "info": "Picture. Must not exceed 250KB."}, //img, up to 250KB
											"description":{"type":"text", "info": "Up to 1024 characters of text."},
											"dirt":{"type":"bool", "info": "Add randomly dirt effects."},
											"damage":{"type":"bool", "info": "Add randomly worn and damage effect."},
											"aged":{"type":"bool", "info": "Change the color of the image so it appears old."}
											}}; //Fields

var slideData = {"store":"slides", "indexes":slideNdx, "struct":slideStruct, "screen": slideScr}; //This object contains the structure of the configuration datasets and display fields
objStructs["slides"] = slideData;
var arrSlides = [];
var arrAntSlides = [];

let objDel = {"store":"","delKeys":[]}
objDel["files"] = {"store":"files","delKeys":[]}
objDel["slides"] = {"store":"slides","delKeys":[]}
//Screen configuration functions *********************************************
//Modify settings
async function modConfig(action)
{
	const dbConf = await idb.openDB('presentron', 1);
	if(action)
	{
		console.log("Storing new config.");
		//CRT skew and position.
		confArr.barrel  = document.getElementById('brrlChck').checked; //Write the HTML CRT barrel check element and apply conf.
		confArr.arrsBarrels[actRatio].scale  = document.getElementById('slider-x').value;
		console.log("confArr.arrsBarrels[actRatio].scale "+ confArr.arrsBarrels[actRatio].scale);
		confArr.arrsBarrels[actRatio].mx = document.getElementById('slider-mx').value;
		confArr.arrsBarrels[actRatio].my = document.getElementById('slider-my').value;
		confArr.arrsBarrels[actRatio].mw = document.getElementById('slider-mw').value;
		confArr.arrsBarrels[actRatio].mh = document.getElementById('slider-mh').value;
		confArr.arrsBarrels[actRatio].cw = document.getElementById('slider-cw').value;
		confArr.arrsBarrels[actRatio].ch = document.getElementById('slider-ch').value;
		//Color, contrast and brightness.
		confArr.color = colorSet;
		confArr.contrast = document.getElementById('slider-con').value;
		confArr.brightness = document.getElementById('slider-br').value;
		confArrAnt = confArr;
	}
	else
	{
		console.log("Restoring config.");
		confArr = confArrAnt;
		//CRT skew and position.
		document.getElementById('brrlChck').checked = confArrAnt.barrel; //Write the HTML CRT barrel check element and apply conf.
		document.getElementById('slider-x').value = confArrAnt.arrsBarrels[actRatio].scale;
		document.getElementById('slider-mx').value = confArrAnt.arrsBarrels[actRatio].mx;
		document.getElementById('slider-my').value = confArrAnt.arrsBarrels[actRatio].my;
		document.getElementById('slider-mw').value = confArrAnt.arrsBarrels[actRatio].mw;
		document.getElementById('slider-mh').value = confArrAnt.arrsBarrels[actRatio].mh;
		document.getElementById('slider-cw').value = confArrAnt.arrsBarrels[actRatio].cw;
		document.getElementById('slider-ch').value = confArrAnt.arrsBarrels[actRatio].ch;
		//Color, contrast and brightness.
		colorSet = confArrAnt.color;
		document.getElementById('slider-con').value = confArrAnt.contrast;
		document.getElementById('slider-br').value = confArrAnt.brightness;

		//CRT skew and position.
		barrelCheck('content', document.getElementById('brrlChck'));		
		moveSlider(document.getElementById('slider-x'), 'scale');
		moveSMT(document.getElementById('slider-mx'), 'x');
		moveSMT(document.getElementById('slider-my'), 'y');
		moveSMT(document.getElementById('slider-mw'), 'width');
		moveSMT(document.getElementById('slider-mh'), 'height');
		moveRoot(document.getElementById('slider-cw'), 'width');
		moveRoot(document.getElementById('slider-ch'), 'height');

		 //Set screen colour, contrast and brightness.
		setColor('colA','svg-root', confArrAnt.color);
		brcon(document.getElementById('slider-con'),'con');
		brcon(document.getElementById('slider-br'),'br');
	}
	dbConf.put('configs', confArr);
	dbConf.close();
}
//* cart is the name, cart +List the div, +Head the header, +Body and +Bottom the rest.
function mainscreen()
{initDisplays("presentron", "files","cart",fileScr,"all");}
mainscreen();