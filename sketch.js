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
let size = 50; // 初始方塊大小
let spacing = 80; // 初始方塊間距
let sizeSlider; // 滑竿控制方塊大小和間距

let colorX = 0; // 初始化 colorX，控制顏色的增減循環

// 音樂變數
let music; // 用來儲存音樂
let isMusicPlaying = false; // 控制音樂播放狀態

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // 3D 畫布
  menuGraphics = createGraphics(windowWidth, windowHeight); // 2D 畫布緩衝區

  // 創建圖片按鈕，控制選單顯示
  let menuButton = createButton('');
  menuButton.position(20, 20); // 按鈕位置
  menuButton.mousePressed(toggleMenu); // 點擊事件
  menuButton.style('background', 'url("your-image-url.png") no-repeat center'); // 設置背景圖片
  menuButton.style('background-size', 'cover'); // 確保圖片適應按鈕大小
  menuButton.style('border', 'none'); // 移除按鈕邊框
  menuButton.style('width', '30px'); // 按鈕寬度
  menuButton.style('height', '27px'); // 按鈕高度 (按比例縮小)

  // 創建滑竿來控制方塊大小和間距
  sizeSlider = createSlider(50, 200, 50, 1); // 滑竿範圍：50 到 200，初始值為 100
  sizeSlider.position(windowWidth - 170, 10); // 貼右側，位置調整到右上角

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
  
  // 檢查是否點擊「Play Music」
  if (mouseX > menuOffset + 20 && mouseX < menuOffset + 220 && mouseY > 200 && mouseY < 240) {
    if (mouseIsPressed && !isMusicPlaying) {
      music.setVolume(0.2); // 設定音量為 50%
      music.play(); // 播放音樂
      isMusicPlaying = true; // 音樂播放中
    }
  } else {
    isMusicPlaying = false; // 如果沒有點擊
  }
}

function draw3DContent() {
  for (let x = -n; x <= n; x++) {
    for (let y = -n; y <= n; y++) {
      for (let z = -n; z <= n; z++) {
        push();
        
        // 計算每顆方塊的位置
        translate(spacing * x, spacing * y, spacing * z); 

        // 為每顆方塊單獨旋轉
        let angleX = (x + y + z) * 0.1 + frameCount * 0.01;
        let angleY = (x - y + z) * 0.1 + frameCount * 0.01;
        rotateX(angleX);
        rotateY(angleY);

        // 計算每個方塊到原點的距離
        let distance = sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2)); 

        // 根據距離調整顏色強度
        let colorIntensity = map(distance, 0, n * 2, colorX, colorX + 55);
        let r = map(x, -n, n, 50, colorIntensity);
        let g = map(y, -n, n, 50, colorIntensity);
        let b = map(z, -n, n, 50, colorIntensity);

        stroke(r, g, b);
        noFill();

        // 動態改變方塊大小
        let scaleFactor = map(distance * 2, 0, n * 4, 1, 0.001);
        let currentSize = size * scaleFactor;
        box(currentSize);
        pop();
      }
    }
  }
}
