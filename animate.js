var FPS = 60;
var PADDLE_SPEED = 100;
var BALL_SPEED = 100;

var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var elements = [];
var Element = function(x, y, width, height, vx, vy) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.vx = vx || 0;
  this.vy = vy || 0;

  elements.push(this);
};
Element.prototype.draw = function() {
  ctx.fillRect(this.x, this.y, this.width, this.height);
};
Element.prototype.move = function() {
  for (var i=0; i < elements.length; i++) {
    el = elements[i];
    if (elements[i] == this) {
      continue;
    }
    // bounce on horizontal collision
    if ((this.top() < el.bottom() && this.bottom() > el.top()) &&
        (this.right() < el.left() && this.right() + this.vx >= el.left() ||
         this.left() > el.right() && this.left() + this.vx <= el.right())) {
      this.vx = -this.vx;
      break;
    }
    // bounce on vertical collision
    if ((this.left() < el.right() && this.right() > el.left()) &&
        (this.bottom() < el.top() && this.bottom() + this.vy >= el.top() ||
         this.top() > el.bottom() && this.top() + this.vy <= el.bottom())) {
      this.vy = -this.vy;
      break;
    }
  }
  this.x += this.vx;
  this.y += this.vy;
};
Element.prototype.left = function() {
    return this.x;
};
Element.prototype.right = function() {
    return this.x + this.width;
};
Element.prototype.top = function() {
    return this.y;
};
Element.prototype.bottom = function() {
    return this.y + this.height;
};

// instantiate moving game elements
var paddle1 = new Element(5, 65, 5, 30);
var paddle2 = new Element(230, 65, 5, 30);
var ball = new Element(117, 77, 6, 6, -1 * BALL_SPEED / FPS, 0.6 * BALL_SPEED / FPS);

// create top and bottom walls 
var topWall = new Element( 0, 0, 240, 1);
var bottomWall = new Element(0, 159, 240, 1);

// player one controller
window.onkeydown = function(event) {
  // go up if the up key was pressed
  if (event.keyCode === 38) {
    paddle1.vy = -PADDLE_SPEED / FPS;
  }
  // go down if it was the down key was pressed
  if (event.keyCode === 40) {
    paddle1.vy = PADDLE_SPEED / FPS;
  }
};
window.onkeyup = function(e) {
  paddle1.vy = 0;
};

// computer player
var ai = function(paddle) {
  var prediction = (ball.vy / ball.vx) * (paddle.x - ball.x) + ball.y;
  if (prediction < paddle.top() + paddle.height * 1/3) {
    paddle.vy = -PADDLE_SPEED / FPS;
  } else if (prediction > paddle.top() + paddle.height * 2/3) {
    paddle.vy = PADDLE_SPEED / FPS;
  } else {
    paddle.vy = 0;
  }
};

// game loop
var gameLoop = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < elements.length; i++) {
    elements[i].move();
    elements[i].draw();
  }
  ai(paddle2);
  
  // game rules
  if (ball.right() > canvas.width) {
    ball.x = 117;
    ball.y = 77;
  } else if (ball.left() < 0) {
    ball.x = 117;
    ball.y = 77;
  }
};
setInterval(gameLoop, 1000 / FPS);
