var command, ux, uy, uox, uoy, uo, uoa, vx, vy, vo, voa, octal;

function dott(ax, ay, bx, by) {
  return ax * bx + ay * by;
}

function crosss(ax, ay, bx, by) {
  return ax * by - ay * bx;
}

function getAngleDot(ux, uy, vx, vy) {
  let nu = sqrt(ux*ux+uy*uy);
  let nv = sqrt(vx*vx+vy*vy);
  return 180 * acos(dott(ux, uy, vx, vy)/(nu * nv)) / PI;
}

function getAngleCross(ux, uy, vx, vy) {
  let nu = sqrt(ux*ux+uy*uy);
  let nv = sqrt(vx*vx+vy*vy);
  return 180 * asin(abs(crosss(ux, uy, vx, vy))/(nu * nv)) / PI;
}

function squarePseudoangulo(x, y) {
  if (x >= 0 && y >= 0 && x >= y) {
    return [1, (y/x), 1, 0+(y/x)];
  } else if (x >= 0 && y >= 0 && y > x ) {
    return [(x/y), 1, 2, 1+(1 - x/y)];
  } else if (x <= 0 && y >= 0 && y >= -x) {
    return [(x/y), 1, 3, 1+(1 - x/y)];
  } else if (x <= 0 && y >= 0 && y < -x) {
    return [-1, -(y/x), 4, 3+((y/x)+1)];
  } else if (x <= 0 && y <= 0 && x <= y) {
    return [-1, -(y/x), 5, 4+(y/x)];
  } else if (x <= 0 && y <= 0 && x > y) {
    return [-(x/y), -1, 6, 5+(1-(x/y))];
  } else if (x >= 0 && y <= 0 && x <= -y) {
    return [-(x/y), -1, 7, 5+(1-(x/y))];
  } else if (x >= 0 && y <= 0 && x > -y) {
    return [1, (y/x), 8, 7+(1+(y/x))];
  }
  return [-1, -1, -1, -1];
}

function drawInfo() {
  let dy = 15;
  strokeWeight(1);
  stroke(0, 0, 0);
  push();
    scale(1,-1,1);
    if (ux!=null&&uy!=null&&vx!=null&&vy!=null){
      text('Angulo pelo Dot:   ' + getAngleDot(ux, uy, vx, vy), -190, -180);
      text(`Angulo pelo Cross: ` + getAngleCross(ux, uy, vx, vy), -190, -180+dy);
    }
    text(`U (${uox.toFixed(3)}), ${uoy.toFixed(3)}): pseudo=${uoa.toFixed(3)}, octal=${uo.toFixed(0)}`, -190, -180+2*dy);
    text(`V (${vox.toFixed(3)}), ${voy.toFixed(3)}): pseudo=${voa.toFixed(3)}, octal=${vo.toFixed(0)}`, -190, -180+3*dy);
  pop();
}

function mouseClicked() {
  if (command) {
    let size = 175;
    if (command == 'u') {
      ux = (mouseX - width/2);
      uy = (height/2 - mouseY);

      let nxy1 = sqrt(ux * ux + uy * uy);
      
      ux = Math.round(size * ux / nxy1);
      uy = Math.round(size * uy / nxy1);
    } else if (command == 'v') {
      vx = (mouseX - width/2);
      vy = (height/2 - mouseY);

      let nxy1 = sqrt(vx * vx + vy * vy);
      
      vx = Math.round(size * vx / nxy1);
      vy = Math.round(size * vy / nxy1);
    }
  }
}

function drawOctal(octal, x, y, color) {
  push();
  strokeWeight(2);
  stroke(color);
  if (octal > 1) { line(100, 0, 100, 100); }
  if (octal > 2) { line(100, 100, 0, 100); }
  if (octal > 3) { line(0, 100, -100, 100); }
  if (octal > 4) { line(-100, 100, -100, 0); }
  if (octal > 5) { line(-100, 0, -100, -100); }
  if (octal > 6) { line(-100, -100, 0, -100); }
  if (octal > 7) { line(0, -100, 100, -100); }

  if (octal == 1) { line(100, 0, 100, 100*y); }
  if (octal == 2) { line(100, 100, 100*x, 100); }
  if (octal == 3) { line(0, 100, 100*x, 100); }
  if (octal == 4) { line(-100, 100, -100, 100*y); }
  if (octal == 5) { line(-100, 0, -100, 100*y); }
  if (octal == 6) { line(-100, -100, 100*x, -100); }
  if (octal == 7) { line(0, -100, 100*x, -100); }
  if (octal == 8) { line(100, -100, 100, 100*y); }
  
  pop();
}

function clearUV() {
  command=null;
  ux=null; uy=null; uox=null; uoy=null; ua=null; uo=null;
  vx=null; vy=null; vox=null, voy=null, va=null; vo=null;
  octal=null;
}

// Main Functions for P5.JS

function setup() {
  createCanvas(400, 400);
  clearUV();
}

function draw() {
  background(220);

  push();
    translate(width/2, height/2);
    scale(1, -1, 1);

    line(-width/2, 0, width/2, 0);
    line(0, -height/2, 0, height/2);

    push();
      noFill();
      translate(-100, -100);
      square(0, 0, 200);
    pop();

    if (ux != null && uy != null) {
      line(0, 0, ux, uy);
    }
    
    if (vx != null && vy != null) {
      line(0, 0, vx, vy);
    }

    let a = squarePseudoangulo(ux, uy);
    uox=a[0]; uoy=a[1]; uo=a[2]; uoa=a[3];
    drawOctal(uo, uox, uoy, color(255, 0, 0));

    let b = squarePseudoangulo(vx, vy);
    vox=b[0]; voy=b[1]; vo=b[2]; voa=b[3];
    drawOctal(vo, vox, voy, color(0, 0, 255));

    drawInfo();
  pop();
}

