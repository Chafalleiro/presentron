/**
 *  @file slides.js
 *  @brief $(Scripts for a slide proyectos simulator)
 */
 
/*****************************************************************************
Function to get an array length.
*****************************************************************************/
function getLength(arr) {
    return Object.keys(arr).length;
}

/*****************************************************************************
Global vars
*****************************************************************************/
var img_count, imgLoaded, imgDirt, imgDamage = 0;
var sw_effects = [true,true];
var sw_on = false;
var countdown = 0;
var file_names = [];
var ses_names = [];
var files;
var imageType = /^image\//;
var sliEffects = document.createElement("AUDIO");
var sliTrack = document.createElement("AUDIO");
var sliFan = document.createElement("AUDIO");
var sliClicks = document.createElement("AUDIO");
	sliClicks.setAttribute("src","snd/boton.mp3");
var sliSwitch = document.createElement("AUDIO");
	sliSwitch.setAttribute("src","snd/switch.mp3");
var sliPow = document.createElement("AUDIO");
	sliPow.setAttribute("src","snd/switch_plastic.mp3");
var sldAct = document.getElementById("slideActive");
var sldDirt = document.getElementById("slideDirt");
var sldDmg = document.getElementById("slideDmg");
var prScrn = document.getElementById("prScreen");
var swtchs = document.getElementById("switches");
var sliNdx, cLoad = 0; //Slide index is global since is messy to put it in event functions
var where;
//************* Arrays with the images ****************************************
var mySlides = [];
var slIndexes = [];

var dirt = ["slides/dedazo1.png", "slides/dedazo2.png", "slides/dedazo3.png", "slides/dedazo4.png", "slides/dedazo5.png", "slides/dedazo6.png", "slides/dedazo7.png", "slides/pelo.png", "slides/pelo1.png", "slides/pelo2.png"];
var damage = ["slides/Texture1.png", "slides/Texture2.png", "slides/Texture3.png", "slides/Texture4.png", "slides/Texture6.png", "slides/Texture8.png", "slides/Texture9.png", "slides/Texture10.png", "slides/Texture11.png", "slides/Texture13.png", "slides/Texture15.png"];

//	console.trace(this);

var sliLen = getLength(mySlides);

//************* Load slide images ****************************************

var aniframes = [];  // Hold images.
var drtframes = [];  // Hold images.
var dmgframes = [];  // Hold images.

/**
 * Loads slides from remote JSON and saves to IDB.
 * Does NOT load images into memory yet.
 */
async function slideLoads() {
    console.log("Step 1: Fetching remote JSON...");
    try {
        const response = await fetch('slides.json'); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const jsonData = await response.json();
        console.log(`Step 2: JSON parsed (${jsonData.length} items). Importing to IDB...`);

        // Solo importamos. importDt ya espera a que termine la transacción interna.
        await importDt(jsonData, 'slides', true); 
        
        console.log("Step 3: IDB Import finished successfully.");
        // NO llamar a loadSlideImages aquí. El caller decidirá cuándo cargar imágenes.
        
    } catch (error) {
        console.error("Error in slideLoads:", error);
        throw error; // Relanzar para que startProyector se entere
    }
}

function drawAsk(msg)
{
	document.getElementById("titQuestion").innerHTML = "Datafile not found on server.";
	document.getElementById("textQuestion").innerHTML = "Would you like to load a local file?";
	let bodyQ = document.getElementById("bodyQuestion");
	bodyQ.innerHTML = ``;
	bodyQ.innerHTML = msg;

	showModal('yesNo');
}

