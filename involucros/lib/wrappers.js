// Wrappers

class Wrapper {
  constructor(c1 = 0, c2 = 0, c3 = 0) { }
  fit(verts) { }
  render() { }
  colide(obj) { return false; }
  inside(p) { return false; }
}

class AABB {
  constructor(c1 = 0, c2 = 0, c3 = 0) {
    this._min = new vec2();
    this._max = new vec2();
    this._c1 = c1;
    this._c2 = c2;
    this._c3 = c3;
  }

  fit(verts) {
    if (verts.length > 0) {
      this._min = verts[0];
      this._max = verts[0];

      for (let i = 1; i < verts.length; i++) {
        let vert = verts[i];

        this._min = new vec2(
          Math.min(this._min.x, vert.x),
          Math.min(this._min.y, vert.y),
          Math.min(this._min.w, vert.w),
        );

        this._max = new vec2(
          Math.max(this._max.x, vert.x),
          Math.max(this._max.y, vert.y),
          Math.max(this._max.w, vert.w),
        );
      }
    }
  }

  render() {
    let x1 = Math.round(this._min.x),
      y1 = Math.round(this._min.y),
      x2 = Math.round(this._max.x),
      y2 = Math.round(this._max.y);

    strokeWeight(3);
    stroke(this._c1, this._c2, this._c3);
    line(x1, y1, x1, y2);
    line(x1, y2, x2, y2);
    line(x2, y2, x2, y1);
    line(x2, y1, x1, y1);
  }

  inside(p) {
    return (this._min.x <= p.x && p.x <= this._max.x) &&
      (this._min.y <= p.y && p.y <= this._max.y);
  }

  toQuad() {
    let x1 = Math.round(this._min.x),
      y1 = Math.round(this._min.y),
      x2 = Math.round(this._max.x),
      y2 = Math.round(this._max.y);

    return new quadd(
      new vec2(x1, y1, 1),
      new vec2(x1, y2, 1),
      new vec2(x2, y2, 1),
      new vec2(x2, y1, 1),
      color(0, 0, 0)
    );
  }

  colide(obj) {
    if (obj instanceof AABB || obj instanceof OBB) {
      return sat(this.toQuad(), obj.toQuad());
    } else if (obj instanceof Circle) {
      return obj.colide(this);
    }
    return false;
  }
}

class OBB {
  constructor(c1 = 0, c2 = 0, c3 = 0) {
    this._q11 = new vec2();
    this._q12 = new vec2();
    this._q22 = new vec2();
    this._q21 = new vec2();
    this._min = new vec2();
    this._max = new vec2();
    this._c = new vec2();
    this._k = 0;
    this._c1 = c1;
    this._c2 = c2;
    this._c3 = c3;
  }

  fit(verts) {
    if (verts.length > 0) {
      let area, cx = 0, cy = 0;

      for (let i = 0; i < verts.length; i++) {
        cx += verts[i].x;
        cy += verts[i].y;
      }

      cx = Math.round(cx / verts.length);
      cy = Math.round(cy / verts.length);
      this._c = new vec2(cx, cy, 1);

      for (var k = 0; k < 180; k++) {
        // console.log(k);
        let M1 = new mat3(),
          M2 = new mat3();
        M1.rotate(k);
        M2.translate(-cx, -cy);

        let vert = M1.transform(M2.transform(verts[0])),
          min = vert,
          max = vert;

        // console.log(vert);

        for (let i = 1; i < verts.length; i++) {
          vert = M1.transform(M2.transform(verts[i]));
          // console.log(vert);

          min = new vec2(
            Math.min(min.x, vert.x),
            Math.min(min.y, vert.y),
            Math.min(min.w, vert.w),
          );

          max = new vec2(
            Math.max(max.x, vert.x),
            Math.max(max.y, vert.y),
            Math.max(max.w, vert.w),
          );
        }

        let new_area = (max.y - min.y) * (max.x - min.x);

        if (area == null || new_area < area) {
          console.log(min, max);
          area = new_area;
          let M3 = new mat3(),
            M4 = new mat3();
          M4.rotate(-k);
          M3.translate(cx, cy);

          this._min = min;
          this._max = max;

          this._k = k;
          this._q11 = M3.transform(M4.transform(new vec2(min.x, min.y, 1)));
          this._q12 = M3.transform(M4.transform(new vec2(min.x, max.y, 1)));
          this._q22 = M3.transform(M4.transform(new vec2(max.x, max.y, 1)));
          this._q21 = M3.transform(M4.transform(new vec2(max.x, min.y, 1)));
        }
      }
    }
  }

