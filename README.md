# Part One: JavaScript, Canvas, and Basic Animation

## Intro to JavaScript

JavaScript is a _lightweight_, _dynamic_, _weakly-typed_ language. It features _prototype-based objects_, _first-class functions_, and _asynchronous event handling_.

Being lightweight means that JavaScript is a small language. Dynamic means that instead of compiling down to machine code, it's interpreted line by line at runtime. This means that if there is a syntax error half way through a program, then all the code before the error will run, and then the program will fail at the line where the error is.

The easiest way to start with Javascript is to create a blank HTML page, write your code in a .js file, and then require the file in a script tag on the blank page. Your errors and output that we'll discuss in the next two sections will go to your browsers developer console.

```html
<html>
	<script src="__PATH_TO_JAVASCRIPT_FILE_HERE__"></script>
</html>
```

Here's an example of Hello World in JavaScript.
```javascript
console.log("Hello world.");
```
Note that there's no main function, the code starts being interpreted at the top of the file and just runs. ```console.log``` is actually not part of Javascript, but since Javascript runs in a browser it doesn't have stdin and stdout, it instead uses the console object provided by the browser and writes to the browsers developer console.

Here's an example of a function you probably recognize, isPalindrome, written in JavaScript. 

```javascript
function isPalindrome(word){
	var length = word.length;
	for(var i=0; i <= length/2; i++){
		if(word.charAt(i) !== word.charAt(length-i-1)){
			return false;
		}
	}
	return true;
}

isPalindrome("racecar"); // true
isPalindrome("hello"); //false
```

The function takes a word, loops through half of the list and compares it to the other half of the list. When it finds an inconsistency it returns false, otherwise it returns true.

For the most part this code looks something like C or Java, the only really weird thing is the ```!==``` which is equivalent to what you normally see ```!=```. If this were checking equality we'd use ```===``` instead of ```==```. This is a minor detail about how JavaScript handles equality, for now just accept it.

Look at the first line of the function...

```javascript
var length = word.length;
```

```word.length``` clearly returns a number, but instead of declaring length as an int we declared it as a var (as in variable).

If we declared length to be a String it would look like this,

```javascript
var length = "hello";
```

If we declared length to be an array it would look like this,

```javascript
var length = [1, 2, 3];
```

In fact we could redeclare length to be all those things,

```javascript
var length = word.length;
length = "hello";
length = [1, 2, 3];
```

Javascript is _dynamically typed_. This means that we don't have to specify the
type of a variable when we declare it exists, and we can assign values of any
type to any variable. 

This leads to the next feature of JavaScript. It has first-class functions. This means functions are treated just like data. We can assign functions to variables and treat the variables like we would a variable in C or Java.

```javascript
var isPalindrome = function(word){
	var length = word.length;
	for(var i=0; i < length/2; i++){
		if(word.charAt(i) !== word.charAt(length-i-1)){
			return false;
		}
	}
	return true;
};

isPalindrome("racecar");
isPalindrome("hello");
```

Note how in this implementation, instead of saying 

```javascript
function isPalindrome(word){ ... }
```

we say

```javascript
var isPalindrome = function(word){ ... };
```

So we're now declaring a variable called isPalindrome and setting it equal to an _anonymous function_.

__Definition:__ An _anonymous function_ is any function in the form ```function(){ .. };```. You can think of these as functions without names, even though they're commonly set to a named variable. 

So anonymous functions are part of why we say functions are _first-class citizens_ in JavaScript. They're treated like data and can be set into variables. The second, more useful power is that they can be passed into functions just like you would any other data!

```javascript
var sayWorld = function(){
	console.log("world");
};

var sayHello = function(){
	console.log("hello");
}

var runFuns = function(fun1, fun2){
	fun1();
	fun2();
};

runFuns(sayHello, sayWorld);
// => "hello"
// => "world"


runFuns(sayWorld, sayHello);
// => "world"
// => "hello"


runFuns(sayHello, function(){
	console.log("devon");
});
// => "hello"
// => "devon"
```

Note how in that last one I just declared an anonymous function right in the execution of the runFuns function.


## The JavaScript Event Loop

Javascript by itself can't really do all that much. The strength of JavaScript comes from its ability to use functions that the browser gives it access to. One of those functions we will be using a lot is `setTimeout`. The purpose of `setTimeout` is to delay code from executing. We will be using it to animate things in our games.

