let increment = 0.05;
let scale = 10;
let cols, rows;
let zoffset = 0;

let particles = [];
let vectors = [];


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  cols = floor(width / scale);
  rows = floor(height / scale);

  vectors = new Array(cols * rows);
  background(0);

}

function draw() {

  background(0);
  for (let i = 0; i <5;i++) {
    particles[particles.length] = new Particle(canvas.width/2-2 + Math.random()*4, canvas.height - 100);
    //particles[particles.length] = new Particle(canvas.width/2-50, canvas.height - 100);
    //particles[particles.length] = new Particle(canvas.width/2+50, canvas.height - 100);
  }


  var yoffset = 0;
  for (let y = 0; y < rows; y++) {
    let xoffset = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoffset, yoffset, zoffset) *2*PI + PI/2; // noise value ranges from 0-1, with a mean of 0.5
      let vector = p5.Vector.fromAngle(angle);
      vector.setMag(.005);
      vectors[index] = vector;
      xoffset += increment;
      /* //visualise flow field (use a big scale for this)
      stroke(255);
      push();
      translate(x*scale,y*scale);
      rotate(vector.heading());
      line(0,0,scale,0);

      pop();
      */
    }
    yoffset += increment;

    zoffset += 0.00025;
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(vectors);
    particles[i].update();
    particles[i].show();
  }
  for (let i = particles.length - 1; i > 0; i--) {
    if (particles[i].colour.levels[0] <= 0) {
      particles.splice(i, 1)
    }
  }
}


function Particle (xin, yin) {
  this.position = createVector(xin, yin);
  this.velocity = createVector(Math.random()/2-1/4, -Math.random()*5-1);
  this.acceleration = createVector(0, 0);
  this.maxspeed = 0.5;
  this.colour = color(155,155,155);
  this.fadeSpeed = 0.25;

  this.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  this.follow = function(vectors) {
    let x = floor(this.position.x / scale);
    let y = floor(this.position.y / scale);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    this.acceleration.add(force);
  }

  this.show = function() {
    for (let i = 0; i<3; i++)
      this.colour.levels[i] -= this.fadeSpeed;
    stroke(this.colour);
    strokeWeight(1);
    point(this.position.x, this.position.y);
  }
}
