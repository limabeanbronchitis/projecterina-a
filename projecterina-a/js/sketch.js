let dishX = 300;
let dishY = 200;
let dishRadius = 150;
let bacteriaOptions = [];
let selectedBacteria = null;
let moldColonies = [];
let isMoving = false;
let prevMouseX, prevMouseY;
let isResetting = false;
let tearYLeft = dishY - dishRadius;
let tearYRight = dishY - dishRadius;
let colorChangeSpeed = 0.01;
let img, startImg;
let backgroundSpores = [];
let screen = 0; // 0: Start Screen, 1: Game On, 2: End Screen

function preload() {
  img = loadImage("images/hand.png");
  startImg = loadImage("images/start.JPG");
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  strokeWeight(4);
  noCursor();
  initializeBacteriaSquares();
  generateBackgroundSpores();
}

function draw() {
  if (screen === 0) {
    startScreen();
  } else if (screen === 1) {
    gameOn();
  } else if (screen === 2) {
    endScreen();
  }
}

function startScreen() { //inspired by game start screen but is so not game start screen 
  background(255);
  imageMode(CENTER);
  image(startImg, width / 2, height / 2, 800, 500); // Set the image size to 800x500
  fill(255);//I drew the start image 
  textAlign(CENTER);
  textSize(36); 
  textFont('Papyrus'); 
  text("Prepare to Poke", width / 2, height - 30);
}


// Arrival of princess petri
function gameOn() {
  background(242, 245, 157);
  drawBackgroundSpores();

  push();
  if (isMoving) updateDishPosition();
  drawWatercolorGradient(dishX, dishY, dishRadius);
  pop();

  drawBacteriaSquares();
  displayMoldColonies();

  drawEyesAndFace();
  drawArmsAndLegs();
  drawCrown();

  if (isResetting) drawTears();
  imageMode(CENTER);
  image(img, mouseX, mouseY, 50, 50);
}

// End Screen
function endScreen() {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(24);
  text("Thanks for Exploring!", width / 2, height / 2);
}

// Spawn in the bacteria color palate square things 
function initializeBacteriaSquares() {
  let squareSize = 30;
  let bacteriaColors = [
    color(145, 22, 42), color(17, 120, 104), color(247, 189, 114), color(161, 136, 181),
    color(183, 237, 121), color(245, 247, 208), color(84, 21, 44), color(255, 255, 255),
    color(45, 25, 79), color(71, 99, 81)
  ];

  for (let i = 0; i < 10; i++) {
    let bacteria = {
      x: 20,
      y: 20 + i * (squareSize + 10),
      size: squareSize,
      selected: false,
      color: bacteriaColors[i],
      type: i
    };
    bacteriaOptions.push(bacteria);
  }
}

// dancing spores to decorate the background
function generateBackgroundSpores() {
  for (let i = 0; i < 50; i++) {
    backgroundSpores.push({
      x: random(width),
      y: random(height),
      size: random(10, 30),
      color: color(random(100, 200), random(150, 255), random(100, 200), 100),
      pulseSpeed: random(0.005, 0.02)
    });
  }
}

// give it a little bit of animation
function drawBackgroundSpores() {
  for (let spore of backgroundSpores) {
    spore.size += sin(frameCount * spore.pulseSpeed) * 0.5;
    fill(spore.color);
    noStroke();
    ellipse(spore.x, spore.y, spore.size);
  }
}

//a watercolor kinda gradient to make princes petri super cute 
function drawWatercolorGradient(x, y, radius) {
  let baseColor = color(183, 220, 232);
  let yellowTint = color(255, 255, 150, 50);
  let pinkTint = color(255, 182, 193, 50);
  let lightIndigoTint = color(175, 175, 230, 50);

  for (let i = radius; i > 0; i -= 5) {
    let inter = map(i, radius, 0, 0, 1);
    let blendedColor;
    if (i > radius * 0.7) blendedColor = lerpColor(baseColor, yellowTint, inter);
    else if (i > radius * 0.4) blendedColor = lerpColor(baseColor, pinkTint, inter);
    else blendedColor = lerpColor(baseColor, lightIndigoTint, inter);

    fill(blendedColor);
    noStroke();
    ellipse(x, y, i * 2);
  }
  stroke(0);
  noFill();
  ellipse(x, y, radius * 2);
  ellipse(x, y, radius * 1.7);
}