As we discussed in the previous section, functions can be passed into other functions in JavaScript. `setTimeout` takes two parameters, a function, and then a time in milliseconds to be delayed before that function is run.

```javascript
setTimeout(function(){
	console.log("hello world");
}, 5000);
```

If we run this we see that `setTimeout` delays "hello world" from being printed for five seconds. You might think this is like the sleep function in C, but it's not. This is where things get crazy.

```javascript
setTimeout(function(){
	console.log("hello");
}, 5000);
console.log("world");
```

If `setTimeout` worked like sleep, this would log "hello" and then "world". __But it doesn't.__ Instead it logs "world" _and then_ "hello".

JavaScript was made as an event driven language. When something happens in the browser, some code should run. "Something happens in the browser" could be a form submission, or a keystroke, or even just a certain amount of time passing. As a programmer, we don't want to be responsible for constantly checking the time or button presses, so instead, in the background, JavaScript runs a loop constantly checking for new events that get queued up by the browser.

`setTimeout` is our way of telling the browser to simulate one of these events after a period of time. Whenever we create one of these _event listeners_ we write an anonymous function called a _callback_ that gets called once the event happens.

Lets look at some examples:

```javascript
setTimeout(function(){
	console.log("world");
}, 5000);
console.log("hello");
```

This is the correct version of our function from before. It will say "hello" immediately and then five seconds later say "world".

Imagine we wanted to say "hello" after five seconds and then "world" five seconds after that. An incorrect way to do this would be...

```javascript
setTimeout(function(){
	console.log("hello");
}, 5000);
setTimeout(function(){
	console.log("world");
}, 5000);
```

This _won't_ display the messages five seconds apart. Instead both messages will display at the same time after five seconds. This is because we set the `setTimeout`s at the same time.

One possible solution is to tell our browser to just run the first `setTimeout` (hello) after five seconds, and our second `setTimeout` (world) after ten seconds.

```javascript
setTimeout(function(){
	console.log("hello");
}, 5000);
setTimeout(function(){
	console.log("world");
}, 10000);
```

This works... most of the time. Unfortunately the browser can't guarantee that it will call our code after the exact number of milliseconds we want since it also needs to handle browser things like loading tabs, pages, and executing other JavaScript. If it's really busy it might take more than ten seconds to realize how much time has passed and run them at the same time. This strategy is also subjectable to the programmer's bad math errors.

The idea of one thing coming after the other matters to us because this is how we're going to animate things in our games.

The better way to do this is to set our `setTimeout` for "hello" first, and then in the anonymous function where we're saying "hello" we immediately after set a second `setTimeout` for five seconds later.

```javascript
setTimeout(function(){
	console.log("hello");
	setTimeout(function(){
		console.log("world");
	}, 5000);
}, 5000);
```

Note how I'm stacking callbacks inside of callbacks now. This can get pretty ugly pretty fast, but we can clean it a little by using callbacks ourselves in our own functions.

```javascript
var sayHello = function(time, cb){
	setTimeout(function(){
		console.log("hello");
		cb();
	}, time);
}

var sayWorld = function(time){
	setTimeout(function(){
		console.log("world");
	}, time);
}

sayHello(5000, function(){
	sayWorld(5000);
});
```
This is a much more modular way of structuring our events because now we can plug and play them in any order, or easily make things happen between them.

One last thing that you need to understand about the event queue is that it only runs one thing at a time. Consider the following code...

```javascript
setTimeout(function(){
	console.log("world");
}, 5000);
console.log("hello");
while(true){};
```

The browser will be told "in five seconds run this function that says world", and in five seconds the browser will put that function call into a queue that the event loop is constantly checking. But immediately after we say "hello" we've started a `while(true)` loop that will never end and thus never let the current bit of code finish. Until this code finishes running, the event loop will never check the queue and our ```console.log("world")``` will never run.

## The Canvas

JavaScript is what we'll be writing our code in, but it's only one peice of the puzzle. We're going to need a screen to write to. In HTML5 we have something awesome called Canvas. You can think of it as an image just like any other image on the web except that you can draw on it using JavaScript and the tools in the HTML5 API that your browser gives you.

In order to start off, create a simple html document with just our javascript and our canvas in it. I'm calling my html index.html and my javascript, in the same directory, animate.js. Give the canvas element an id of "screen" so we can easily grab it in our javascript and a size of 240x160.

