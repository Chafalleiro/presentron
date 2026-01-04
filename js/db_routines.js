//Variables *****************************************************************
let db, confStore, dataStore, capStore, datasets;
var fileData;
const defaultIcon = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDABELDA8MChEPDg8TEhEUGSobGRcXGTMkJh4qPDU/Pjs1OjlDS2BRQ0daSDk6U3FUWmNma2xrQFB2fnRofWBpa2f/2wBDARITExkWGTEbGzFnRTpFZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2f/wAARCAAeACADASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAgQFBgP/xAArEAACAQMDBAAEBwAAAAAAAAABAgMABBESITEFE0FRFURhkXKBscHC4eL/xAAXAQADAQAAAAAAAAAAAAAAAAACAwQA/8QAIBEAAgIBAwUAAAAAAAAAAAAAAQIAERIDITEEYZGh8P/aAAwDAQACEQMRAD8AyPeZRCAWIIAIBPoVWsraG5Rh3JBMFJEerx7P5/WoqMO5CSdgR+1aXpkkRspUZlbOWKZ3K4FK1WIG02qcOnZxyCJx+GwyqyJPMJ1TdQds/b39amSpNbXOh2JUeQCBnPHNN9VaykjVFLxPnOTkjG/jNSRI3c0dxmReMk459VQECXYPa6seDx9ck0GdjkT6hR27OiOBnGDg8EY/qqVndLBqD2mSylSyuQdPrilIrqwjltpSkpVIgskWnZmxuc6vZp9er9EHNjP9/wDVLIB2Mra2QoeDEr9RctrjVkPGGOwG9LR2hUM7SR5GAAHXP61WPV+hn5CfbgZx/KjTq/RGOkWVwNjnfxj8VG75nIwVQKKE/9k=";
let delArr = [];
let foundArr = [];
arrCarets = [];
const emptyArr = [];

let fnOK, fnCANCEL; // the functions are saved here
let nOk=0, nCan=0, nAns=0;
let cntFound = 0;
let anArr, anArrAnt;
let imgTemp;

let objStructs = {}; //Contains data structures and indexes
let stoStore = {}; //Contains stores references

let swUpt = false; //Update db flag. To check the state of async writing operations.
let actFile = ""; //File names loaded mannualy.

//Initialization functions ***************************************************

//Declare configuration data structures.
const confNdx = {"store": "configs","keys": ["keyCo", true]}; //Indices
arrsBarrels = {
					"wide": ["scale","mx","my","mw","mh","cw","ch"],
					"square": ["scale","mx","my","mw","mh","cw","ch"],
					"tall": ["scale","mx","my","mw","mh","cw","ch"],
					};
					
					
const confStruct = {"store": "configs","keys": ["keyCo","color","brightness","contrast","barrel",arrsBarrels]}; //Fields
const confScr = [] // Configuration is a special case, having two different screens.

var fileConf;
//Working array

arrsBarrels = {"wide": {scale:95,mx:-0.3, my:-1.11,mw:1.65,mh:2.9,cw:2537,ch:3149},
				"square": {scale:100,mx:-0.3, my:-0.9,mw:1.5,mh:2.5,cw:2019,ch:480},
				"tall": {scale:50,mx:-0.23, my:-0.83,mw:1.65,mh:2.5,cw:803,ch:2471}}
let confArr =  {keyCo: 1, color: 'greenC', brightness: 1, contrast: 1,						//Screen color
				barrel: true, "arrsBarrels": arrsBarrels};	//CRT geometry
let confArrAnt = confArr;

var confData = {"store":"configs", "indexes":confNdx, "struct":confStruct, "screen": confScr}; //This object contains the structure of the configuration datasets and display fields
objStructs["configs"] = confData;
/*
So:
objStructs can be accesed by key, that key shuld be the same name of the datastore for simplicity
objStructs then will link to an object made of the data structures of a store
objStructs[key].store will have the store name
objStructs[key].store.indexes will have the indexes of that store, listed in an array named keys.
keys first pair will have the keyPath, subsequent pairs can be used in createIndex.

objStructs[key].store.struct will store the data structure of that store for json parsing, working data arrays and file checking.
objStructs[key].store.screen will hold the data structure to print and make field tables.
sstoStore[key] will point at the store named with key.
*/