async function askFileLoad(par,msg,st)
{
	switch(par)
	{
		case 1:
			console.log("par: "+ par + ", nOk :" +nOk+ ", nCan :" +nCan+ ", nAns :" +nAns+ ", msg :" + msg + " storage: "+ st);
		break;
		case 2:
		console.log("par: "+ par + ", nOk :" +nOk+ ", nCan :" +nCan+ ", nAns :" +nAns+ ", msg :" + msg + " storage: "+ st);
			if(msg == "OK")
			{
				console.log("Overwriting");
				var sliArr = await importDt(slideStruct,"ow",anArr); //dt = store name, m = mode, rr = working array
			}
			else
			{
				console.log("Skipping");
			}
			return msg;
		break;
		case 3:
			console.log("par: "+ par + ", nOk :" +nOk+ ", nCan :" +nCan+ ", nAns :" +nAns+ ", msg :" + msg);
			showModal('yesNo');
			return msg;
		break;
	}
	console.log("MESSG",msg);
//	return msg;
}

/**
 * Reads from IDB and preloads images into memory.
 */
async function loadSlideImages() {
    console.log("Step 4: Starting image preload from IDB...");
    
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error("Database not initialized"));
            return;
        }
console.log("134")
        const transaction = db.transaction(['slides'], 'readonly');
        const store = transaction.objectStore('slides');
        const request = store.getAll();