```html
<html>
	<canvas id="screen" width="240" height="160"></canvas>
	<script src="animate.js"></script>
</html>
```

In our JavaScript file the first thing we'll have to do is grab the canvas element. The canvas element is a drawing surface that exposes one or more _rendering contexts_ which are defined in some dimension and allow us to draw in the element. We're going to focus on the 2D rendering context, but there are experimental implementations of the 3D context based on OpenGL.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');
```

Whats returned by getContext is a context object. This object is filled with functions that we can use for drawing. All of these methods take (x,y) coordinates defined with (0,0) in the top-left corner, positive-y going down, and positive-x going to the right. The units are measured in "pixles" that are defined by the context. Lets draw a rectangle.

First lets define a fill-style, the rules governing things like the color of what ever we're going to draw. Lets make the fill-style red.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200, 0, 0)";
```

Now lets draw a red-filled rectangle at the position (20, 20) thats 50 pixels tall and 75 pixels wide.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200, 0, 0)";
ctx.fillRect(20, 20, 75, 50);
```

We could also draw another rectangle, but this time lets make it blue and little translucent using the rgba definition of color.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200, 0, 0)";
ctx.fillRect(20, 20, 75, 50);

ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
ctx.fillRect(40, 40, 50, 50);
```

If we wanted to draw another red square after the blue square, but didn't want to manually reset the fillStyle, we can use the save and restore functions to stash rendering context's fillStyle.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200, 0, 0)";
ctx.fillRect(20, 20, 75, 50);
ctx.save();

ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
ctx.fillRect(40, 40, 50, 50);
ctx.restore();

ctx.fillRect(60, 60, 50, 50);
```

## Animation

What's currently happening is our html file loads, our canvas is created, and then we immediately draw shapes to it using our JavaScript. We're going to take this a step further now using our knowledge of the event loop and setTimeouts.

Lets first create a flashing box. We'll wait one second, draw the box, wait one second, then clear the screen. For clearing the screen we'll draw a _clearRect_ across the whole screen.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200, 0, 0)";

setTimeout(function(){
	ctx.fillRect(20, 20, 50, 50);
	setTimeout(function(){
		ctx.clearRect(0, 0, 240, 160);
	}, 1000);
}, 1000);
```
It would be great to do this multiple times, we can do so pretty easily using recursion.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200, 0, 0)";

var pulseRect = function(){
	setTimeout(function(){
		ctx.fillRect(20, 20, 50, 50);
		setTimeout(function(){
			ctx.clearRect(0, 0, 240, 160);
			pulseRect();
		}, 1000);
	}, 1000);
};

pulseRect();
```

Congratulations, you now have a pulsing rectangle! But we can do a lot better than this. Lets consider setTimeouts sister function, setInterval. setInterval works just like setTimeout, except setting events in the given interval. If setInterval is given a function and 5000 milliseconds, the function will be run every five seconds over and over again.

Lets get rid of the recursion and clean up this code using setInterval.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200, 0, 0)";

setInterval(function(){
	ctx.fillRect(20, 20, 50, 50);
	setTimeout(function(){
		ctx.clearRect(0, 0, 240, 160);
	}, 1000);
}, 2000);
```

setInterval is how we're going to animate things on the canvas. Our basic loop will be clear screen, change draw position, draw objects. Lets try moving a square across the screen.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200, 0, 0)";