  render() {
    strokeWeight(3);
    stroke(this._c1, this._c2, this._c3);
    line(Math.round(this._q11.x), Math.round(this._q11.y), Math.round(this._q12.x), Math.round(this._q12.y));
    line(Math.round(this._q12.x), Math.round(this._q12.y), Math.round(this._q22.x), Math.round(this._q22.y));
    line(Math.round(this._q22.x), Math.round(this._q22.y), Math.round(this._q21.x), Math.round(this._q21.y));
    line(Math.round(this._q21.x), Math.round(this._q21.y), Math.round(this._q11.x), Math.round(this._q11.y));
  }

  inside(p) {
    let M1 = new mat3(),
      M2 = new mat3();
    M1.rotate(this._k);
    M2.translate(-this._c.x, -this._c.y);
    let _p = M1.transform(M2.transform(p));
    return (this._min.x <= _p.x && _p.x <= this._max.x) &&
      (this._min.y <= _p.y && _p.y <= this._max.y);
  }

  toQuad() {
    return new quadd(
      new vec2(Math.round(this._q11.x), Math.round(this._q11.y), 1),
      new vec2(Math.round(this._q12.x), Math.round(this._q12.y), 1),
      new vec2(Math.round(this._q22.x), Math.round(this._q22.y), 1),
      new vec2(Math.round(this._q21.x), Math.round(this._q21.y), 1),
      color(0, 0, 0)
    );
  }

  colide(obj) {
    if (obj instanceof AABB || obj instanceof OBB) {
      return sat(this.toQuad(), obj.toQuad());
    } else if (obj instanceof Circle) {
      return obj.colide(this);
    }
    return false;
  }
}

class Circle {
  constructor(c1 = 0, c2 = 0, c3 = 0) {
    this._c = new vec2();
    this._r = 0;
    this._c1 = c1;
    this._c2 = c2;
    this._c3 = c3;
  }

  fit(verts) {
    let cx = 0, cy = 0;

    for (let i = 0; i < verts.length; i++) {
      cx += verts[i].x;
      cy += verts[i].y;
    }

    cx = Math.round(cx / verts.length);
    cy = Math.round(cy / verts.length);
    this._c = new vec2(cx, cy, 1);

    for (let i = 0; i < verts.length; i++) {
      let r = sqrt((verts[i].x - cx) * (verts[i].x - cx) +
        (verts[i].y - cy) * (verts[i].y - cy));
      console.log(r, this._r);

      this._r = Math.round(Math.max(this._r, r));
    }
  }

  render() {
    strokeWeight(3);
    stroke(this._c1, this._c2, this._c3);
    noFill();
    circle(this._c.x, this._c.y, 2 * this._r);
  }

  inside(p) {
    let dx = this._c.x - p.x,
      dy = this._c.y - p.y,
      norm = sqrt(dx * dx + dy * dy);
    return norm <= this._r;
  }

  dotInLine(d, p1, p2) {
    return Math.min(p1.y, p2.y) <= d.y && d.y <= Math.max(p1.y, p2.y) &&
      Math.min(p1.x, p2.x) <= d.x && d.x <= Math.max(p1.x, p2.x); 
  }

  lineColide(p1, p2) {
    let a = p1.y - p2.y;
    let b = p2.y - p1.x;
    let c = p1.x * p2.y - p1.y * p2.x;
    
    let delta = (b * b) - (4 * a * c);
    
    if (delta < 0) return false;
    else if (delta == 0) {
      let y = -b/(2*a);
      let x = ((-b) * y - c)/a;
      let d = new vec2(x, y, 1);

      return this.dotInLine(d, p1, p2);
    } else {
      let y1 = (-b + sqrt(delta))/(2*a);
      let x1 = ((-b) * y1 - c)/a;
      let d1 = new vec2(x1, y1, 1);
      
      let y2 = (-b - sqrt(delta))/(2*a);
      let x2 = ((-b) * y2 - c)/a;
      let d2 = new vec2(x2, y2, 1);

      console.log('d1 = ' + d1, 'd2 = ' + d2, 'p1 = ' + p1, 'p2 = ' + p2);

      return this.dotInLine(d1, p1, p2) || this.dotInLine(d2, p1, p2);
    }
  }

  colide(obj) {
    if (obj instanceof AABB || obj instanceof OBB) {
      return false; 
    } else if (obj instanceof Circle) {
      let dist = this._c.sub(obj._c);
      return this._r + obj._r >= dist.length();
    }
    return false;
  }
}