console.log("138")
        request.onsuccess = () => {
            const slides = request.result;
            console.log(`Step 4a: Retrieved ${slides ? slides.length : 0} slides from IDB.`);

            if (!slides || slides.length === 0) {
                console.warn("No slides found in IDB.");
                window.slidesData = [];
                resolve();
                return;
            }
console.log("149")
            window.slidesData = slides;
            let loadedCount = 0;
            const total = slides.length;

            // Función auxiliar para cargar una imagen
            const loadImage = (slide) => {
                return new Promise((imgResolve) => {
                    if (!slide.imageSrc) {
                        imgResolve();
                        return;
                    }
                    const img = new Image();
                    img.onload = () => {
                        loadedCount++;
                        // console.log(`Image loaded: ${loadedCount}/${total}`);
                        imgResolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${slide.imageSrc}`);
                        loadedCount++; // Contar también como intentado para no bloquear
                        imgResolve();
                    };
                    img.src = slide.imageSrc;
                });
            };
console.log("175")
            // Cargar todas las imágenes en paralelo
            Promise.all(slides.map(slide => loadImage(slide)))
                .then(() => {
                    console.log(`Step 5: All ${total} images preloaded successfully.`);
                    resolve();
                })
                .catch(err => {
                    console.error("Error preloading images:", err);
                    reject(err);
                });
        };
console.log("187")
        request.onerror = () => {
            console.error("Error reading from IDB:", request.error);
            reject(request.error);
        };
    });
}

function imageLoads(arrImg,arrSrc,cnt)
{
	for(var i = 0; i < getLength(arrSrc); i++) {
		arrImg[i] = new Image();                 // Create an offscreen image
		arrImg[i].id = "image_" + i;
		arrImg[i].onload =  function() // Store image size and asociated data
		{
			cnt++; //For some reason mixes loading of cache and sources the first time doubling the count
		}
		arrImg[i].src = arrSrc[i];    // Tell it what URL to load
	}

}
//imageLoads(aniframes,mySlides,imgLoaded);
imageLoads(drtframes,dirt,imgDirt);
imageLoads(dmgframes,damage,imgDamage);



//************* Adjuts images ****************************************
function calcSize(nH, nW, mH, mW){
	if(nH)
	{
	var cH = Math.trunc(mH * 0.65);
	var ratio = cH/nH;
	var cW = Math.trunc(nW*ratio);
	if (cW >= (mW*0.90))
	{
		cW = Math.trunc(mW*0.85);
		var ratio = cW/nW;
		var cH = Math.trunc(nH*ratio);
	}
	return {
        calcW: cW,
		calcH: cH
    };
	}
	else{console.log("No image")}
}
//************* Start Proyector ****************************************
/**
 * Main entry point for the projector.
 * Orchestrates the sequence: Fetch -> Save IDB -> Load Images -> Show Projector
 */
async function startProyector() {
    console.log("--- Starting Projector Sequence ---");
    
    try {
        // 1. Cargar datos remotos a IDB
        await slideLoads(); 
        
        // 2. Cargar imágenes de IDB a memoria (Aquí es donde debería aparecer el log de Step 4)
        console.log("Step 3 complete. Moving to Step 4 (Load Images)...");
        await loadSlideImages(); 
        
        console.log("Step 4 complete. Initializing Projector UI...");
        
        // 3. Mostrar el proyector
        // ... tu lógica existente para mostrar el proyector ...
        // Ejemplo:
        // document.getElementById('projector').style.display = 'block';
        // showCurrentSlide();
        
        console.log("--- Projector Ready ---");

    } catch (error) {
        console.error("Fatal error starting projector:", error);
        if (typeof showFlash === 'function') {
            showFlash("flash", "Error starting projector", 0.1, 1.1);
        }
    }
}

//************* Sound helpers ****************************************
function stopLoadingSound(sndToStop) {
  	sndToStop.pause();
}

function stopLoadingSoundAndStartOtherTrack(sndToStop, trackToLoad) {
  	sndToStop.pause();
	sndToStop.setAttribute("src",trackToLoad);
	sndToStop.autoplay = true;
	sndToStop.loop = true;
	sndToStop.load();
}
//************* Slides functions ****************************************
function showSlide(sli)
{
	sliNdx = sli;
	if(cLoad) //Suposedly all images are loaded
	{
		reposition();
	}
	else
	{
		console.log("LOADING STILL IN PROGRESS.");
	}
}
//************* Resize and reposition ****************************************
function reposition()
{
	console.log("reposition()");
	if (sw_on)
	{
	prScrn.height = Math.trunc(window.innerHeight * 0.95); //Screen proyector sizes
	prScrn.width = Math.trunc(window.innerWidth * 0.75);
	scrnHRatio = prScrn.height / 900;  //Screen proyector scale
	const imgAct = document.createElement('img');
	
	imgAct.src = anArr[sliNdx]["slide"];
	sldAct.style.backgroundImage = "url('"+imgAct.src+"')";  //Load slide image
	sldAct.style.visibility = "visible";

	//Slides sizes and positions
	sldAct.style.height = "90vh";
	sldAct.style.width = "-100%";
	sldAct.style.maxWidth = "60%";
	sldAct.style.width = calcSize(imgAct.naturalHeight,imgAct.naturalWidth, prScrn.height, prScrn.width).calcW+"px";
	sldAct.style.top = Math.trunc((prScrn.height - calcSize(imgAct.naturalHeight,imgAct.naturalWidth, prScrn.height, prScrn.width).calcH)/2);
	sldAct.style.left = Math.trunc((prScrn.width - calcSize(imgAct.naturalHeight,imgAct.naturalWidth, prScrn.height, prScrn.width).calcW)/2);
	//sldAct.style.left = "10%";
	document.getElementById("rectA").setAttribute("height",sldAct.style.height); //Clipping path sizing
	
	var clip_1 = document.getElementById("clippingArea");
	clip_1.setCurrentTime(0)

	var w = sldAct.style.width;
	var mov_1 = document.getElementById("xClip");  //Clipping path positioning animation
	mov_1.setAttribute("dur","0.3s");
	mov_1.setAttribute("begin","0s");
	mov_1.setAttribute("values","0;0;");
	mov_1.setAttribute("repeatCount","1");

	w = "0;0;5;0;100;" + parseInt(sldAct.style.width) + ";"

	var mov_2 = document.getElementById("wClip");
	mov_2.setAttribute("dur","0.3s");
	mov_2.setAttribute("begin","0s");
	mov_2.setAttribute("values",w);
	mov_2.setAttribute("repeatCount","1"); 

	document.getElementById("opA").setAttribute("begin","0s");  //Blurring and opacity svg animations
	document.getElementById("opA").setAttribute("repeatCount","1");
	document.getElementById("opA").setAttribute("dur","0.55s");
	document.getElementById("opA").setAttribute("values","0 0;0 0.5; 0 0.5;0 0.8;");

	document.getElementById("blA").setAttribute("begin","0s");
	document.getElementById("blA").setAttribute("repeatCount","1");
	document.getElementById("blA").setAttribute("dur","0.75s");
	document.getElementById("blA").setAttribute("values","15;7;5;20;0;");

	var animSVG = document.getElementById("combini");
	animSVG.setCurrentTime(0); //Start the animation

	rndRes();
	}
}
//************* Move out the slide ****************************************
async function moveOut(sender)
{
	await typeText('slideText',anArr[sliNdx]["description"],'fw','er',5);
	blVal = 0;
	sldAct.addEventListener("transitionend", transEnd);
	where = sender.id
	sldAct.style.top = prScrn.style.top - 1;
	sldAct.style.left = -(parseInt(sldAct.style.width));
	var clip_1 = document.getElementById("clippingArea");

	var w = parseInt(sldAct.style.width) + ";0;";
	var mov_1 = document.getElementById("xClip");
	mov_1.setAttribute("values",w);
	
	var mov_2 = document.getElementById("wClip");
	mov_2.setAttribute("values",w);

	document.getElementById("opA").setAttribute("dur","0.55s");
	document.getElementById("blA").setAttribute("dur","0.75s");
	document.getElementById("blA").setAttribute("fill","freeze");
	document.getElementById("opA").setAttribute("values","0 0.8;0 0.3; 0 0;");
	document.getElementById("blA").setAttribute("values","15;7;5;20;0;");
		
	var animSVG = document.getElementById("combini");
	animSVG.setCurrentTime(0);
	clip_1.setCurrentTime(0);

	sliEffects.load();
	sliEffects.autoplay = true;

}
//************* Move in the slide ****************************************
function transEnd() {
	if(where == "ff")
	{
		
		sliNdx = (sliNdx < (slIndexes.length - 1)) ? sliNdx+1 : 0;
		anArr
	}
	else
	{
		sliNdx = (sliNdx > 0) ? sliNdx-1 : slIndexes.length - 1;
	}
	sldAct.removeEventListener("transitionend", transEnd);
	reposition();
}
//************* Remote effects ****************************************
function rwEnd() {
	document.getElementById("rwL").style.opacity = "0";	
	document.getElementById("rwL").removeEventListener("transitionend", rwEnd);
}
function ffEnd() {
	document.getElementById("ffL").style.opacity = "0";	
	document.getElementById("ffL").removeEventListener("transitionend", ffEnd);
}

function hightlightme(item,action) {
	if(action === "on")
	{
	item.parentElement.style.opacity = "1";
	item.style.opacity = "1";
	item.style.visibility = "visible";
	}
	else
	{
	item.style.fill = "none";
	item.style.opacity = "0"
	}
}

//************* Control the Text Size ****************************************
// Maybe put this on general functions?
function txtResize(wich, dir)
{
	console.log("prevsize",document.getElementById(wich).style.fontSize)
	var size =  parseFloat(document.getElementById(wich).style.fontSize);
	console.log("size",size)
	if(dir == "grow")
	{
		size = parseFloat(size + 0.1);
		document.getElementById(wich).style.fontSize = 	size + "vh";
	}
	else
	{
		size = parseFloat(size - 0.1);
		document.getElementById(wich).style.fontSize = 	size + "vh";
	}
	
}

function output(text) //Dump info about the files loaded
{
	document.getElementById("output").textContent += text;
	//dump(text);
}
//************* Control the blurring ****************************************

var sw_down = false;
var blVal = 0;
var mi;
function blurring(where)
{
	const itMouse = setInterval(mouseCheck, 10);
	mi = where.id;
	function mouseCheck()
	{
		if(sw_down)
		{
		if(mi == "bl"){blVal += 0.05;}
		else{blVal -= 0.05;}
		setBlur(blVal);
		}
		else
		{
			clearInterval(itMouse);
		}
	}
}
function setBlur(blVal)
{
	//It's not just changing the filter value, we need to alter the animations too.
	document.getElementById("blA").setAttribute("fill","remove");
}
function changeBlur(where)
{
	sw_down=true;
	document.getElementById("combini").setCurrentTime(0);
	blurring(where);
}
function stopBlur(where)
{
	sw_down=false;
}

//************* Random defects ****************************************

async function rndRes()
{
	document.getElementById("slideActive").style.filter = "";
	var el = document.getElementById("slideActive");
	var style = window.getComputedStyle(el);
 
	sldDirt.style.visibility = "hidden";
	sldDmg.style.visibility = "hidden";
	
	if (getRndInteger(0, 10) === 5 ){rndBlur();}
	if (anArr[sliNdx]["dirt"]){rndDirt();console.log("dirt");}
	if (anArr[sliNdx]["damage"]){rndDmg();console.log("damage");}
	rndBlur()
	document.getElementById("slideText").innerHTML = "";
	typeText('slideText',anArr[sliNdx]["description"],'fw','wr',3);

	if (anArr[sliNdx]["aged"]){
		document.getElementById("slideActive").style.setProperty("filter", "url(#myFilt) grayscale(40%) sepia(10%);");
	}
	else {
		document.getElementById("slideActive").style.setProperty("filter", "");
	}	
}
//Random blur
function rndBlur()
{
	blVal = getRndInteger(0, 20);
	setBlur(blVal);
}
//Random dirt
function rndDirt()
{
	var drtNdx = getRndInteger(0, 9);
	var drtTra = getRndInteger(0, 359);
	var scale = Math.random() + 0.2;

	sldDirt.style.visibility = "visible";
	sldDirt.src = dirt[drtNdx];
	sldDirt.style.height = scale * sldDirt.naturalHeight;
	sldDirt.style.width = scale * sldDirt.naturalWidth;
	sldDirt.style.transform = "rotate(" + drtTra + "deg)";	
	sldDirt.style.top = sldAct.style.top + 50;
	sldDirt.style.left = sldAct.style.left + 10;

}
//Random damage
function rndDmg()
{
	var dmgNdx = getRndInteger(0, 10);

	sldDmg.style.visibility = "visible";
	sldDmg.src = damage[dmgNdx];
	sldDmg.style.height = sldAct.style.height;
	sldDmg.style.width = sldAct.style.width;
	sldDmg.style.top = 0;
	sldDmg.style.left = 0;
}
//Random Effect
function rndEff(which)
{
	console.log ("effect which " + which)
	sliClicks.load();
	sliClicks.autoplay = true;

	if(which === 0){rndDirt()}
	else{rndDmg();}
}

//Switch random effects
function swDmg(which)
{

	sliSwitch.load();
	sliSwitch.autoplay = true;
	var  effNam = ["slideDirt","slideDmg"];
	var swChng = document.getElementById("sw_"+which);
	
	if (sw_effects[which])
	{
		document.getElementById(effNam[which]).style.opacity = "0%";
		document.getElementById(effNam[which]).style.visibility = "hidden";		
		sw_effects[which] = false;
		swChng.src = "slides/switch_"+ which +"_a.png";
	}
	else
	{
		document.getElementById(effNam[which]).style.visibility = "visible";
		document.getElementById(effNam[which]).style.opacity = "100%";
		sw_effects[which] = true;
		swChng.src = "slides/switch_"+ which +"_b.png";
	}
}
//************* Switch off ****************************************
function powerOff()
{
	sliPow.load();
	sliPow.autoplay = true;
	sliFan.pause();
	sw_on = false;
	
	sldAct.style.visibility = "hidden";
	sldDmg.style.visibility = "hidden";
	sldDirt.style.visibility = "hidden";

	document.getElementById("projector").style.opacity = "0%";
	document.getElementById("controls").style.opacity = "0%";

	document.getElementById("controls").style.visibility = "hidden";
	document.getElementById("projector").style.visibility = "hidden";
	document.getElementById("slideText").style.visibility = "hidden";
}