var xLocation = 0;
setInterval(function(){
	ctx.clearRect(0, 0, 240, 160);
	xLocation++;
	ctx.fillRect(xLocation, 20, 50, 50);
}, 100);
```

Two things are very different. First, we made the interval a lot smaller. We want our box to move a lot faster than one pixel every two seconds. Second I now have a variable called xLocation that exists outside of the anonymous function that it knows about and can update.

We could take this further. We could abstract the yLocation as well, and the location change and the drawing into their own functions. But if we want multiple boxes moving in different ways this will get messy quickly. What we really need is a reusable box _class_ that we can use to create multiple box _instances_ that can maintain themselves...

We've now talked about the JavaScript, how to delay code with JavaScript, Canvas, how to draw to the Canvas, and finally animation. But now we need more control of our boxes and need them to be aware of each other.

# Part Two: Objects in JavaScript, Collision Detection, Pong

_For this part of the lesson, delete everything in your old animate.js file and start over. It's important to leave your index file and the canvas defined with a width of 240 and a height of 160. If you get lost at some point, the finished code is at the bottom._

## Objects

In object oriented programming with classes, a class is a construct used to define a distinct type and an object usually refers to an instance of a class. JavaScript is slightly different in that it's a prototype based language. Instead of objects being instances of classes, objects are just clones of other objects which they call their prototype.

This allows for a lot of flexibility that normal object oriented languages don't offer, but it also has created a lot of confusion. The _"class oriented"_ way of creating objects in JavaScript is to use the ```new``` operator. When the ```new``` operator is used on a function, it clones that function's prototype into new object, applies the function, and then returns the object. We can use the ```new``` operator to mimic a class based language by treading the function as a constructor and assign class methods to the functions prototype.

For example, if we wanted to create a Car class we could do...

```javascript
var Car = function(color) {
  this.color = color;
};
Cat.prototype.describe = function() {
  alert('This is a ' + this.color + ' car.');
}
```

Then to use the class...

```javascript
redCar = new Car('red');
recCar.describe(); // alerts "this is a red car."
```

For our pong game, we're going to create a _"class"_ for game elements. Our elements will maintain their size dimensions, positions, have a method for drawing themselves, move themselves, and, with the help of a global elements container, be able to detect collision with other elements.

For simplicity sake we'll add a few restrictions.
* All elements will be rectangles.
* All elements will check collision against all other elements (instead a set of "near by" elements).
* When an elements collides with another element, it reverses it's velocity (bounces).

Lets get started.

```javascript
var Element = function(x, y, width, height, vx, vy) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.vx = vx || 0;
  this.vy = vy || 0;
};
```

Here we have our constructor, pretty basic. It takes an ```x``` and a ```y``` for position, a ```width``` and a ```height```. Optionally it can take a ```vx``` for it's horizontal velocity and a ```vy``` for it's vertical velocity, which both default to zero when not set.

We're also going to want to add a way to iterate through all of our elements easily. To do this we're going to add a global ```elements``` list and append new elements to it when their constructor is applied.

```javascript
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
```

The next thing we'll need to do is have a way to draw the elements. At the top of our file we'll want to keep the same instantiation of our ```canvas``` and our ```ctx``` that we had before.

```javascript
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');
```

In our Element prototype we'll add a draw function that uses them.

```javascript
Element.prototype.draw = function() {
  ctr.fillRect(this.x, this.y, this.width, this.height);
};
```

Now lets instantiate a couple elements relevant to our pong game.

```javascript
var paddle1 = new Element(5, 65, 5, 30);
var paddle2 = new Element(5, 65, 5, 30);
var ball = new Element(117, 77, 6, 6);
```

Now if we load our screen we should just see two paddles facing eachother and not much else.

## Moving

Our big issue is that nothing is moving. Similar to our previous example of basic moving rectangles, we'll need a loop constantly clearing the canvas, moving the elements, and drawing the elements. In addition, our loop will have to manage some game logic. We'll call this loop, the game loop.

Before we go any further, I find it helps to explicitly declare our element speeds and refresh rate at the top of our file.

```javascript
var FPS = 60;
var PADDLE_SPEED = 100;
var BALL_SPEED = 100;
```

_Note that ```FPS``` is a rate of game updates per second, while ```PADDLE_SPEED``` and ```BALL_SPEED``` are a displacement constant of pixles per second._

Now lets add our movement.

```javascript
Element.prototype.move = function() {
  this.x += this.vx;
  this.y += this.vy;
};
```

Create our game loop at the bottom of our code.

```javascript
var gameLoop = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < elements.length; i++) {
    elements[i].move();
    elements[i].draw();
  }
};
setInterval(gameLoop, FPS);
```

And last but not least, add a little motion to our existing ball (remember, we have to normalize it by FPS).

```javascript
var paddle1 = new Element(5, 65, 5, 30);
var paddle2 = new Element(230, 65, 5, 30);
var ball = new Element(117, 77, 6, 6, BALL_SPEED / FPS, 0);
```

If all went well you'll now see two paddles and a ball going right through the one on the right. Your code should look something like this...

```javascript
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
  ctr.fillRect(this.x, this.y, this.width, this.height);
};
Element.prototype.move = function() {
  this.x += this.vx / FPS;
  this.y += this.vy / FPS;
};

var paddle1 = new Element(5, 65, 5, 30);
var paddle2 = new Element(230, 65, 5, 30);
var ball = new Element(117, 77, 6, 6, BALL_SPEED / FPS, 0);

