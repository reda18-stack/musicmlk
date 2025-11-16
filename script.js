const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// DOM references
const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const p3 = document.getElementById("p3");
const p4 = document.getElementById("p4");
const wishes = document.getElementById("wishes");
const inputSpeed = document.getElementById("inputSpeed");
const birthdayImages = document.getElementById("birthdayImages");

const notes = [
  {f:262,d:.5,t:"saan",p:p1},
  {f:262,d:.5,t:"na&nbsp",p:p1},
  {f:294,d:1,t:"7ilwa&nbsp",p:p1},
  {f:262,d:1,t:"ya&nbsp",p:p1},
  {f:349,d:1,t:"ma",p:p1},
  {f:330,d:2,t:"lak",p:p1},
  
  {f:262,d:.5,t:"joy",p:p2},
  {f:262,d:.5,t:"eux&nbsp",p:p2},
  {f:294,d:1,t:"anni",p:p2},
  {f:262,d:1,t:"versaire&nbsp",p:p2},
  {f:392,d:1,t:"ma",p:p2},
  {f:349,d:2,t:"lak",p:p2},
  
  {f:262,d:.5,t:"Hap",p:p3},
  {f:262,d:.5,t:"py&nbsp;",p:p3},
  {f:523,d:1,t:"Birth",p:p3},
  {f:440,d:1,t:"day&nbsp;",p:p3},
  {f:349,d:1,t:"malak&nbsp;",p:p3},
  {f:330,d:1,t:"lwa3",p:p3},
  {f:294,d:3,t:"ra",p:p3},
  
  {f:466,d:.5,t:"Hap",p:p4},
  {f:466,d:.5,t:"py&nbsp;",p:p4},
  {f:440,d:1,t:"Birth",p:p4},
  {f:349,d:1,t:"day&nbsp;",p:p4},
  {f:392,d:1,t:"To&nbsp;",p:p4},
  {f:349,d:2,t:"You",p:p4},
];

// create spans for lyrics
notes.map(n => createSpan(n));
function createSpan(n){
  n.sp = document.createElement("span");
  n.sp.innerHTML = n.t;
  n.p.appendChild(n.sp);
}

// SOUND setup
let speed = inputSpeed.value;
let flag = false;
let sounds = [];

class Sound{
  constructor(freq,dur,i){
    this.stop = true;
    this.frequency = freq;
    this.waveform = "triangle";
    this.dur = dur;
    this.speed = this.dur*speed;
    this.initialGain = .15;
    this.index = i;
    this.sp = notes[i].sp;
  }
  
  cease(){
    this.stop = true;
    this.sp.classList.remove("jump");
    if(this.index < sounds.length-1){sounds[this.index+1].play();}
    if(this.index == sounds.length-1){flag = false;}
    if(this.index == sounds.length-1){showBirthdayImages();}
  }
  
  play(){
   this.oscillator = audioCtx.createOscillator();
   this.gain = audioCtx.createGain();
   this.gain.gain.value = this.initialGain;
   this.oscillator.type = this.waveform;
   this.oscillator.frequency.value = this.frequency;
   this.gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + this.speed);
   this.oscillator.connect(this.gain);
   this.gain.connect(audioCtx.destination);
   this.oscillator.start(audioCtx.currentTime);
   this.sp.setAttribute("class", "jump");
   this.stop = false;
   this.oscillator.stop(audioCtx.currentTime + this.speed); 
   this.oscillator.onended = ()=> {this.cease();}
  }  
}

for(let i=0; i < notes.length; i++){
  sounds.push(new Sound(notes[i].f, notes[i].d,i));
}

// EVENTS
wishes.addEventListener("click", function(e){
  if(e.target.id != "inputSpeed" && !flag){
    sounds[0].play();
    flag = true;
  }
}, false);

inputSpeed.addEventListener("input", function(){
  speed = this.value;
  sounds.map(s => s.speed = s.dur*speed);
}, false);

// SHOW birthday images
function showBirthdayImages() {
  birthdayImages.innerHTML = "";
  const imageFiles = ["images/dd.jpeg","images/malak4.jpeg","images/tt.jpeg"];
  
  imageFiles.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Birthday Image";
    birthdayImages.appendChild(img);
    
    // add fade-in with slight delay for each image
    setTimeout(() => {
      img.classList.add("show");
    }, index * 500); // 0.3s delay between images
  });
}


// CANVAS animation (floating polygons)
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let cw = canvas.width = window.innerWidth,
    ch = canvas.height = window.innerHeight;

class Particle{
  constructor(){
    this.x = Math.random() * cw;
    this.y = Math.random() * ch;
    this.r = 15 + ~~(Math.random() * 20);
    this.l = 3 + ~~(Math.random() * 2);
    this.a = 2*Math.PI/this.l;
    this.rot = Math.random()*Math.PI;
    this.speed = .05 + Math.random()/2;
    this.rotSpeed = 0.005 + Math.random()*.005;
    this.color = ["#93DFB8","#FFC8BA","#E3AAD6","#B5D8EB","#FFBDD8"][~~(Math.random()*5)];
  }
  update(){ this.y -= this.speed; if(this.y<-this.r){this.y=ch+this.r; this.x=Math.random()*cw;} }
  draw(){ 
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rot);
    ctx.beginPath();
    for(let i=0;i<this.l;i++){
      ctx.lineTo(this.r*Math.cos(this.a*i),this.r*Math.sin(this.a*i));
    }
    ctx.closePath();
    ctx.lineWidth=4;
    ctx.strokeStyle=this.color;
    ctx.stroke();
    ctx.restore();
  }
}

let particles = [];
for(let i=0;i<20;i++){particles.push(new Particle());}

function Draw(){
  requestAnimationFrame(Draw);
  ctx.clearRect(0,0,cw,ch);
  particles.map(p=>{p.rot+=p.rotSpeed; p.update(); p.draw();});
}

function Init(){
  cw=canvas.width=window.innerWidth;
  ch=canvas.height=window.innerHeight;
  Draw();
}

setTimeout(()=>{Init(); window.addEventListener('resize', Init, false);},15);
