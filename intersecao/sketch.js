class vec3 {
  constructor(x, y, z=1){
    this._x = x;
    this._y = y;
    this._z = z;
  }
   
  toString(depth, opts) {
    return `(${this._x}, ${this._y})`;
  };
  
  subtract(b) {
    return new vec3(this._x - b.x, this._y - b.y, this._z - b.z);
  }
  
  sum(b) {
    return new vec3(this._x + b.x, this._y + b.y, this._z + b.z);
  }
  
  multiply(c) {
    return new vec3(this._x * c, this._y * c, this._z * c);
  }
  
  get x(){return this._x;}
  get y(){return this._y;}
  get z(){return this._z;}
}


var A, B, C, D, hasInter, inter, command;

function drawPoint(a, c1=0, c2=0, c3=0) {
  stroke(c1, c2, c3);
  strokeWeight(6);
  point(a.x, a.y);
}

function drawSegment(a, b, c1=0, c2=0, c3=0) {
  stroke(c1, c2, c3);
  strokeWeight(4);
  line(a.x, a.y, b.x, b.y);    
}

function drawPointAndSegment(a, b, c1, c2, c3) {
  if (a != null) drawPoint(a, c1, c2, c3);    
  if (b != null) drawPoint(b, c1, c2, c3);
  if (a != null && b != null) {
    drawSegment(a, b, c1, c2, c3);  
  } 
}

function drawInfo() {
  let dy = 15;
  strokeWeight(1);
  stroke(0, 0, 0);
  push();
    scale(1,-1,1);
    text('Command selected: ' + command, 5, -380);
    text(`Has intersection: ${hasInter}; T = ${inter}`, 5, -380+dy);
    text(`A: ${A}; B: ${B}; C: ${C}; D: ${D}`, 5, -380+2*dy);
  pop();
}

function setup() {
  inter=null;
  command = null;
  A=null; B=null; C=null; D=null;
  A=new vec3(25,25);B=new vec3(100,100);C=new vec3(50,50);D=new vec3(100,50) // Test 1
  //A=new vec3(25,25);B=new vec3(100,100);C=new vec3(75,75);D=new vec3(35,35) // Test 2
  hasInter = false;
  createCanvas(400, 400);
}

function keyPressed() {
  if (keyCode == 65) { // A
    command = 'KEY_A';
  } else if (keyCode == 66) { // B
    command = 'KEY_B';
  } else if (keyCode == 67) { // C
    command = 'KEY_C';
  } else if (keyCode == 68) { // D
    command = 'KEY_D';
  } else if (keyCode == 8) {
    if (command == 'KEY_A'){A=null;}
    else if (command == 'KEY_B'){B=null;}
    else if (command == 'KEY_C'){C=null;}
    else if (command == 'KEY_D'){D=null;}
    command = null;
  }
}

function mouseClicked() {
  let x = mouseX,
      y = height - mouseY;
  if (command == 'KEY_A') {A = new vec3(x, y)}
  else if(command == 'KEY_B') {B = new vec3(x, y)}
  else if(command == 'KEY_C') {C = new vec3(x, y)}
  else if(command == 'KEY_D') {D = new vec3(x, y)}
  command = null;
}

function dott(a, b) {
  return a.x * b.x + a.y * b.y;
}

function crosss(a, b) {
  return a.x * b.y - a.y * b.x;
}

function calcIntersection() {
  hasInter=false;
  inter=null;
  if (A!=null && B!=null && C!=null && D!=null){
    let vab = A.subtract(B),
        vcd = C.subtract(D),
        vca = C.subtract(A),
        vda = D.subtract(A),
        vac = A.subtract(C),
        vbc = B.subtract(C);
    
    let Ncd1 = crosss(vcd, vac),
        Ncd2 = crosss(vcd, vbc),
        Nab1 = crosss(vab, vca),
        Nab2 = crosss(vab, vda);
    
    let cdSame = (Ncd1 >= 0 && Ncd2 <= 0) || (Ncd1 <= 0 && Ncd2 >= 0),
        abSame = (Nab1 >= 0 && Nab2 <= 0) || (Nab1 <= 0 && Nab2 >= 0);
    
    if (cdSame && abSame) {
      hasInter=true;
      if (Ncd1 != 0 || Ncd2 != 0 || Nab1 != 0 || Nab2 != 0) {
        let vdc = D.subtract(C);
        let n = new vec3(-vdc.y, vdc.x);
        let t = dott(C.subtract(A), n) / dott(B.subtract(A), n);
        inter = A.sum(B.subtract(A).multiply(t));
      }
    }
  }
}

function draw() {
  background(220);
  calcIntersection();
  
  push();
    translate(0, height);
    scale(1,-1,1);
    
    drawPointAndSegment(A, B, 255, 0, 0);
    drawPointAndSegment(C, D, 0, 0, 255);
  
    drawInfo();
  pop();
}

