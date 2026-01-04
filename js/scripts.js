/// @file scripts.js
/// @namespace scripts
/// Several helper scripts
//******************** Several retromator helper scripts *******************************************
var div_menu = document.getElementById("menu");
var div_content = document.getElementById("content");
let arrCarets = [];

startTime();

//********** Alerts and dialogs *******************************************
//********** Caller HTML Must Have a DIV window with tags to put messages *
//********** prompts need to have a cancel, ok system *********************
//********** prompts need to have a cancel, ok system *********************
/**
 *  @brief $(Shows a dialog)
 *  
 *  @param [in] wich $(element name that contains the HTML to show the dialog: string)
 *  @param [in] vis $(Visibility ["hidden"|"visible"]: string)
 *  @return $(no return defined)
 *  
 *  @details $(Also call posWindows(wich) to position and adjust the dialog to the current screen size)
 */
function showWin(wich,vis)
{
	document.getElementById(wich).style.visibility = vis;
	posWindows(wich);
}

//********** Shows a modal dialog *****************************************

/**
 *  @brief $(Shows a modal dialog)
 *  
 *  @param [in] wich $(element name that contains the HTML to show the dialog: string)
 *  @return $(no return defined)
 *  
 *  @details $(Also call posWindows(wich) to position and adjust the dialog to the current screen size) If not correctly sized it will fail.
 */

function showModal(wich)
{
	posWindows(wich);
	if(document.getElementById(wich).style.visibility == "visible")
	{
		document.getElementById(wich).style.visibility = "hidden";
		document.body.style.pointerEvents = "auto";
	}
	else
	{
		document.getElementById(wich).style.visibility = "visible";
		document.body.style.pointerEvents = "none";
		document.getElementById(wich).style.pointerEvents = "auto";
	}
}
//********** Shows a modal alert *****************************************

function showAlert(wich, text, mode)
{
	posWindows(wich);
	document.getElementById("alertText").innerHTML = text;
	showModal(wich); // Make it modal and adjust size
}

//********** Shows a confirmation dialog *********************************
function showConfirmation(wich, text)
{
	posWindows(wich);
	showModal(wich); // Make it modal and adjust size
	var answer = false;
	return answer;
}

//********** Shows a prompt dialog ***************************************
function showPrompt(wich, text)
{
	posWindows(wich);
	showModal(wich); // Make it modal and adjust size
	var answer = false;
	return answer;
}

//********** Shows a flash window ***************************************
let timerFade; //Define a timer var, so we can interact with it.
function showFlash(wich, text, op, dir) //Here we define and start timer. Also do de fadings
{
	ele = document.getElementById(wich + "Box");
	document.getElementById(wich + "Txt").innerHTML = text;
	sw = 0;
	clearInterval(timerFade);
	timerFade = null;
	timerFade = setInterval(function () {
        if ((op >= 1) && (dir == 1)){
            clearInterval(timerFade);
			timerFade = null;
        }
        if ((op <= 0.01) && (dir == -1)){
            clearInterval(timerFade);
			timerFade = null;
        }
        if (((op >= 1) || (op <= 0.01))  && (Math.abs(dir) != 1)){
          if(sw == 0){dir = dir * -1;sw = 1;}
          else{clearInterval(timerFade);timerFade = null;}
		}
        ele.style.opacity = op;
        ele.style.filter = 'alpha(opacity=' + op * 100 *  dir + ")"; //dir changes to substract or add opacity depending the sign
        op = op + (op * 0.1 * dir);
    }, 30);
}

let waitForVar;
function waitingForVar(wich, text, myVar) //Here we define and start timer.
{
	clearInterval(waitForVar);
	waitForVar = setInterval(function () {
        if (myVar.lenght > 0){
			console.log("myVar",myVar);
            clearInterval(waitForVar);
			waitForVar = null;
        }
    }, 30);
}

//********** Copy something to clipboard ************************************
function copyText(text)
{
	console.log("Copy: "+ text);
	navigator.clipboard.writeText(text);
	showFlash("flash", "Text: " + text + " copied to clipboard")
}

function toggleAccordion(header) {
	const classy = document.getElementsByClassName('accordion')
	for (const el of classy) {
		if (el.parentElement.id == header) {
			if (el.classList.contains('accordion')) {
				el.classList.toggle('active');
			}		
		}
		else
		{
			if (el.classList.contains('active')) {
				el.classList.toggle('active');
			}		
		}
	}
}

// Adjust sizes *********************************************************
function posWindows(wich)
{
	if(document.getElementById(wich).offsetParent){offParent = document.getElementById(wich).offsetParent;}
	else{offParent = document.getElementById(wich);}
	document.getElementById(wich).style.top = (offParent.scrollTop + 100)+"px";
	document.getElementById(wich).style.width = (window.innerWidth - 200)+"px";
	document.getElementById(wich).style.left = parseInt(
													(parseInt(window.innerWidth) - parseInt(document.getElementById(wich).offsetWidth)
													)/4);
	if (document.getElementById(wich).offsetHeight > window.innerHeight)
		{document.getElementById(wich).style.height = (window.innerHeight - 200)+"px";}
	
}

function locateBox(elem,mTop,mLeft)
{
	document.getElementById(elem).style.top = mTop + "px";
	document.getElementById(elem).style.left = mLeft + "px";
}

function resizeBox(elem,mTop,mLeft,mBottom,mRight)
{
	locateBox(elem,mTop,mLeft);
	document.getElementById(elem).style.height = (window.innerHeight - mBottom)+"px";
	document.getElementById(elem).style.width = (window.innerWidth - mRight)+"px";
}

//******************** Digital clock *******************************************

function startTime() {
  const today = new Date();
  let y = today.getFullYear();
  let M = today.getUTCMonth() + 1;
  let d = today.getDate();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  M = checkTime(M);
  d = checkTime(d);
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML =  y + "/" + M + "/" + d + " " + h + ":" + m + ":" + s;
  setTimeout(startTime, 1000);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}



//***************************** Text Effects ***********************************


function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//***************************** Typewriter ***********************************

let timerTyping;
let isTag;
function typeText(wich, text, direction, action, speed)
{
	i = 0;
	sliced = document.getElementById(wich).innerHTML;
	clearInterval(timerTyping);
	timerTyping = null;
	timerTyping = setInterval(function () {
		if ((i > text.length)){console.log("ended");clearInterval(timerTyping);timerTyping = null;return;}
        if ((action == "er") && (i < text.length)){
			sliced = document.getElementById(wich).innerHTML;
			document.getElementById(wich).innerHTML = sliced.slice(0,-1);  
        }
		else if ((action == "wr") && (i < text.length))
		{
			if (text.charAt(i) === '<') isTag = true;
			if (text.charAt(i) === '>') isTag = false;		
			sliced += text.charAt(i);
			if (isTag){i++;return;}
			document.getElementById(wich).innerHTML = sliced;
		}
		i++;
    },speed);
}