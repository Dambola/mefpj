class quadd {
  constructor(p1, p2, p3, p4, c) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.color = c;
  }

  render() {
    fill(this.color);
    quad(this.p1.x, this.p1.y,
      this.p2.x, this.p2.y,
      this.p3.x, this.p3.y,
      this.p4.x, this.p4.y);
  }

  vertices() {
    return [this.p1, this.p2, this.p3, this.p4];
  }

  axes() {
    return [
      this.p2.sub(this.p1).rot90(),
      this.p3.sub(this.p2).rot90(),
      this.p4.sub(this.p3).rot90(),
      this.p1.sub(this.p4).rot90()
    ]
  }
}