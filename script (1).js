/********************************
ELEMENT REFERENCES
********************************/

const chatWindow = document.getElementById("chatWindow");
const botTrigger = document.getElementById("botTrigger");

const chatBox = document.getElementById("chatBox");

const input = document.getElementById("userInput");

const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");


/********************************
OPEN CHAT (HIDE GIF + OPEN WINDOW)
********************************/

function toggleChat(){

const isActive = chatWindow.classList.contains("active");

if(isActive){

/* CLOSE CHAT */
chatWindow.classList.remove("active");

/* SHOW GIF AGAIN */
botTrigger.style.display = "flex";

}else{

/* OPEN CHAT */
chatWindow.classList.add("active");

/* HIDE GIF */
botTrigger.style.display = "none";

/* focus input */
setTimeout(()=>{
input.focus();
},300);

}

}


/********************************
ENTER KEY SUPPORT (FIXED)
********************************/

input.addEventListener("keydown", function(e){

if(e.key === "Enter"){

e.preventDefault();
sendMessage();

}

});


/********************************
SEND BUTTON
********************************/

sendBtn.onclick = sendMessage;


/********************************
SEND MESSAGE FUNCTION
********************************/

function sendMessage(){

let msg = input.value.trim();

if(msg === "") return;


/* add user message */
addMessage(msg,"user");

/* clear input */
input.value = "";


/* call rasa */
fetch(
"http://localhost:5005/webhooks/rest/webhook",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

sender:"user",
message:msg

})

}

)

.then(res => res.json())

.then(data => {

if(!data || data.length === 0){

addMessage("No response from assistant","bot");
return;

}

data.forEach(d => {

if(d.text){
addMessage(d.text,"bot");
}

});

})

.catch(() => {

addMessage("Server not responding","bot");

});

}


/********************************
ADD MESSAGE FUNCTION
********************************/

function addMessage(text,type){

let div = document.createElement("div");

div.className = type;

div.innerText = text;

chatBox.appendChild(div);


/* auto scroll */
chatBox.scrollTo({
top: chatBox.scrollHeight,
behavior: "smooth"
});

}


/********************************
MIC SUPPORT
********************************/

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(SpeechRecognition){

const recognition = new SpeechRecognition();

recognition.lang = "en-US";


micBtn.onclick = () => {

recognition.start();

};


recognition.onresult = (e) => {

input.value =
e.results[0][0].transcript;

sendMessage();

};

}

/* =========================
TYPING PROJECT INTRO
========================= */

const introLines = [

"Welcome to MR AI Assistant for Guided Simulation.",

"This AI assists pharmacy students in visualizing and understanding human anatomy.",

"Learn procedures through intelligent guided assistance.",

"Ask your doubts using voice or chat anytime."

];

let lineIndex = 0;
let charIndex = 0;

function typeIntro(){

if(lineIndex < introLines.length){

if(charIndex < introLines[lineIndex].length){

document.getElementById("typingText").innerHTML +=
introLines[lineIndex].charAt(charIndex);

charIndex++;

setTimeout(typeIntro,40);

}
else{

document.getElementById("typingText").innerHTML += "<br><br>";

lineIndex++;
charIndex=0;

setTimeout(typeIntro,500);

}

}

}

window.onload = typeIntro;
