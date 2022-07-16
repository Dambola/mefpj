class trii {
  constructor(p1, p2, p3, c) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.color = c;
  }

  render() {
    push();
    fill(this.color);
    triangle(this.p1.x, this.p1.y,
      this.p2.x, this.p2.y,
      this.p3.x, this.p3.y);
    pop();
  }

  vertices() {
    return [this.p1, this.p2, this.p3];
  }

  axes() {
    return [
      this.p2.sub(this.p1).rot90(),
      this.p3.sub(this.p2).rot90(),
      this.p1.sub(this.p3).rot90()
    ]
  }
}