db_init("presentron");
//Initialize database
async function db_init(db_used) //Databases
{
	db = await idb.openDB(db_used, 1, //Open DB usin idb wrapper (umd.js)
	{
		upgrade(db, oldVersion, newVersion, transaction) //Is there a new db version?
		{
			console.log("Old version: " + oldVersion);
			console.log("Upgrading database to version " + newVersion);
			switch(oldVersion)
			{
				case 0:
					Object.keys(objStructs).forEach(key => {
							console.log(key, objStructs[key]);
							console.log("store: "+ objStructs[key].store)
							console.log("keypath: "+ objStructs[key].indexes.keys[0])
							stoStore[objStructs[key].store] = db.createObjectStore(objStructs[key].store,{keyPath: objStructs[key].indexes.keys[0], autoIncrement: objStructs[key].indexes.keys[1],});
							console.log("keypath: "+ objStructs[key].indexes.keys[0])
							});
					break;
				default:
					console.log("Upgrading database");
			}
		}
	});
	// Initial configuration of stores and screen settings.
	let tx = db.transaction('configs');
	let objStore = tx.objectStore('configs');
	let confs = await objStore.getAll();
	if (confs.length)
	{	//Init screen configuration based on saved values.
		console.log("Already configured. Setting display prefs on.");
		let actConf = await db.get('configs',1);
		document.getElementById('brrlChck').checked = actConf.barrel; //Write the HTML CRT barrel check element and apply conf.
		barrelCheck('content', document.getElementById('brrlChck'));
		//CRT skew and position.
		document.getElementById('slider-x').value = actConf.arrsBarrels[actRatio].scale;
		moveSlider(document.getElementById('slider-x'), 'scale');
		
		document.getElementById('slider-mx').value = actConf.arrsBarrels[actRatio].mx;
		moveSMT(document.getElementById('slider-mx'), 'x');
		document.getElementById('slider-my').value = actConf.arrsBarrels[actRatio].my;
		moveSMT(document.getElementById('slider-my'), 'y');
		
		document.getElementById('slider-mw').value = actConf.arrsBarrels[actRatio].mw;
		moveSMT(document.getElementById('slider-mw'), 'width');
		document.getElementById('slider-mh').value = actConf.arrsBarrels[actRatio].mh;
		moveSMT(document.getElementById('slider-mh'), 'height');
		
		document.getElementById('slider-cw').value = actConf.arrsBarrels[actRatio].cw;
		moveRoot(document.getElementById('slider-cw'), 'width');
		document.getElementById('slider-ch').value = actConf.arrsBarrels[actRatio].ch;
		moveRoot(document.getElementById('slider-ch'), 'height');

		 //Set screen colour, contrast and brightness.
		setColor('colA','svg-root', actConf.color);
		document.getElementById('slider-con').value = actConf.contrast; //Change sliders values.
		document.getElementById('slider-br').value = actConf.brightness;
		brcon(document.getElementById('slider-con'),'con');
		brcon(document.getElementById('slider-br'),'br');
		
		confArrAnt = actConf;
	}
	else
	{
		console.log("No configuration store, setting defaults.");
		let actConf = await db.add('configs', confArr);
		document.getElementById('brrlChck').checked = true; //Write the HTML CRT barrel check element and apply conf.
		barrelCheck('content', document.getElementById('brrlChck'));
		//CRT skew and position.
		document.getElementById('slider-x').value = 100;
		moveSlider(document.getElementById('slider-x'), 'scale');

		document.getElementById('slider-mx').value = -0.37;
		moveSMT(document.getElementById('slider-mx'), 'x');
		document.getElementById('slider-my').value = -1.05;
		moveSMT(document.getElementById('slider-my'), 'y');
		
		document.getElementById('slider-mw').value = 1.5;
		moveSMT(document.getElementById('slider-mw'), 'width');
		document.getElementById('slider-mh').value = 1;
		moveSMT(document.getElementById('slider-mh'), 'height');
		
		document.getElementById('slider-cw').value = 640;
		moveRoot(document.getElementById('slider-cw'), 'width');
		document.getElementById('slider-ch').value = 480;
		moveRoot(document.getElementById('slider-ch'), 'height');

		//Set screen colour, contrast and brightness.
		setColor('colA','svg-root', 'greenC');
		document.getElementById('slider-con').value =  1; //Change sliders values.
		document.getElementById('slider-br').value =  1;
		brcon(document.getElementById('slider-con'),'con');
		brcon(document.getElementById('slider-br'),'br');

		//If there is no configuration store, sure there isn't a Games store either.
		//If there is no configuration store, sure there isn't a icons store either.
		//If there is no configuration store, sure there isn't a sounds store either.
	}
	//redrawTimer(timersArr);
}

//Save settings to file
async function saveConf()
{
	console.log("Saving config");
	
	let transaction = db.transaction('configs', "readonly");
	let objectStore = transaction.objectStore('configs');
	let confs = await objectStore.getAll();
	if (confs.length)
	{
		keysC = Object.keys(confs[0]);
		let headers = {store: 'configs', keys: Object.keys(confs[0])};
		confs.unshift(headers);
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([JSON.stringify(confs, null, 2)], {type: "application/json"}));
		a.setAttribute("download", "presentronConf.json");
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
}
//Load settings from file

async function loadConf()
{
	fileConf = document.createElement("input");
	fileConf.setAttribute("type", "file");
	fileConf.setAttribute("accept", ".json");
	fileConf.setAttribute("name", "fileConf"); // You may want to change this
	fileConf.style.visibility = "hidden";
	document.body.appendChild(fileConf);
	fileConf.addEventListener('change', x, false);	
	console.log("Loading config");
	fileConf.click();
	document.body.removeChild(fileConf);
}
function x() {
	if (fileConf.files.length > 0)
	{
		let reader = new FileReader();
        reader.addEventListener('load', function() {
			let result = JSON.parse(reader.result); // Parse the result into an object
			let header = result[0];
			if(header.store != confStruct.store){
				alert("Import error.\nThe store declared in file is "+header.store+ "\nWhile the store we are importing is " +confStruct.store+"\nIgnoring Import.");
				console.log("A wild Json has appeared!...");console.log("We ignore it...");console.log("It's, super effective!...");
				}
			else
			{
				let cnt=Object.keys(confStruct.keys).length;
				let eqR=0;
				let keysSt = confStruct.keys;
				let keysIn = header.keys;
				for(let i = 0; i<cnt; i++)
				{
					if(keysSt[i] == keysIn[i]){eqR++;}
				}
				if(eqR < 5){
					alert("Import error.\nDeclared registers ("+cnt+") doesn't match the imported file registers.("+eqR+")\nIgnoring Import.");
					console.log("Import error.\nDeclared registers ("+cnt+") doesn't match the imported file registers.("+eqR+")\nIgnoring Import.");}
				else
				{
					confArrAnt = result[1];//Only one register is used in configuration.
					modConfig(false);				
				}
			}
        });
        reader.readAsText(fileConf.files[0]); // Read the uploaded file
	}
}

//Data and media manipulation functions **************************************
//Export import data
async function exportDt(ds)
{
	
	console.log("Exporting "+ds);

	let transaction = db.transaction(ds, "readonly");
	let objectStore = transaction.objectStore(ds);
	let sName = ds + "_data";
	let regs = await objectStore.getAll();
	if (regs.length)
	{
		let keysC = Object.keys(regs[0]); //Get the field list
		let headers = {store: ds, keys: keysC};
		regs.unshift(headers); //Put the store name and field list as file header.
		
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([JSON.stringify(regs, null, 2)], {type: "application/json"}));
		a.setAttribute("download", sName+".json");
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
	else
	{alert("There is no data to save");}
}
//Load settings from file

