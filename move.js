// move.js

class Move {
  constructor(x, y, z, dir) {
    this.angle = 0;  // 當前旋轉角度
    this.x = x;      // 旋轉的 X 軸
    this.y = y;      // 旋轉的 Y 軸
    this.z = z;      // 旋轉的 Z 軸
    this.dir = dir;  // 旋轉方向：1 為順時針，-1 為逆時針
    this.animating = false; // 是否正在進行旋轉動畫
  }

  start() {
    this.angle = 0;  // 重置旋轉角度
    this.animating = true;  // 開始旋轉
  }

  update() {
    if (this.animating) {
      this.angle += this.dir * 0.05;  // 每次更新旋轉角度
      if (this.angle >= HALF_PI) {  // 當旋轉達到 90 度時，停止動畫
        this.angle = HALF_PI;
        this.animating = false;
      }
    }
  }

  // 將旋轉應用於盒子
  applyRotation() {
    if (this.animating) {
      rotateX(this.x * this.angle);
      rotateY(this.y * this.angle);
      rotateZ(this.z * this.angle);
    }
  }
}