let yOffset = 0; // keepin trackof da vertical scroll position
let colorOffset = 0; // color transitions
let selectedBacteria = null; // trackin which bacteria is selected
let microbes = []; // store microbes for growth
let dishCenterX = 600;
let dishCenterY = 250; // center of the Petri dish
let dishRadius = 150; // radius of the Petri adish
let moldGrowth = []; // store growth for molds
let eyeballCount = 8; // number of eyeballs

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  background(0);
  cursor("pointer"); //dafinger
}

function draw() {
  background(0);

  // handle the scrolling effect
  handleScrolling();

  fill(221, 248, 242); // Petri dish color
  noStroke();
  ellipse(dishCenterX, height / 2 + yOffset, 300, 300); // Circle follows scrolling

  // Draw eyeballs around the Petri dish bc its boring rn
  drawEyeballs();

  // Draw the bacteria buttonss
  drawBacteriaButtons();

  // Draw the generated microbes and molds
  microbes.forEach((microbe) => {
    drawMicrobe(microbe);
    updateMicrobe(microbe); // Update their position and behavior
  });

  // mold to grow and interact
  moldGrowth.forEach((growth) => {
    generateMold(growth);
  });

  // animate colors and draw the arrows on the left side
  drawScrollingArrows();
}

// Function to handle bacteria button clicks
function mousePressed() {
  // Check if a bacteria button is clicked (selection)
  if (mouseX >= 100 && mouseX <= 250) {
    if (mouseY >= yOffset + 100 && mouseY <= yOffset + 200) {
      selectedBacteria = "ecoli"; // E. coli selected
    } else if (mouseY >= yOffset + 250 && mouseY <= yOffset + 350) {
      selectedBacteria = "staphylococcus"; // Staphylococcus selected
    } else if (mouseY >= yOffset + 400 && mouseY <= yOffset + 500) {
      selectedBacteria = "bacillus"; // Bacillus selected
    } else if (mouseY >= yOffset + 550 && mouseY <= yOffset + 650) {
      selectedBacteria = "lactobacillus"; // Lactobacillus selected
    } else if (mouseY >= yOffset + 700 && mouseY <= yOffset + 800) {
      selectedBacteria = "pseudomonas"; // Pseudomonas selected
    }
  }
  // if da Petri is clicked and a bacteria is selected
  else if (
    dist(mouseX, mouseY, dishCenterX, dishCenterY + yOffset) <= dishRadius &&
    selectedBacteria
  ) {
    // Add a microbe of the selected bacteria type at the clicked location
    microbes.push({
      bacteria: selectedBacteria,
      x: mouseX,
      y: mouseY - yOffset,
      size: random(10, 20), // Initial size
      growSpeed: random(0.05, 0.2), // Growth speed
      mutationTimer: int(random(100, 200)), // Timer for mutation
      mutate: false, // Track mutation status
      angle: random(TWO_PI), // Random starting direction
    });
    selectedBacteria = null; // Reset after bacteria is placed
  }
}

// selected bacteria buttons
function drawBacteriaButtons() {
  // E. coli button
  fill(100, 200, 100); // Green color for E. coli
  rect(100, yOffset + 100, 150, 100);
  textAlign(CENTER, CENTER);
  fill(255);
  text("E. coli", 175, yOffset + 150); // Label the button

  // Staphylococcus button
  fill(150, 100, 200); // Purple color for Staphylococcus
  rect(100, yOffset + 250, 150, 100);
  fill(255);
  text("Staphylococcus", 175, yOffset + 300); // Label the button

  // Bacillus button
  fill(200, 150, 100); // Brown color for Bacillus
  rect(100, yOffset + 400, 150, 100);
  fill(255);
  text("Bacillus", 175, yOffset + 450); // Label the button

  // Lactobacillus button
  fill(100, 200, 250); // Light blue color for Lactobacillus
  rect(100, yOffset + 550, 150, 100);
  fill(255);
  text("Lactobacillus", 175, yOffset + 600); // Label the button

  // Pseudomonas button
  fill(255, 165, 0); // Orange color for Pseudomonas
  rect(100, yOffset + 700, 150, 100);
  fill(255);
  text("Pseudomonas", 175, yOffset + 750); // Label the button
}

// Function to draw microbes based on their bacteria type
function drawMicrobe(microbe) {
  let x = microbe.x;
  let y = microbe.y;

  if (microbe.bacteria === "ecoli") {
    // E. coli: Draw yellow spots
    fill(255, 255, 0, 150); // Yellow with some transparency
    ellipse(x, y, microbe.size); // Random spots
  } else if (microbe.bacteria === "staphylococcus") {
    // Staphylococcus: Draw random lines
    stroke(200, 100, 150);
    strokeWeight(2);
    let x2 = random(-20, 20) + x;
    let y2 = random(-20, 20) + y;
    line(x, y, x2, y2); // Random lines
  } else if (microbe.bacteria === "bacillus") {
    // Bacillus: Draw larger shapes or colonies
    fill(0, 150, 100, 150);
    ellipse(x, y, microbe.size); // Larger circles
  } else if (microbe.bacteria === "lactobacillus") {
    // Lactobacillus: Draw light blue spirals
    noFill();
    stroke(100, 200, 250, 150); // Light blue color
    strokeWeight(2);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let xOffset = microbe.size * 0.5 * cos(a) + random(-2, 2);
      let yOffset = microbe.size * 0.5 * sin(a) + random(-2, 2);
      vertex(x + xOffset, y + yOffset);
    }
    endShape(CLOSE);
  } else if (microbe.bacteria === "pseudomonas") {
    // Pseudomonas: Draw orange fuzzy dots
    fill(255, 165, 0, 100); // Orange with some transparency
    ellipse(x, y, microbe.size); // Fuzzy dots
  }
}