var gameLoop = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < elements.length; i++) {
    elements[i].move();
    elements[i].draw();
  }
};
setInterval(gameLoop, 1000 / FPS);
```

## Collision Detection

It's important to remember that Canvas elements have their origin in the top left corner. The positive y-axis goes down, and the positive x-axis goes right. This is a little tricky to think about, so I find it's helpful to add a set of helper functions to the prototype that return the y values of top and bottom sides of the element, and the x values of the right and left.

```javascript
var Element = function(x, y, width, height, vx, vy) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.vx = vx || 0;
  this.vy = vy || 0;

  elements.push(this);
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
```

Lets preface this with something. Real game collision detection is hard. We have a huge advantage in our pong game.
1. There are only two axis.
2. Everything is a rectangle.
3. We don't have enough elements that looping through all of them is a problem.

If there is a collision we'll want to reverse the direction of the element (bounce). In our ```move``` function  we'll loop through and check collision of the current element against every other element. If we do collide, we'll reverse the velocity and break our loop. It should look something like this...

```javascript
Element.prototype.move = function() {
  for (var i=0; i < elements.length; i++) {
    el = elements[i];
    if (el == this) {
      //don't check collision against yourself
      continue;
    }
    
    // bounce on horizontal collision
    if ( ... ) {
      this.vx = -this.vx;
      break;
    }
    
    // bounce on vertical collision
    if ( ... ) {
      this.vy = -this.vy;
      break;
    }

    this.x += this.vx;
    this.y += this.vy;
};
```

Our definition of a horizontal collision for some element A's right side to collide into element B's left side will be...  1. The top of A is above the bottom of B
2. The bottom of A is below the top of B
3. Before vx is applied, A's right side is to the left of element B's left side
4. After vx is applied, A's right side is to the right of element B's left side

In code this looks like this (remember, down is more positive in canvas)...
1. ```A.top() < B.bottom()```
2. ```A.bottom() > B.top()```
3. ```A.right() < B.left()```
4. ```A.right() + A.vx >= B.left()```

A version in our move function that accounts for both-right side and left-side collision will be

```javascript
if ((this.top() < el.bottom() && this.bottom() > el.top()) &&
    (this.right() < el.left() && this.right() + this.vx >= el.left() ||
     this.left() > el.right() && this.left() + this.vx <= el.right())) {
  this.vx = -this.vx;
  break;
}
```

With the vertical variant (same logic, but swap top and left and bottom and right), here is our new move function.

```javascript
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
```

If we test this you should now see the ball bouncing back and forth between each paddle.

_If you're having trouble with understanding this code, it's OK, it's really just a test of your ability to write long if statements and not your JavaScript skill. Just copy and paste my code and move on._

## Controlling Player One

As we talked about in the first part of this lesson, JavaScript is an event driven language. It specializes in responding to lots of events and performing them on a single thread without requiring the programmer to do anything special. The browser (in the form of the global ```window``` object) makes this even easier by giving us _event listeners_ which we can use to "listen" for an event and define a callback function to respond with.

Our goal is to control the first paddle (paddle1, the one on the left) with the up and down arrows of the players keyboard. To do this, we're going to set up two event listeners, an ```onkeydown``` listener that listens for a key to be pressed and passes data about the keypress to the callback function, and an ```onkeyup``` listener. The first will tell the paddle to start moving, the second will tell it to stop.


Add this after ```paddle1``` has been defined.
```javascript
window.onkeydown = function() {
  // go up if the up key was pressed
  if ( ... ) {
    paddle1.vy = -PADDLE_SPEED / FPS;
  }

  // go down if it was the down key was pressed
  if ( ... ) {
    paddle1.vy = PADDLE_SPEED / FPS;
  }
}
```

As you can see, on the keydown event we somehow figure out if it was the up key or the down key and then change paddle1's y-velocity accordingly.

The way we detirming which key is being pressed is by the event object that the onkeydown listener passes to the callback. This object has a property called ```keyCode``` which defines the key pressed. Every key on the keyboard has a unique keyCode. The up keycode is ```38``` and the down keycode is ```40```.

```javascript
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
```

If you test this you should see your paddle sliding back and forth without stop. The stop needs to happen on keyup. For this we'll simply add a ```keyup``` event listener.

```javascript
window.onkeyup = function(e) {
  paddle1.vy = 0;
};
```

Now we should have proper start and stop control of ```paddle1``` using the up and down arrows on the keybord.

## Walls and resetting the ball

Now is a good time to add the walls. Ideally, you should treat walls differently from game elements, but our goal here is to be simple, so lets just add two new elements with no velocity to represent our walls.

```javascript
// create top and bottom walls 
var topWall = new Element( 0, 0, 240, 1);
var bottomWall = new Element(0, 159, 240, 1);
```

Now lets use them, lets change the ball to move at an angle.

```javascript
var ball = new Element(117, 77, 6, 6, -1 * BALL_SPEED / FPS, 0.6 * BALL_SPEED / FPS);
```

Lastly, lets add some game rules to the game loop. When we see the ball pass one of the paddles, we reset it to it's start point.

```javascript
var gameLoop = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < elements.length; i++) {
    elements[i].move();
    elements[i].draw();
  }
  computerPlayer();
  firstPlayer();

  // game rules
  if (ball.right() > canvas.width) {
    ball.x = 117;
    ball.y = 77;
  } else if (ball.left() < 0) {
    ball.x = 117;
    ball.y = 77;
  }
};
```

_At this point, if you wanted, you could probably figure out how to add control to the other player and have a finished pong game. But that's the easy way out. The next section will be on how to make this a fun single player._

## AI for Player Two

Now for the fun stuff. Lets make a simple AI to control Player two. The AI will issue three states, move up, move down, and don't move. It's goal will be to move to the point at which it thinks the ball will arrive.

The way we're going to do this is by knowing the ball's x, y, vx, and vy, create a line representing it's path, and come up with the intersection with our paddle. Lets recall high school algabra.

The slope-intercept formula for a line is

```
y = mx + b
```

Where ```x``` and ```y``` are a point on that line, ```m``` is it's slope, and ```b``` is the y-intercept (the y value when x=0). Since ```m``` can be defined as our rise over our run, it shows that

```javascript
m = ball.vy / ball.vx
```

And if we were to solve for ```b``` of the current ball's path it shows

```
y = mx + b
```

```
b = y - mx
```

```javascript
b = ball.y - (ball.vy / ball.vx) * ball.x
```

Now we have a ```b``` and a ```m```. We want to solve for where our paddle should be, which will be our ```y``` value. Our ```x``` will simply be the x value of our paddle (our right paddle). Put this all together and we see

```javascript
y = m * paddle.x + b
```

```javascript
y = (ball.vy / ball.vx) * paddle.x + (ball.y - (ball.vy / ball.vx) * ball.x)
```

If we simplify this, and call ```y``` our prediction we get a nice (less than 80 character wide) solution.

```javascript
var prediction = (ball.vy / ball.vx) * (paddle.x - ball.x) + ball.y;
```

Keep in mind that this doesn't account for the walls. A lot of the time, the prediction will outside the range of the feild, but in practice, I find it still does a great job of telling the paddle to move up or down.

Now every frame we want to tell our paddle to move up, down, or stay in place. Lets say we want the ball to hit somewhere in the middle third of our paddle. Our ai function should look like so

```javascript
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
```

Now to include that in our game loop, all we have to do is say...

```javascript
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
```

If all goes well you should have a working computer player to play against. _Note that I've made the ```ai``` function accept a paddle so that you can use this for both ```paddle1``` and ```paddle2```. Try having two AI play eachother, it's pretty fun._

## Afterword


You should now have a fully functional JavaScript Pong game. Hopefully you've been testing as you were writing, if not, feel free to reference the finished code below. The purpose of this exercise is to teach you JavaScript. If you want to create canvas games in the future, I highly recommend __not__ doing it from scratch like we did with this. There are some great game development libraries our there such as [enchant.js](http://enchantjs.com/) and great physics engines like [box2d.js](http://box2d-js.sourceforge.net/) which will handle all the boilerplate code for you.

If you would like to get a little more out of the project, here are some ideas for additions...
* Random starting ```vy``` and ```vx``` for the ball.
* A score board in HTML that updates.
* A win condition after a certain number of points.
* HTML buttons to set either paddle to AI or player controller.
* Changing the ```vy``` of ball based on the ```vy``` of the paddle when they hit.
* A smarter AI that considers bouncing off walls in it's prediction.
* Online two player battle (this is a great project for experimenting with Node and websockets).

## Finished Code

```javascript
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
```