// display the bacteria color palate squares 
function drawBacteriaSquares() {
  for (let bacteria of bacteriaOptions) {
    fill(bacteria.color);
    if (bacteria.selected) {
      stroke(255, 0, 0);
      strokeWeight(3);
    } else noStroke();
    rect(bacteria.x, bacteria.y, bacteria.size, bacteria.size);
  }
}

// position of the dish
function updateDishPosition() {
  let dx = mouseX - prevMouseX;
  let dy = mouseY - prevMouseY;
  dishX += dx;
  dishY += dy;
  for (let mold of moldColonies) {
    mold.x += dx;
    mold.y += dy;
  }
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

// Display Mold Colonies
function displayMoldColonies() {
  for (let mold of moldColonies) {
    mold.grow();
    mold.display();
  }
}

// princes petri serving face
function drawEyesAndFace() {
  let eyeOffset = 40;
  let eyeX = dishX - eyeOffset;
  let eyeY = dishY - dishRadius;

  if (isMoving) {
    stroke(0);
    strokeWeight(5);
    line(eyeX - 10, eyeY - 10, eyeX + 10, eyeY + 10);
    line(eyeX - 10, eyeY + 10, eyeX + 10, eyeY - 10);
    line(eyeX + eyeOffset * 2 - 10, eyeY - 10, eyeX + eyeOffset * 2 + 10, eyeY + 10);
    line(eyeX + eyeOffset * 2 - 10, eyeY + 10, eyeX + eyeOffset * 2 + 10, eyeY - 10);
  } else {
    let eyeMovementX = map(mouseX, 0, width, -10, 10);
    let eyeMovementY = map(mouseY, 0, height, -5, 5);

    fill(255);
    ellipse(eyeX + eyeMovementX, eyeY + eyeMovementY, 30, 30);
    ellipse(eyeX + eyeOffset * 2 + eyeMovementX, eyeY + eyeMovementY, 30, 30);
    fill(0);
    ellipse(eyeX + eyeMovementX, eyeY + eyeMovementY, 15, 15);
    ellipse(eyeX + eyeOffset * 2 + eyeMovementX, eyeY + eyeMovementY, 15, 15);
  }
}

// princess petri serving arms and legs yes our supermodel queen 
function drawArmsAndLegs() {
  stroke(0);
  if (isMoving) {
    line(dishX - dishRadius, dishY, dishX - dishRadius - 40, dishY + sin(frameCount * 0.2) * 20);
    line(dishX + dishRadius, dishY, dishX + dishRadius + 40, dishY + sin(frameCount * 0.2) * 20);
    line(dishX - dishRadius / 2, dishY + dishRadius, dishX - dishRadius / 2, dishY + dishRadius + 40 + sin(frameCount * 0.2) * 20);
    line(dishX + dishRadius / 2, dishY + dishRadius, dishX + dishRadius / 2, dishY + dishRadius + 40 + sin(frameCount * 0.2) * 20);
  } else {
    line(dishX - dishRadius, dishY, dishX - dishRadius - 40, dishY);
    line(dishX + dishRadius, dishY, dishX + dishRadius + 40, dishY);
    line(dishX - dishRadius / 2, dishY + dishRadius, dishX - dishRadius / 2, dishY + dishRadius + 40);
    line(dishX + dishRadius / 2, dishY + dishRadius, dishX + dishRadius / 2, dishY + dishRadius + 40);
  }
}

// cutie crown
function drawCrown() {
  fill(255, 184, 77);
  let crownY = dishY - dishRadius - 50;
  let crownSize = 50;

  triangle(dishX - 50, crownY, dishX - 35, crownY - crownSize, dishX - 20, crownY);
  triangle(dishX - 20, crownY, dishX, crownY - crownSize * 1.2, dishX + 20, crownY);
  triangle(dishX + 20, crownY, dishX + 35, crownY - crownSize, dishX + 50, crownY);
}

// her elegant tears 
function drawTears() {
  fill(0, 100, 255);
  noStroke();
  ellipse(dishX - 40, tearYLeft, 10, 15);
  ellipse(dishX + 40, tearYRight, 10, 15);
  tearYLeft += 2;
  tearYRight += 2;

  if (tearYLeft > height && tearYRight > height) {
    isResetting = false;
    tearYLeft = dishY - dishRadius;
    tearYRight = dishY - dishRadius;
  }
}

// mouse controls the function like
function mousePressed() {
  if (screen === 0) {
    screen = 1;
  } else if (screen === 1) {
    handleBacteriaSelection();
  }
}

// selecting bacteria and making the mold do its mold thing 
function handleBacteriaSelection() {
  for (let bacteria of bacteriaOptions) {
    if (mouseX > bacteria.x && mouseX < bacteria.x + bacteria.size &&
        mouseY > bacteria.y && mouseY < bacteria.y + bacteria.size) {
      bacteriaOptions.forEach(b => b.selected = false);
      bacteria.selected = true;
      selectedBacteria = bacteria;
      return;
    }
  }

  let d = dist(mouseX, mouseY, dishX, dishY);
  if (selectedBacteria && d < dishRadius) {
    let mold = new Mold(mouseX, mouseY, selectedBacteria.type, selectedBacteria.color);
    moldColonies.push(mold);
  }
}

class Mold {
  constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.baseColor = color;
    this.size = random(5, 20);
    this.growthRate = random(0.1, 0.5);
    this.currentColor = this.baseColor;
  }

  grow() {
    this.size += this.growthRate;
    let d = dist(this.x, this.y, dishX, dishY);
    if (d + this.size / 2 > dishRadius) {
      this.size = dishRadius - d;
    }

    for (let other of moldColonies) {
      if (other !== this) {
        let d = dist(this.x, this.y, other.x, other.y);
        if (d < this.size / 2 + other.size / 2) {
          this.interactWith(other);
        }
      }
    }
  }

  interactWith(other) {
    if (this.type === 0) {
      fill(255);
      ellipse(other.x, other.y, 5);
    }
  }

  display() {
    noStroke();
    if (this.type === 8) {
      let t = millis() * colorChangeSpeed;
      this.currentColor = lerpColor(color(45, 25, 79), color(255, 105, 180), sin(t) * 0.5 + 0.5);
    }

    fill(this.currentColor);
    if (this.type === 1) {
      let scale = sin(frameCount * 0.05) * 10;
      ellipse(this.x, this.y, this.size + scale);
    } else if (this.type === 2) {
      stroke(this.currentColor);
      for (let i = 0; i < 10; i++) {
        let angle = random(TWO_PI);
        let length = random(10, 50);
        line(this.x, this.y, this.x + cos(angle) * length, this.y + sin(angle) * length);
      }
    } else if (this.type === 3) {
      push();
      translate(this.x, this.y);
      rotate(frameCount * 0.05);
      noFill();
      stroke(this.currentColor);
      ellipse(0, 0, this.size);
      pop();
    } else if (this.type === 6) {
      for (let i = 0; i < 5; i++) {
        noFill();
        stroke(this.currentColor);
        ellipse(this.x, this.y, this.size + i * 5);
      }
    } else if (this.type === 7) {
      for (let i = 0; i < 5; i++) {
        ellipse(this.x + random(-5, 5), this.y + random(-5, 5), 5, 5);
      }
    } else {
      ellipse(this.x, this.y, this.size);
    }
  }
}

// key press m to move her key press r to reset and throw tantrum
function keyPressed() {
  if (key === 'M' || key === 'm') {
    isMoving = true;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }

  if (key === 'R' || key === 'r') {
    moldColonies = [];
    isResetting = true;
    tearYLeft = dishY - dishRadius;
    tearYRight = dishY - dishRadius;
  }
}

function keyReleased() {
  if (key === 'M' || key === 'm') {
    isMoving = false;
  }
}

function mouseDragged() {
  if (isMoving) {
    dishX = mouseX;
    dishY = mouseY;
  }
}

