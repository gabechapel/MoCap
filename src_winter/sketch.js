// Holds our socket server connection
let socket;
let xPos;
let yPos;
let zPos;
var img;
let position = [[107,1040,406],
                [289,1040,406],
                [559,1040,406],
                [802,1040,406],
                [1010,1040,406]];

let platform = [
                [-2521,857,239],
                [-2307,1357,344],
                [-2258,2045,401],
                [-2531,2708,288], 
                [-2110,3253,401]];
let count = 0;
var cracks = new Array();
var k = 0;
let showBackground = true;
let shift = 400;
let thresh = 30;
var alpha = 0;
position = position.map(v => [v[0] + shift, v[1], v[2]]);

function preload(){
   backgroundImage = loadImage('images/background.jpg');
   for (let i=1; i<6; i++){
    for (let j=1; j<4; j++){
      cracks[k] = loadImage('images/crack'+i+'_'+j+'.png');
      k ++;
    }
   }
   crackSounds = [loadSound('sounds/iceCrack1.wav'),loadSound('sounds/iceCrack2.wav'),loadSound('sounds/iceCrack3.wav')];
}

function setup() {
  // DONT CHANGE THIS, connection to mocap server
  socket = io('192.168.0.100:8000');
  // Setup a listener for the frame event containing rigid body data
  socket.on(
    'frame',
    function(data) {
      // PLACE YOUR CODE FOR HANDLING DATA HERE

      // Data here is an array of the rigid body objects from QTM
      // [{ x: int, y: int, z: int } ...]
      // x is the short side - max 3600 - min -2000
      // y is the long side - max 3500 - min -3500
      // If the body loses tracking, all three values will be null

      // Ex of drawing a circle with x and y coords from a rigid body
      if (data[0].y !== null) {
        // console.log("Y "+data[0].y);
        // console.log("X "+data[0].x);
        // Map between two ranges
        // xPos = (1-(data[0].x + 3500) / 7000) * 1081;
        // yPos = (1 - (data[0].y + 2000) / 5600) * 1223;
        xPos = data[0].x;
        yPos = data[0].y;
        zPos = data[0].z;
      }
    }
  );

  // Put your setup code here
  // you can delete this if you want
  createCanvas(1081+shift, 1223);
  background(0);
  // image(backgroundImage,50,0, 1081, 1223);
  // background(255);
}

function draw() {
  // // Any draw loop code goes here
  // fill(0,0,255);
  // image(img,0,0);
  // ellipse(mouseX,mouseY,20,20);
  // console.log(xPos,yPos,zPos);
  if(showBackground){
    if(alpha<255){
      alpha++;
      tint(255, alpha);
    }
    image(backgroundImage,shift,0, 1081, 1223);
    count = 0;
  }
  fill(0,0,255);
  // ellipse(position[0][0],position[0][1],10,10);
  // ellipse(position[1][0],position[1][1],10,10);  
  // ellipse(position[2][0],position[2][1],10,10);  
  // ellipse(position[3][0],position[3][1],10,10);  
  // ellipse(position[4][0],position[4][1],10,10);

  console.log(xPos,yPos,zPos);

  for(let num=0; num<5; num++){
    if(abs(zPos - platform[num][2])<= thresh){
      if(abs(yPos- platform[num][1]) <= thresh){
        if (abs(xPos - platform[num][0]) <= thresh){
          updatePicture(num*3);
          alpha = 0;
          showBackground = false;
          break;
        }else{
          showBackground = true;
        }
      }else{
        showBackground = true;
      }
    }else{
      showBackground = true;
    }
  }
}

function updatePicture(index){
  count += 1;
  if (count == 1){
    let rand = int(random(0,3));
    crackSounds[rand].play();
  }
  if(count >= 50){
    index++;
  }
  if(count >= 120){
    index++;
  }
  noTint();
  image(cracks[index],shift,0,1081, 1223);
}
