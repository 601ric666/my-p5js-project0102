let n = 3;
let move; // Move 類別的實例

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // 使用 WEBGL 渲染
  fill(0);
  strokeWeight(5);

  // 初始化 Move 類別的實例 (例如，順時針旋轉 X 軸)
  move = new Move(1, 0, 0, 1); // 初始化時將 X 軸設為旋轉軸
}

function draw() {
  background(0);
  translate(0, 0); // 移動至畫布中心
  rotateX(frameCount * 0.01); // X 軸旋轉
  rotateY(frameCount * 0.01); // Y 軸旋轉
  rotateY(acos(1 / sqrt(3))); // 沿 Y 軸旋轉固定角度
  rotateZ(acos(1 / sqrt(3))); // 沿 Z 軸旋轉固定角度

  // 計算顏色，隨時間變化
  let r = map(sin(frameCount * 0.01), -1, 1, 0, 255); // 根據正弦波變化紅色
  let g = map(cos(frameCount * 0.01), -1, 1, 0, 255); // 根據餘弦波變化綠色
  let b = map(sin(frameCount * 0.01 + PI / 2), -1, 1, 0, 255); // 根據正弦波變化藍色，偏移角度
  stroke(r, g, b); // 設定畫筆顏色

  // 更新 Move 類別的旋轉
  move.update();

  for (let x = -n; x <= n; x++) { // 從 -n 到 n
    for (let y = -n; y <= n; y++) { // 從 -n 到 n
      for (let z = -n; z <= n; z++) { // 從 -n 到 n
        push();
        translate(80 * x, 80 * y, 80 * z); // 根據 (x, y, z) 進行平移

        // 如果正在進行動畫，應用旋轉
        move.applyRotation();

        // 計算距離，並根據距離大小繪製盒子
        box(100 * sin(sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2))));
        pop();
      }
    }
  }
}

// 按下鍵盤按鈕時觸發旋轉
function keyPressed() {
  if (key === 'r') {  // 按下 'r' 開始旋轉
    move.start();  // 重啟旋轉並開始動畫
  }
}