async function importWin(ds)
{
	let transaction = db.transaction(ds.store, "readonly");
	let objectStore = transaction.objectStore(ds.store);
	let regs = await objectStore.getAll();

	console.log("importwin", regs)
		
	const bodyRow = document.getElementById("importBody");
	const tr = document.createElement('tr');
	bodyRow.innerHTML = "";
	var span = document.createElement('span');
	var tooltip = document.createElement('span');
	// Iterate through each field in the fields object
	var td = document.createElement('td');

	td.classList.add('cellTit');
	span.classList.add('tooltiped');
	
	span.textContent = "[ Overwrite ]";
	span.onclick = function() {importDt(ds,"ow",regs);};//importDt(dt,m,rr) //dt = store name, m = mode, rr = working array
	span.classList.add('textbutton');
	td.appendChild(span);

	tooltip.classList.add('tooltiptext');
	tooltip.textContent = "Overwrite the existing registers with the file ones.";
	span.appendChild(tooltip);
	td.appendChild(span);

	tr.appendChild(td);
	
	td = document.createElement('td');
	span = document.createElement('span');
	tooltip = document.createElement('span');

	td.classList.add('cellTit');
	span.classList.add('tooltiped');
	tooltip.classList.add('tooltiptext');
	
	span.textContent = "[ Ask ]";
	span.onclick = function() {importDt(ds,"ask",regs);};
	span.classList.add('textbutton');//importDt(dt,m,rr) //dt = store name, m = mode, rr = working array
	td.appendChild(span);


	tooltip.textContent = "Ask to overwrite a register if seems duplicated.";
	span.appendChild(tooltip);
	td.appendChild(span);
	tr.appendChild(td);

	td = document.createElement('td');
	span = document.createElement('span');
	tooltip = document.createElement('span');

	td.classList.add('cellTit');
	span.classList.add('tooltiped');
	tooltip.classList.add('tooltiptext');
	
	span.textContent = "[ Skip ]";
	span.onclick = function() {importDt(ds,"sk",regs);};
	span.classList.add('textbutton');//importDt(dt,m,rr) //dt = store name, m = mode, rr = working array
	td.appendChild(span);


	tooltip.textContent = "Skip a register if seems duplicated.";
	span.appendChild(tooltip);
	td.appendChild(span);
	tr.appendChild(td);


	bodyRow.appendChild(tr);

	
	showModal("importData");
}
async function importDt(dt,m,rr) //dt = store name, m = mode, rr = working array
{
	console.log("store "+dt.store+" mode "+m);
	fileData = document.createElement("input");
	fileData.setAttribute("type", "file");
	fileData.setAttribute("accept", ".json");
	fileData.setAttribute("name", "fileData"); // You may want to change this
	fileData.style.visibility = "hidden";
	document.body.appendChild(fileData);
	console.log("Loading data");
	fileData.addEventListener('change', function(e){y(dt,m,rr);}, false);
	fileData.click();
	document.body.removeChild(fileData);
}

function y(dt,mo,rr) {
	if (fileData.files.length > 0)
	{
		let reader = new FileReader();
        reader.addEventListener('load', function()
		{
			let result = JSON.parse(reader.result); // Parse the result into an object
			//Since IDB stores accpets just any well formed data, we need to check if the file is written for us or is just some wild json roaming in the disk.
			let header = result[0];
			let cnt = 0;
			let eqR = 0;
			let swEq = false;
			console.log("header", header);
			console.log("result", result);
			actFile = fileData.files[0];
			let keysIn = header.keys.slice().sort();
			let keysSt = dt.keys.slice().sort();
			cnt = Object.keys(dt.keys).length;
			let impStore = dt.store;
			let impScreen = 'importScreen';
			if(header.store != impStore){
				alert("Import error.\nThe store declared in file is "+header.store+ "\nWhile the store we are importing is " +impStore+"\nIgnoring Import.");
				console.log("A wild Json has appeared!...");console.log("We ignore it...");console.log("It's, super effective!...");
				}
			else
			{
				for(let i = 0; i<cnt; i++)
				{
					if(keysSt[i] == keysIn[i]){eqR++;}		
				}
				if(eqR !== cnt){
					alert("Import error.\nDeclared registers ("+cnt+") doesn't match the imported file registers.("+eqR+")\nIgnoring Import.");
					console.log("Import error.\nDeclared registers ("+cnt+") doesn't match the imported file registers.("+eqR+")\nIgnoring Import.");
					}
				else
				{
					rr = result;
					rr.splice(0, 1);//Remove the headers.
					showModal('importData');
					writeMedia(mo, dt, rr);
				}
			}
        });
        reader.readAsText(fileData.files[0]); // Read the uploaded file
	}
}

//Sort array items
function resetCarets()
{
	if(arrCarets){arrCarets.forEach((element) => element.style.display = "none");}
}
function setCarets(column,body,field)
{
	let caret = document.getElementById("caret_" + body +"_"+ field);
	resetCarets();
	if(!caret)
	{
		caret = document.createElement("span");
		caret.id = "caret_" + body +"_"+ field;
		if(field=="mines"){console.log(caret.id);}
		caret.innerHTML = "▾";
		dir = "asc";
		column.appendChild(caret);
		arrCarets.push(caret);
		caret.style.display = "inline";
	}
	else
	{
		caret.style.display = "inline";
		if(caret.innerHTML == "▾")
		{
			caret.innerHTML = "▴";
			dir = "dsc";
		}
		else
		{
			caret.innerHTML = "▾";
			dir = "asc";
		}	
	}
	return dir;
}
function spanSort(span,body,dataArray,field)
{
	let dir = setCarets(span,body,field);
	sortArray(dataArray,field,dir);
	redrawSpan(body);
}
function tableSort(column, wich, dataArray, field, scrTabl, mDB)
{
	const body = wich + "Body";
	console.log("wich", wich)
	console.log("body", body)
	
	let dir = setCarets(column,body,field);
	if(dataArray != ""){
		sortArray(dataArray,field,dir);
		writeTbody(mDB, wich, dataArray, scrTabl);
	}
	else
	{	
		showFlash("flash",  "dataArray is Empty", 0.1, 1.1);
	}
}
function sortArray(dataArray,field,dir)
{
	let strFunc = "";
	let str = eval("dataArray[0]." + field);//Get a sample of the data to sort.
	if(!isNaN(str))
	{
		strFunc = "(a,b) => a." + field + " - b." + field + ";";
	}
	else
	{
		strFunc = `
			(a, b) => {
			let x = a.${field}.toLowerCase();
			let y = b.${field}.toLowerCase();
			if (x < y) {return -1;}
			if (x > y) {return 1;}
			return 0;
		};`;
	}
	dataArray.sort(eval(strFunc));
	if(dir != "asc"){dataArray.reverse();}
}
//Media data types