// dont let her out
function updateMicrobe(microbe) {
  // Update position with a random walk (varied movement)
  microbe.x += cos(microbe.angle) * random(0.5, 2);
  microbe.y += sin(microbe.angle) * random(0.5, 2);
  microbe.angle += random(-0.1, 0.1); // Change direction slightly

  // Ensure the microbe stays within the Petri dish
  let distToCenter = dist(
    microbe.x,
    microbe.y,
    dishCenterX,
    dishCenterY + yOffset
  );
  if (distToCenter + microbe.size / 2 > dishRadius) {
    let angleToCenter = atan2(
      dishCenterY + yOffset - microbe.y,
      dishCenterX - microbe.x
    );
    microbe.x =
      dishCenterX - cos(angleToCenter) * (dishRadius - microbe.size / 2);
    microbe.y =
      dishCenterY +
      yOffset -
      sin(angleToCenter) * (dishRadius - microbe.size / 2);
  }

  // her change in mutation over time
  if (microbe.mutationTimer <= 0 && !microbe.mutate) {
    microbe.mutate = true; // Trigger mutation
    microbe.growSpeed *= 1.5; // Accelerate growth
  } else {
    microbe.mutationTimer--; // Countdown to mutation
  }

  // Increase size as the microbe grows
  microbe.size += microbe.growSpeed;
}

// Function to generate mold growth interactions
function generateMold(growth) {
  // Increase mold size over time
  growth.size += growth.growSpeed;

  //random shape and color for the mold
  let shapeType = int(random(0, 4)); // Random shape type
  fill(growth.color[0], growth.color[1], growth.color[2], 100 + random(50)); // Random color

  if (shapeType === 0) {
    ellipse(growth.x, growth.y, growth.size, growth.size); // Blob-like mold
  } else if (shapeType === 1) {
    rect(
      growth.x - growth.size / 2,
      growth.y - growth.size / 2,
      growth.size,
      growth.size
    ); // Squarish mold
  } else if (shapeType === 2) {
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = (TWO_PI / 8) * i;
      let r = growth.size / 2 + random(-10, 10);
      let x = growth.x + cos(angle) * r;
      let y = growth.y + sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE); // Star-like mold
  } else {
    // branching growth
    stroke(growth.color[0], growth.color[1], growth.color[2], 150);
    strokeWeight(2);
    for (let i = 0; i < 5; i++) {
      let angle = random(TWO_PI);
      let x1 = growth.x;
      let y1 = growth.y;
      let x2 = x1 + cos(angle) * growth.size;
      let y2 = y1 + sin(angle) * growth.size;
      line(x1, y1, x2, y2); // Random branching lines
    }
  }
}

// eyeballz
function drawEyeballs() {
  for (let i = 0; i < eyeballCount; i++) {
    let angle = map(i, 0, eyeballCount, 0, TWO_PI);
    let eyeX = dishCenterX + cos(angle) * (dishRadius + 30);
    let eyeY = dishCenterY + yOffset + sin(angle) * (dishRadius + 30);

    // Draw the white of the eye
    fill(255);
    ellipse(eyeX, eyeY, 30, 30);

    //pupil
    let pupilX = map(mouseX, 0, width, eyeX - 5, eyeX + 5);
    let pupilY = map(mouseY, 0, height, eyeY - 5, eyeY + 5);
    fill(0);
    ellipse(pupilX, pupilY, 10, 10);
  }
}

function handleScrolling() {
  if (keyIsDown(DOWN_ARROW)) {
    yOffset -= 5; // Move everything up
  }

  if (keyIsDown(UP_ARROW)) {
    yOffset += 5; // Move everything down
  }

  // dont let em scroll too far now
  yOffset = constrain(yOffset, -800, 0);
}

function drawScrollingArrows() {
  let startColor = color(224, 251, 224); // Red
  let endColor = color(245, 199, 239); // Blue
  let animatedColor = lerpColor(
    startColor,
    endColor,
    sin(colorOffset) * 0.5 + 0.5
  );

  colorOffset += 0.05;
  fill(animatedColor);

  noStroke();
  rect(40, 90, 20, 40); // Rectangle stem for the up arrow
  triangle(50, 50, 70, 90, 30, 90); // Up arrow
  rect(40, 270, 20, 40); // Rectangle stem for the down arrow
  triangle(50, 350, 70, 310, 30, 310); // Down arrow
}
