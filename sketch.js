let menuVisible = false;
let menuOffset = -300;
let menuGraphics; // 2D 選單緩衝區
let rotationX = 0; // 3D 原點繞 X 軸的旋轉角度
let rotationY = 0; // 3D 原點繞 Y 軸的旋轉角度
let isRotating = false; // 控制滑鼠交互旋轉
let autoRotateX = 0; // 自動旋轉的 X 軸角度
let autoRotateY = 0; // 自動旋轉的 Y 軸角度
let n = 4; // 控制立方體網格範圍

// 顏色過渡的變數
let colorTransition = 0;
let size = 100; // 初始方塊大小
let spacing = 80; // 初始方塊間距
let sizeSlider; // 滑竿控制方塊大小和間距

let colorX = 0; // 初始化 colorX，控制顏色的增減循環

// 音樂變數
let music; // 用來儲存音樂
let isMusicPlaying = false; // 控制音樂播放狀態

let isPositionChanged = false; // 新增變數追蹤位置變化



function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // 3D 畫布
  menuGraphics = createGraphics(windowWidth, windowHeight); // 2D 畫布緩衝區

  let menuButton = createButton('');
  menuButton.position(20, 20); // 按鈕位置
  menuButton.mousePressed(toggleMenu); // 點擊事件
  menuButton.style('background', 'url("your-image-url.png") no-repeat center'); // 設置背景圖片
  menuButton.style('background-size', 'contain'); // 確保圖片按比例縮放
  menuButton.style('border', 'none'); // 移除按鈕邊框
  menuButton.style('width', '30px'); // 設定按鈕寬度
  menuButton.style('height', '27px'); // 設定按鈕高度 (可根據需要調整)

  // 創建滑竿來控制方塊大小和間距，初始值設定為最低
  sizeSlider = createSlider(50, 200, 50, 1); // 滑竿範圍：50 到 200，初始值為 50（最低值）
  sizeSlider.position(windowWidth - 180, 10); // 滑竿位置

  // 加載音樂
  music = loadSound('Sunspots - Jeremy Blake.mp3');
}

function draw() {
  background(50);

  // 使 colorX 隨時間循環增減
  colorX = 400 * abs(sin(frameCount * 0.01)); // 讓 colorX 循環在 0 到 800 之間

  // 自動旋轉更新
  autoRotateX += 0;
  autoRotateY += 0.001;

  // 使用自動旋轉角度
  rotationY = autoRotateY;
  rotationX = autoRotateX;

  // 根據滑竿更新方塊大小和間距
  size = sizeSlider.value();
  spacing = sizeSlider.value() * 0.8; // 間距和大小的比例可以根據需要調整

  // 3D 原點旋轉
  push();
  rotateY(rotationY); // 3D 空間原點繞 Y 軸旋轉
  rotateX(rotationX); // 3D 空間原點繞 X 軸旋轉
  draw3DContent();
  pop();

  // 繪製2D選單
  drawMenu();
  image(menuGraphics, -width / 2, -height / 2); // 將2D畫布貼到主畫布上
}

function toggleMenu() {
  menuVisible = !menuVisible;
}