function base64ToBlob(base64String) //Convert a string base64 data to a binary blob.
{
	//Strip the mime and get only the base64 data.
	var base64Mime = base64String.split(',')[0].split(':')[1].split(';')[0]; //Here is the mime type, we need to attach it later to the blob.
	var base64Data = base64String.split(',')[1]; //The data, we convert later to binary.
	const byteCharacters = atob(base64Data);
	const byteArrays = [];
	for (let i = 0; i < byteCharacters.length; i++) {
		byteArrays.push(byteCharacters.charCodeAt(i));
	}
	const byteArray = new Uint8Array(byteArrays);
	var blob = new Blob([byteArray], {type: base64Mime}); //The blob data with a mime header, can be stored.
	var blobURL = window.URL.createObjectURL(blob); //The blob address, can be used in media tags.
	var blobDataR = [blob,blobURL]; //We put togheter data and adress for easier manipulation.
	return blobDataR;
}

async function passBlob(blob) //Converting a blob to base64 string in two steps to store it properly for later use.
{
	try{
	const response = await blobToBase64(blob); //Calling a promise we can extract its value to a variable.
	const resp = await response;
	return resp;
	
	}
	catch(error) {
        console.log(error);
    }
}

const blobToBase64 = blob => { //Convert a binary blob into a base64 string usable by a json exportable object.
  const reader = new FileReader();
  reader.readAsDataURL(blob[0]); //we use the binary data of the pair binary/address we created and stored before.
  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

//Media data manipulation

async function drawCompare(array,index)
{
	console.log("array,index",array,index);
	document.getElementById("titQuestion").innerHTML = "Overwrite register";
	document.getElementById("textQuestion").innerHTML = "Do you wat to overwite the current stored register with the imported data?";
	let bodyQ = document.getElementById("bodyQuestion");
	bodyQ.innerHTML = ``;
	
	Object.keys(array[index][0]).forEach(
	function callback(field,ndx)
	{
		console.log("field",field);
		let strOut = `<tr>
			<td width="34%" class="tdWindow"> ${field} </td>`;
			let testMedia = -1;
			if(typeof array[index][0][field] === 'string')
			{testMedia = array[index][0][field].lastIndexOf("data:");}
			if(testMedia != -1 )
			{
				var base64Mime = array[index][0][field].split(',')[0].split(':')[1].split(';')[0];
				var imageType = /(jpe?g|png|gif|webp)$/i;
				var soundType = /(opus|mp3|ogg)$/i;
				if(!imageType.test(base64Mime))
				{
					if(soundType.test(base64Mime))
					{
						strOut += `<td width="33%" class="tdWindow"><img src="${imgSound}" style="heigth: 64px; width: 64px; cursor: pointer;" onclick="soundTest('${array[index][0][field]}');return false;">
						</td>
						<td width="33%">
						<img src="${imgSound}" style="heigth: 64px; width: 64px; cursor: pointer;" onclick="soundTest('${array[index][1][field]}');return false;">
						</td>`;
					}
					else{console.log("NOT A RECOGNIZED MEDIA TYPE "+base64Mime);}
				}
				else
				{
					strOut += `<td width="33%" class="tdWindow"><img src="${array[index][0][field]}" style="heigth: 64px; width: 64px"></td>
					<td width="33%" class="tdWindow"><img src="${array[index][1][field]}" style="heigth: 64px; width: 64px"> </td>`;
				}
			}
			else
			{
				strOut += `<td width="33%" class="tdWindow"> ${array[index][0][field]} </td>
				<td width="33%" class="tdWindow"> ${array[index][1][field]} </td>`;
			}
		strOut += `</tr>`;
		bodyQ.innerHTML += strOut;
	});
	showModal('yesNo');
}

function askOverwrite(par,msg,st)//Par, which stage. msg Message from button. st storage to use.
{
	switch(par)
	{
		case 1:
			console.log("par: "+ par + ", nOk :" +nOk+ ", nCan :" +nCan+ ", nAns :" +nAns+ ", msg :" + msg + " storage: "+ st);
		break;
		case 2:
		console.log("par: "+ par + ", nOk :" +nOk+ ", nCan :" +nCan+ ", nAns :" +nAns+ ", msg :" + msg + " storage: "+ st);
			if(nAns <= foundArr.length)
			{
				showModal('yesNo');
				if(nAns < foundArr.length){drawCompare(foundArr,nAns);}
				if(msg == "OK")
				{
					console.log("Overwriting");
					let tx = db.transaction(st, 'readwrite');
					let request = tx.objectStore(st).put(foundArr[nAns-1][1]);
				}
				else
				{
					console.log("Skipping");
				}
			}
			else
			{
				showModal('yesNo');
			}
		break;
		case 3:
			console.log("par: "+ par + ", nOk :" +nOk+ ", nCan :" +nCan+ ", nAns :" +nAns+ ", msg :" + msg);
			nAns = 0; //reset loop
			foundArr = structuredClone(emptyArr);
		break;
	}
}

async function mediaFile(sender,dest,event,tp)
{
	fileData = document.createElement("input");
	fileData.setAttribute("type", "file");
	if(tp == "img"){
	fileData.setAttribute("accept", " accept='image/png, image/jpeg, image/gif, image/webp'");
	}
	fileData.setAttribute("name", "fileData"); // You may want to change this
	fileData.style.visibility = "hidden";
	document.body.appendChild(fileData);
	console.log("Loading data");
	fileData.addEventListener('change', function(e){dodrop(sender,dest,e,"dialog");}, false);
	fileData.click();
	document.body.removeChild(fileData);
	return dest;
}


function dodrop(sender,dest,event,tp) //Drop the media and add it to a working array.
{
	var dt = event.dataTransfer;
	if(tp == "dialog" )
		{
		files = event.target.files;
		}
	else{
		var dt = event.dataTransfer;
		files = dt.files;
	}
	var nBytes =	0;
	var count = files.length;
	var sOutput;
	var fileType;
	if(tp == "sound"){fileType = /(ogg|mp3|opus)$/i;}
	else {fileType = /(jpe?g|png|gif|webp)$/i;}
	var soundType = /(ogg|mp3|opus)$/i;
	var npf = 0;
	var i = 0;
	for (i = 0; i < files.length; i++) {if (!fileType.test(files[i].type)) {npf++;}
	}

	for (i = 0; i < files.length; i++) {
		if (fileType.test(files[i].type)) {
			var reader = new FileReader();
			reader.onload = function(e){
				if(tp == "sound"){sender.src = imgSound;}
				else {sender.src = e.target.result;}
				//eval(dest +" = e.target.result"); //We store it as base64, blobs are unstable and can't be used offline.
				dest = sender.src;
				imgTemp = sender.src;
				};
			reader.readAsDataURL(files[i])
			}
		else
			{
				var nBytes = files[i].size;
				for (var aMultiples = ["</b>KiB", "</b>MiB", "</b>GiB", "</b>TiB", "</b>PiB", "</b>EiB", "</b>ZiB", "</b>YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++)
				{
					sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
				}
				console.log(" File " + i + ":\n(" + (typeof files[i]) + ") : <" + files[i] + " > Name: " +
				files[i].name + " Date: " + files[i].lastModifiedDate + " Type: " + files[i].type +
				" Size: " + sOutput + "\n");
				if(tp == "sound"){alert("Only ogg, mp3 and opus files are allowed");}
				else {alert("Only jpeg, png gif and webp files are allowed");}
			}
	}
}

async function searchNadd(st,vl,ky,mo)
{
	console.log("st",st,"vl",vl,"ky ", ky,"mo",mo);
	let val = await db.get(st, ky);
	let valPair = [];
	if(val)
	{
		if(mo == "ask") //Prepare the registers for asking modal.
		{
			valPair.push(val);
			valPair.push(vl);
			foundArr.push(valPair);
		}
		else if(mo == "ow") //Overwrite.
		{
			console.log("Overwriting "+ ky);
			let request = await db.put(st, vl);
		}
	}
	else  //Overwrite.
	{	
		console.log("Writing "+ ky);
		let tx = db.transaction(st, 'readwrite');
		let request = tx.objectStore(st).put(vl);
	}
}

async function writeMedia(mode, dstore, arrayUsed) //Write to database.
{
	let tx = db.transaction(dstore.store, 'readwrite');
	swUpt = false;
	switch(mode)
	{
		case "ow":
			console.log("Overwriting.");
			arrayUsed.forEach(rrUsed => {
				let request = tx.objectStore(dstore.store).put(rrUsed);
			});
		break;

		case "ask":
		console.log("Asking.");
			let awaitableVar = 0;
			for(let i=0; i< arrayUsed.length; i++)
			{
				console.log("dstore.index",dstore.index,"arrayUsed[i][dstore.index]",arrayUsed[i][dstore.index]);
				awaitableVar = await searchNadd(dstore.store, arrayUsed[i], arrayUsed[i][dstore.index], mode);
			}
			await drawCompare(foundArr,0);
			await questionLoop("askOverwrite", foundArr.length, dstore.store)
		break;

		case "sk":
			console.log("Skipping.");
			arrayUsed.forEach(rrUsed =>
			{
				searchNadd(dstore.store, rrUsed, rrUsed[dstore.index], mode);
			});
		break;
	}
	let objectStore = tx.objectStore(dstore.store);
	var datasets = await objectStore.getAll(); //Refresh the arrays
	anArr = structuredClone(datasets);
	showAlert("alertW", "DataStore '" + dstore.store + "' written.", "normal");
	swUpt = true;
	console.log("anArr wrotemedia",anArr);
}

//Delete registers
function delReg(mdb,wich,struct,key,act)
{
	//console.log("mdb",mdb,"wich",wich,"struct",struct,"key",key,"act",act);
	switch(act)
	{
		case "mark":
			if(objDel[struct.store].delKeys.includes(key)){
				objDel[struct.store].delKeys = objDel[struct.store].delKeys.filter(item => item !== key);
			}
			else{
				objDel[struct.store].delKeys.push(key);
			}
	
			break;
		case "erase":
			objDel[struct.store].delKeys.forEach(
				function callback(key)
				{
					console.log("deleting "+ key  + " in "+struct.store)
					objDel[struct.store].delKeys = objDel[struct.store].delKeys.filter(item => item !== key);
					db.delete(struct.store,key);
				}
		);		
			break;
	}
	initDisplays(mdb, struct.store,wich,objStructs[struct.store].screen,"all");	
}

//Configuration functions **********************************************
async function sndGetTest(store, akey, soundField)
{
	let snd = await db.get(store, akey);
	soundTest(snd[soundField]);
}

//MAIN
//initDisplays("presentron", "files","cart",fileScr,"all");
async function initDisplays(mDB, anStore, wich, scrTabl, aRange)
{
	var test;
	db = await idb.openDB(mDB, 1);
	let tx = db.transaction(anStore, "readonly");
	let objectStore = tx.objectStore(anStore);
	let myDatasets = await objectStore.getAll();
	anArr = await structuredClone(myDatasets);
	//* cart is the name, cart +List the div, +Head the header, +Body and +Bottom the rest.
	//Write the header
	wrtHead(mDB, wich, scrTabl, anArr);
	if(myDatasets == ""){
		showAlert("alertW", "DataStore '" + anStore + "' is Empty", "normal");
		showFlash("flash",  "DataStore '" + anStore + "' is Empty", 0.1, 1.1);
	}
	writeTbody(mDB, wich, anArr, scrTabl);
	writeTbottom(mDB, wich, anArr, anArrAnt, scrTabl);
}

async function wrtHead(mDB, wich, scrTabl, anArr)
{
	const headerRow = document.getElementById(wich + "Head");
	headerRow.innerHTML = "";
	// Iterate through each field in the fields object
	Object.entries(scrTabl.fields).forEach(([key, value]) => {
		// Create a th element
		const th = document.createElement('th');
		th.classList.add('cellTit');
		th.style.cursor = "pointer";
		// Add the key as text content
		th.textContent = capFirst(key);
		th.onclick = function() {tableSort(this, wich, anArr, key, scrTabl, mDB);};
		//element.dataset.fieldType
		th.dataset.fieldType = value.type;
		// Create a span for the info
		const span = document.createElement('span');
		span.textContent = value.info;
		span.classList.add('tooltiptext');
		// Append the span to the th
		th.appendChild(span);
		// Append the th to the header row
		headerRow.appendChild(th);
	});
	const th = document.createElement('th');
	th.classList.add('cellTit');
	th.colSpan = 2;
	th.textContent = "Actions";
	headerRow.appendChild(th);
}

async function writeTbody(mDB, wich, anArr, scrTabl)
{
	const bodyRow = document.getElementById(wich + "Body");
	bodyRow.innerHTML = "";
	if(anArr.length){
		for(const item of anArr)
		{
			const tr = document.createElement('tr');
			// Iterate through each field in the fields object
			Object.entries(scrTabl.fields).forEach(([key, value]) => {//Print data
				const td = document.createElement('td');
				const img = document.createElement("img");				
				switch(value.type)
					{
					case "index":
						console.log("include",objDel[scrTabl.store].delKeys.includes(item[key]))
						if(objDel[scrTabl.store].delKeys.includes(item[key]))
						{
							td.classList.add('font_stroke');
						}
						td.textContent = item[key];
						td.classList.add('cellTit');
						tr.appendChild(td);
						break;
					case "text":
					case "filepath":
						td.textContent = item[key];
						td.classList.add('cellTit');
						td.classList.add('font_normal_white');
						tr.appendChild(td);
						break;
					case "img":
						img.height = 150;
						img.width = 150;
						img.src = item[key];
						img.title = item["title"];
						td.appendChild(img);
						tr.appendChild(td);			
						break;
					case "bool":
						var input = document.createElement("input");
						input.classList.add('inputMod');
						input.type = 'checkbox';
						input.classList.add('green-input');
						input.checked = item[key];
						td.appendChild(input)
						td.classList.add('cellTit');
						tr.appendChild(td);
						break;
					case "emoji":
						td.textContent = item[key];
						td.classList.add('cellTit');
						td.classList.add('news');
						tr.appendChild(td);
						break;
					}
			});
			//Print Actions
			Object.entries(scrTabl.fields).forEach(([key, value]) => {//Print data
			var td = document.createElement('td');
			var span = document.createElement('span');
			if(value.type == "index")
				{
				span.textContent = "[Edit]";
				span.onclick = function() {editFields(mDB, wich, scrTabl, item[key],false);};
				span.classList.add('textbutton');
				td.classList.add('cellTit');
				td.appendChild(span);
				tr.appendChild(td);
				td = document.createElement('td');

				span = document.createElement('span');
				span.textContent = "[Delete]";
				if(objDel[scrTabl.store].delKeys.includes(item[key]))
				{
					span.textContent = "[UnMark]";
				}
				span.classList.add('textbutton');
				span.onclick = function() {delReg(mDB, wich, scrTabl, item[key],"mark");};
				td.appendChild(span);
				td.classList.add('cellTit');
				tr.appendChild(td);
				//Maybe a generic field in definitios to add this optional action?
				if(scrTabl.store == "files")
					{
					span = document.createElement('span');
					td = document.createElement('td');
					span.textContent = "[Proyector]";
					span.classList.add('textbutton');
					span.onclick = function() {startProyector(item[key]);};
					td.appendChild(span);
					tr.appendChild(td);
					}
					
				}
			});
		bodyRow.appendChild(tr);			
		}
	}
		
}

async function writeTbottom(mDB, wich, anArr, anArrAnt, scrTabl)
{
	var cSpan = 1;
	const btmRow = document.getElementById(wich + "Bottom");
	var td = document.createElement('td');
	var span = document.createElement('span');
	
	btmRow.innerHTML = "";
	Object.entries(scrTabl.fields).forEach(([key, value]) => {
		cSpan++;
	});
	
	span.textContent = "[Add new]";
	span.classList.add('textbutton');
	span.onclick = function() {editFields(mDB, wich, scrTabl, "Add new", true);};
	td.classList.add('cellTit');
	td.colSpan = cSpan;
	td.appendChild(span);
	btmRow.appendChild(td);
	if(objDel[scrTabl.store].delKeys.length > 0)
	{
		span = document.createElement('span');

		span.classList.add('textbutton');
		span.textContent = "[Erase]";
		span.onclick = function() {delReg(mDB, wich, scrTabl, "all","erase");};
		td.appendChild(span);
	}	
}

//Adding data
async function editFields(mDB, wich, scrTabl, reg, op)
{
	if(reg == "Add new")
	{
	var arrTemp = Object.fromEntries(Object.entries(scrTabl.fields).map(([key, val]) => [key, ""]),);	
	}
	else{
		const value = await db.get(scrTabl.store, reg);
		var arrTemp = Object.fromEntries(Object.entries(value).map(([key, val]) => [key, val]),);
	}


	document.getElementById("editTable").innerHTML = "";
	const emojiList = createEmojiTable();
	const editTable = document.createElement('table');
	editTable.classList.add('tableMin');
	editTable.classList.add('sortable');

	Object.entries(scrTabl.fields).forEach(([key, value]) => {
		const tr = document.createElement('tr');
		const td = document.createElement('td');
		const span = document.createElement('span');
		td.classList.add('tdcontents');
		td.classList.add('cellNorm');
		td.style.color = '#66ff66';
		const tdi = document.createElement('td');
		tdi.classList.add('tdcontents');
		tdi.classList.add('cellNorm');
		tdi.style.width = "30%"
		tdi.style.color = '#66ff66';

		if(value.type != "index")
			{
			tdi.appendChild(span);
			span.textContent = capFirst(key);
			}
		switch(value.type)
			{
			case "index":
				console.log("index",key,value.info)
				if(arrTemp[key]=="")
					{delete arrTemp[key];} //Delete empty key objetc to add new registers. Keep if already exists}
				break;
			case "img":
				var img = document.createElement("img");
				img.src = defaultIcon;
				img.height = 300;
				img.width = 300;
				img.title = "Drag and drop an image to change the icon.";
				img.src = arrTemp[key];
				imgTemp  = arrTemp[key];
				img.ondragenter = function(event) {this.style.opacity='0.5';event.stopPropagation(); event.preventDefault();};
				img.ondragover = function(event) {this.style.opacity='0.3'; event.stopPropagation(); event.preventDefault();}; 
				img.ondragleave = function(event) {this.style.opacity='1'; event.stopPropagation(); event.preventDefault();};
				img.ondrop = function(event) {this.style.opacity='1'; event.stopPropagation(); event.preventDefault(); dodrop(this,arrTemp[key],event,"img");};
				img.onclick = function(event) {mediaFile(this,arrTemp[key],event,"img"); arrTemp[key] = this.src;};

				td.appendChild(img)			
				break;
			case "bool":
				var input = document.createElement("input");
				input.classList.add('inputMod');
				input.type = 'checkbox';
				input.classList.add('green-input');
				input.checked = arrTemp[key];
				input.onchange = function() {arrTemp[key] = this.checked;};
				td.appendChild(input)
				break;
			case "text":
				var input = document.createElement("input");
				input.type = "text"; // or "number", "email", etc.
				input.placeholder = "Enter text here";
				input.classList.add('inputWide');
				input.style.color = '#66ff66';
				input.style.backgroundColor = '#004400';
				input.value  = arrTemp[key];
				input.oninput = function() {arrTemp[key] = this.value;};
				tdi.style.color = '#66ff66';
				td.appendChild(input)
				break;
			case "emoji":
				var input = document.createElement("input");
				tdi.appendChild(emojiList);
				input.type = "text"; // or "number", "email", etc.
				input.classList.add('emojis');
				input.placeholder = "🆕";
				input.maxLength = 1;
				input.value  = arrTemp[key];
				input.id="emojiField";
				input.onfocus = function() {arrTemp[key] = this.value;};
				input.oninput = function() {arrTemp[key] = this.value;};
				td.appendChild(input)
				break;
			case "filepath":
				var input = document.createElement("input");
				input.type = "text"; // or "number", "email", etc.
				input.placeholder = "Enter path here";
				input.style.color = '#66ff66';
				input.style.backgroundColor = '#004400';
				input.classList.add('inputWide');
				input.value  = arrTemp[key];
				tdi.style.color = '#66ff66';
				input.oninput = function() {arrTemp[key] = this.value;};
				td.appendChild(input)
				break;
			}
		tr.appendChild(tdi);
		tr.appendChild(td);
		editTable.appendChild(tr);
	});

	const okB = document.createElement('span');
	const caB = document.createElement('span');
	const deB = document.createElement('span');
	const tr = document.createElement('tr');
	const td = document.createElement('td');
	const br = document.createElement('br');
	td.classList.add('tdcontents');
	td.classList.add('cellNorm');
	td.colSpan = 2;
	td.appendChild(br);
	okB.textContent = "[Save]";
	okB.onclick = async function(){
		
		anArrAnt = structuredClone(anArr);
		Object.entries(scrTabl.fields).forEach(([key, value]) =>//Find the image. Source doesn't always sync.
			{
			if(value.type == "img")
				{arrTemp[key] = imgTemp;}
			}
		);
		if(anArr.length){//A bit of a hassle here, but otherwise the assignments get async and data is misplaced in screen.
			var i = 0;
			for(const item of anArr)//Traverse the array
			{
			Object.entries(scrTabl.fields).forEach(([key, value]) =>//Search for the index used
				{
				if(value.type == "index")
					{
						if(item[key] == reg)
						{
							Object.keys(arrTemp).forEach(function(key) {//Rewite the object in the array with new info
								anArr[i][key] = arrTemp[key];
								console.log("anArr[i][key]",anArr[i][key]);
							});
						}
						
					}
				}
		);
			i++;
			}
		}
		if(op){anArr.push(arrTemp);}
		writeMedia("ow", scrTabl, anArr);
		showModal('editWin');
		let tx = await db.transaction(scrTabl.store, "readonly");
		let objectStore = await tx.objectStore(scrTabl.store);
		let myDatasets = await objectStore.getAll();
		anArr = await structuredClone(myDatasets);
		writeTbody(mDB, wich, anArr, scrTabl);
		};
	okB.classList.add('textbutton');
	td.appendChild(okB);
	caB.classList.add('textbutton');
	caB.textContent = "[Cancel]";
	caB.onclick = function() {showModal('editWin');anArr = structuredClone(anArrAnt);arrTemp = structuredClone(emptyArr)}
	td.appendChild(caB);
	tr.appendChild(td);
	
	editTable.appendChild(tr);
	
	document.getElementById("editTable").appendChild(editTable)
	document.getElementById("editWin").style.zIndex = 5;
	showModal("editWin");
	console.log("wich edit",wich)
}

function putEmoji(emo)
{
	document.getElementById("emojiField").value = emo;
	document.getElementById("emojiField").focus();
	document.getElementById("emojiField").blur();
}
const emojiObj = {
    "net": {type:"net", icons:["📡","🔍","🌐","📞","📴","📵"]},
    "computer": {type:"computer", icons:["💻","🖥","💾","🗇","🗔","🖵","","🖴","🖶","🗖","🗗","🗕"]},
    "multimedia": {type:"multimedia", icons:["🎥","📹","🔔","🔕","🔇","🔈","🔉","🔊","🎜","🎵","🎼","📺","🎤","🎧","🎮","📢"]},
    "office": {type:"office", icons:["📜","📃","📄","⏰","📋","📁","📂","🗐"]},
    "misc": {type:"misc", icons:["🆕","🚀","👀","💋","🔥","💀","🤖","👾","➕","➖","🔨","🔧","🚧"]}
};
function createEmojiTable() {
    const table = document.createElement('table');
	table.id = 'myEmojiList';
    table.style.borderCollapse = 'collapse';
    table.style.border = '1px solid #0c0';
	table.style.maxWidth = '180px';
	table.style.margin = 'auto';
	table.classList.add('tableMin');
    // Create header row
    const headerRow = document.createElement('tr');
    table.appendChild(headerRow);

    
    // Process each category
    Object.values(emojiObj).forEach(category => {
        // Create category header row
        const categoryRow = document.createElement('tr');
        const categoryHeader = document.createElement('th');
        categoryHeader.textContent = capFirst(category.type);
		var acdId = category.type + "-b";
		categoryHeader.onclick = function() {toggleAccordion(acdId);};
        categoryHeader.colSpan = 5;
		categoryHeader.classList.add('accordion-header');
		categoryHeader.classList.add('font_small');
        categoryRow.appendChild(categoryHeader);
        table.appendChild(categoryRow);
        
        // Create rows with max 5 emojis per row
        const emojis = category.icons.filter(emoji => emoji !== ''); // Remove empty strings
        for (let i = 0; i < emojis.length; i += 5) {
            const row = document.createElement('tr');
            const chunk = emojis.slice(i, i + 5);
            
            // Fill cells with emojis
            chunk.forEach(emoji => {
                const cell = document.createElement('td');
                cell.textContent = emoji;
				cell.classList.add('emojis');
				cell.style.maxWidth = '48px';
				cell.onclick = function() {putEmoji(this.innerText);};
                row.appendChild(cell);
            });
            
            // Fill remaining cells if less than 5
            while (row.cells.length < 5) {
                const emptyCell = document.createElement('td');
                row.appendChild(emptyCell);
            }
			row.classList.add('accordion');
			const tbody = document.createElement('tbody');
			tbody.id = acdId;
            tbody.appendChild(row);
			table.appendChild(tbody);
        }
    });
    
    return table;
}

//Misc functions *************************************************************

function writeSelected(value, chkVal)
{
	if (value == chkVal){return "selected";}
	else {return "";}
}

function writeChecked(chkVal)
{
	if (chkVal){return "checked";}
	else {return "";}
}

var allowedNKeys = ['Backspace','Tab','Escape','Enter','1','2','3','4','5','6','7','8','9','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Delete'];
function numericEdit(e,t) {
	if (!allowedNKeys.includes(e.key))
	{
		console.log(e.key);
		e.preventDefault();
		return false;
	}
}

const hourPattern = /^(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)$/gm;

function timeEdit(e,t,dest) {
	console.log("dest");
	console.log(dest);
	console.log(t.type);
	if(t.type == "text")
	{
		if (!allowedNKeys.includes(e.data))
		{
			t.value = t.value.replace(/[^0-9]/gm, "");//Remove non numeric.
		}
		if (!hourPattern.test(t.value))
		{
			t.style.backgroundColor = "red";
			t.value = t.value.replace(/[^0-9]/gm, "");
			t.value = t.value.replace(/(\d{2})/g, "$1:").replace(/:$/,"");
		}
		else
		{
			t.value = t.value.replace(/[^0-9]/gm, "");
			t.value = t.value.replace(/(\d{2})/g, "$1:").replace(/:$/,"");
			t.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
			console.log("t.value");
			console.log(t.value);
			dest = new Date();
			var tmp = t.value.split(":");
			dest.setSeconds(tmp[2]);
			dest.setMinutes(tmp[1]);
			dest.setHours(tmp[0]);
			console.log(dest);
			t.value = dest;
			return t.value;
		}
	}
	else
	{
		t.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
	}
	return t.value;
}

async function questionLoop(fun,limit,par1) {  
  eval(fun+"(1,limit,par1)");
  while (nAns < limit) {
    let p = new Promise((res, rej) => { fnOK = res; fnCANCEL = rej; } );
    await p
      .then( (what)	=> { nOk +=1; nAns+=1; eval(fun+"(2,what,par1)"); } )
      .catch((what)	=> { nCan+=1; nAns+=1; eval(fun+"(2,what,par1)"); } )
	  .finally(()	=> {if(nAns >= limit){eval(fun+"(3,'END')");}});
  }
}


function checkType(variable) {
    if (typeof variable === 'number') {
        return 'number';
    } else if (variable instanceof Blob) {
        return 'blob';
    } else if (typeof variable === 'string') {
        return 'string';
    } else {
        return 'unknown type';
    }
}
//************* Sound helpers ****************************************
function soundTest(sound)
{
	testSound.setAttribute("src",sound);
	testSound.load();
	testSound.autoplay = true;
	testSound.loop = false;
}

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

//Error handling *************************************************************
window.addEventListener('unhandledrejection', event => {
  alert("Error: " + event.reason.message);
});