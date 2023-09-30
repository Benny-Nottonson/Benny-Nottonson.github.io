export default (function () {
  function e(a, b) {
    var c = this;
    this.acceleration = 0.05;
    this.scale = this.opacity = 0;
    this.h = !0;
    this.position = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };
    this.m = function () {
      function f(d) {
        c.h = "mouseleave" === d.type;
        c.target = c.h ? c.j() : c.target;
      }
      c.g.addEventListener("mouseenter", f);
      c.g.addEventListener("mouseleave", f);
      c.g.addEventListener("mousemove", function (d) {
        c.target = { x: d.clientX - c.offset.x, y: d.clientY - c.offset.y };
        c.v();
      });
    };
    this.o = a;
    this.g = b;
    this.position = this.target = this.j();
    this.offset = this.l();
    this.m();
    this.animate();
  }
  e.prototype.l = function () {
    var a = this.g.getBoundingClientRect();
    return { x: a.left, y: a.top };
  };
  e.prototype.update = function () {
    this.o.style.background = "radial-gradient(circle at "
      .concat(this.position.x, "px ")
      .concat(this.position.y, "px, rgba(255, 255, 255, ")
      .concat(this.opacity, ") 0, rgba(0, 0, 0, ")
      .concat(this.opacity, ") ")
      .concat(8 * this.scale, "rem");
  };
  e.prototype.j = function () {
    var a = this.g;
    return { x: a.clientWidth / 2, y: a.clientHeight / 2 };
  };
  e.prototype.i = function (a, b, c, f) {
    var d = this[a];
    if (((b = "in" === b) && d < c) || (!b && 0 < d && this.u()))
      this[a] += (b ? 1 : -1) * f;
  };
  e.prototype.u = function () {
    var a = Math.abs(this.position.y - this.target.y),
      b = 0.025 * this.g.clientHeight;
    return (
      Math.abs(this.position.x - this.target.x) < 0.025 * this.g.clientWidth &&
      a < b
    );
  };
  e.prototype.v = function () {
    this.offset = this.l();
  };
  e.prototype.s = function (a) {
    var b = this.position,
      c = (a.y - b.y) * this.acceleration;
    this.position.x += (a.x - b.x) * this.acceleration;
    this.position.y += c;
  };
  e.prototype.animate = function () {
    function a() {
      var d = performance.now();
      d - f >= c &&
        ((f = d),
        (d = b.h ? "out" : "in"),
        b.s(b.target),
        b.i("opacity", d, 0.1, 0.005),
        b.i("scale", d, 1, 0.05),
        b.update());
      requestAnimationFrame(a);
    }
    var b = this,
      c = 1e3 / 90,
      f = performance.now();
    a();
  };
  return e;
})();
