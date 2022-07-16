var objects = null, cor1 = null, 
  cor2 = null, mouseClickedFunc, mouseClickedFuncArg,
  mouseTracker = false, cnv;

function generatePoints(number) {
  let arr = [];
  for (let i = 0; i < number; i++) {
    let x = random(100, 301),
      y = random(100, 301);
    arr.push(new vec3(x, y, 1));
  }
  return arr;
}

function clickMouseTracker() {
  if (mouseTracker) {
    mouseTracker = false;
    document.getElementById('ident').innerText = 'Ligar Identificador de Objetos';
  } else {
    mouseTracker = true;
    document.getElementById('ident').innerText = 'Desligar Identificador de Objetos';
  }
}

function mouseMoved() {
  if (mouseTracker) {
    let p = new vec2(mouseX - width/2, height/2 - mouseY, 1.0);
    if (objects[0].wrapper && objects[1].wrapper) {
      var inObj1 = objects[0].wrapper.inside(p);
      var inObj2 = objects[1].wrapper.inside(p);
      if (inObj1 && inObj2) {
        messageMouse("Mouse está em cima dos dois objetos.");
      } else if (inObj1) {
        messageMouse("Mouse está em cima do objeto 1");
      } else if (inObj2) {
        messageMouse("Mouse está em cima do objeto 2");
      } else {
        messageMouse("");
      }
    } else if (objects[0].wrapper && objects[0].wrapper.inside(p)) {
      messageMouse("Mouse está em cima do objeto 1");
    } else if (objects[1].wrapper && objects[1].wrapper.inside(p)) {
      messageMouse("Mouse está em cima do objeto 2");
    } else {
      messageMouse("");
    }
  }
}

function mouseClicked() {
  if (mouseClickedFunc!=null && mouseClickedFuncArg!=null) {
    mouseClickedFunc(mouseClickedFuncArg);
  }
}

function addPonto(j) {
  if (0 <= mouseX && mouseX <= width && 
      0 <= mouseY && mouseY <= height){
    objects[j].vertices.push(
      new vec2(mouseX - width/2, height/2 - mouseY, 1.0)
    );
    objects[j].wrapper.fit(objects[j].vertices);
  }
}

function delPonto(j) {
  if (objects[j].vertices.length > 0) {
    objects[j].vertices.pop();
    objects[j].wrapper.fit(objects[j].vertices);
  }
}

function clsPonto(j) {
  objects[j].vertices = [];
  objects[j].wrapper = new Wrapper(0, 0 ,0);
}

function loadWrapper(j, cls) {
  objects[j].wrapper = new cls(0, 0 ,0);
  objects[j].wrapper.fit(objects[j].vertices);
}

// Main Functions for P5.JS

function setup() {
  cnv = createCanvas(400, 400);

  cor1 = [255, 0, 0];
  cor2 = [0, 0, 255];

  objects = [
    {
      'vertices': [],
      'wrapper': new Wrapper(0, 0 ,0)
    },
    {
      'vertices': [],
      'wrapper': new Wrapper(0, 0 ,0)
    },
  ];
}

function draw() {
  drawBackground();

  for (let i = 0; i < objects.length; i++) {
    let object = objects[i];
    for (let j = 0; j < object.vertices.length; j++) {
      object.vertices[j].render();
    }
    object.wrapper.render();
  }

  if (objects[0].wrapper.colide(objects[1].wrapper)) {
    message('Objeto 1 e 2 estão em colisão!');
  } else {
    message('Objeto 2 e 2 NÃO estão em colisão!');
  }
}

function drawBackground() {
  background(220);

  resetMatrix();
  
  translate(width/2,height/2);
  scale(1,-1,1);
    
  stroke(100,0,0);
  line(-width,0, width,0);
  stroke(0,100,0);
  line(0, -height, 0,height);
  
  stroke(0);
}

function message(msg){document.getElementById('info').innerText = msg;}
function messageMouse(msg){document.getElementById('mouse').innerText = msg;}