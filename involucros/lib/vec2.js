class vec2 {

  constructor(x = 0, y = 0, w = 1) {
    this.x = x
    this.y = y
    this.w = w
  }

  rot90() {
    return new vec2(-this.y, this.x)
  }

  length() {
    return sqrt(this.dot(this))
  }

  mul(s) {
    return new vec2(this.x * s, this.y * s)
  }

  unit() {
    let invLen = 1.0 / this.length()
    return this.mul(invLen)
  }

  // retorna this - v
  sub(v) {
    return new vec2(this.x - v.x, this.y - v.y)
  }
  dot(v) {
    return this.x * v.x + this.y * v.y
  }

  cross(v) {
    return this.x * v.y - this.y * v.x
  }

  render() {
    fill(0, 0, 196)
    if (this.w != 0)
      circle(this.x, this.y, 5);
    else {
      strokeWeight(3)
      line(0, 0, this.x, this.y);
      strokeWeight(1)
    }
  }

  projectionCollides(p1, p2) {
    let [min1, max1] = this.projectionRange(p1);
    let [min2, max2] = this.projectionRange(p2);
    if (max1 < min2 || max2 < min1) {
      return false;
    }
    return true;
  }

  projectionRange(pts) {
    let mini = +Infinity;
    let maxi = -Infinity;

    for (let i = 0; i < pts.length; i++) {
      let pj = this.dot(pts[i]);
      mini = min(mini, pj);
      maxi = max(maxi, pj)
    }

    return [mini,maxi];
  }

  toString() {
    return `<${this.x}, ${this.y}, ${this.w}>`;   
  }
}