function drawMenu() {
  menuGraphics.clear(); // 清空2D畫布
  if (menuVisible) {
    menuOffset = lerp(menuOffset, 0, 0.1); // 選單滑入
  } else {
    menuOffset = lerp(menuOffset, -300, 0.1); // 選單滑出
  }

  // 在2D緩衝區繪製選單
  menuGraphics.fill(255); // 選單背景
  menuGraphics.rect(menuOffset, 0, 300, height);
  menuGraphics.fill(0); // 選單文字
  menuGraphics.textSize(32);
  menuGraphics.text('About the Author', menuOffset + 20, 100);
  menuGraphics.text('How to Operate', menuOffset + 20, 160);
  
  // Play Music 按鈕，當被點擊時播放音樂
  menuGraphics.textSize(32);
  menuGraphics.text('Play Music', menuOffset + 20, 220);
  
  // 檢查是否點擊「About the Author」
  if (mouseX > menuOffset + 20 && mouseX < menuOffset + 220 && mouseY > 80 && mouseY < 120) {
    if (mouseIsPressed) {
      window.open('https://www.facebook.com/richard.liou.7', '_blank'); // 開啟網頁
    }
  }
/*
  // 檢查是否點擊「How to Operate」
  if (mouseX > menuOffset + 20 && mouseX < menuOffset + 220 && mouseY > 140 && mouseY < 180) {
    if (mouseIsPressed) {
      // 根據 isPositionChanged 狀態決定位置
      if (!isPositionChanged) {
        menuGraphics.fill(50, 50, 50); // 設定文字顏色
        menuGraphics.textSize(20); // 設定字體大小
        menuGraphics.text(
          'Slide the slider \nin the top right corner \nto adjust the size \nof the shapes.',
          menuOffset + 20,
          450
        ); // 顯示操作說明
        menuGraphics.text(
          'Please press \n"Play Music"\nto start playing \nthe music.',
          menuOffset + 20,
          570
        ); // 顯示音樂播放提示
      } else {
        menuGraphics.text(
          'Slide the slider \nin the top right corner \nto adjust the size \nof the shapes.',
          -300,
          450
        ); // 顯示操作說明
        menuGraphics.text(
          'Please press \n"Play Music"\nto start playing \nthe music.',
          -300,
          570
        ); // 顯示音樂播放提示
      }
      isPositionChanged = !isPositionChanged; // 切換狀態
    }
  }

  */

  // 檢查是否點擊「Play Music」
  if (mouseX > menuOffset + 20 && mouseX < menuOffset + 220 && mouseY > 200 && mouseY < 240) {
    if (mouseIsPressed && !isMusicPlaying) {
      music.setVolume(0.5); // 設定音量為 50%
      music.play(); // 播放音樂
      isMusicPlaying = true; // 音樂播放中
    }
  } else {
    isMusicPlaying = false; // 如果沒有點擊
  }
}

function draw3DContent() {
  // 讓顏色從白色過渡到原來的顏色
  colorTransition += 0; // 每一幀增加顏色過渡值
  colorTransition = constrain(colorTransition, 0, 1); // 限制在 0 到 1 之間

  for (let x = -n; x <= n; x++) {
    for (let y = -n; y <= n; y++) {
      for (let z = -n; z <= n; z++) {
        push();
        
        // 計算每顆方塊的位置
        translate(spacing * x, spacing * y, spacing * z); 

        // 為每顆方塊單獨旋轉
        let angleX = (x + y + z) * 0.1 + frameCount * 0.01; // 旋轉角度，基於位置及時間
        let angleY = (x - y + z) * 0.1 + frameCount * 0.01; // 旋轉角度，基於位置及時間
        rotateX(angleX); // 為每顆方塊旋轉
        rotateY(angleY); // 為每顆方塊旋轉

        // 計算每個方塊到原點的距離
        let distance = sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2)); // 計算距離

        // 根據距離調整顏色強度
        let colorIntensity = map(distance, 0, n * 2, colorX, colorX + 55); // 距離越遠，顏色越鮮豔，越近越混濁

        // 計算顏色的紅、綠、藍通道
        let r = map(x, -n, n, 50, colorIntensity);
        let g = map(y, -n, n, 50, colorIntensity);
        let b = map(z, -n, n, 50, colorIntensity);

        // 設置外框顏色
        stroke(r, g, b); // 設置外框顏色
        noFill(); // 設置填充顏色為透明

        // 計算每個方塊的大小
        let scaleFactor = map(distance * 2, 0, n * 4, 1, 0.001); // 距離越遠，方塊越小
        let currentSize = size * scaleFactor;

        // 動態改變方塊大小
        box(currentSize);
        pop();
      }
    }
  }
}
