class mat3 {
  constructor() {
    this.identity()
  }

  identity() {
    //         c1      c2      c3
    this.a = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }

  translate(x, y) {
    this.a = [1, 0, 0, 0, 1, 0, x, y, 1]
  }

  rotate(deg) {
    let co = cos(deg * PI / 180)
    let si = sin(deg * PI / 180)
    //           c1           c2     c3
    this.a = [co, si, 0, -si, co, 0, 0, 0, 1]
  }

  localX(s = 1) {
    // x, y, w=0   é vetor direcao
    return new vec2(this.a[0] * s, this.a[1] * s, 0)
  }

  localY(s = 1) {
    // x, y, w=0   é vetor direcao
    return new vec2(this.a[3] * s, this.a[4] * s, 0)
  }

  transform(v) {
    let x = this.a[0] * v.x +
      this.a[3] * v.y +
      this.a[6] * v.w;

    let y = this.a[1] * v.x +
      this.a[4] * v.y +
      this.a[7] * v.w;

    let w = this.a[2] * v.x +
      this.a[5] * v.y +
      this.a[8] * v.w;

    var test = (this.a[2] * v.x + this.a[5] * v.y + this.a[8] * v.w);

    if (w != 0)
      return new vec2(x / w, y / w, 1)
    else
      return new vec2(x, y, 0)
  }
}