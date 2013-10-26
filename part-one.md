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

Whats returned by getContext is a context object. This object is filled with functions that we can use for drawing. All of these methods take (x,y) coordinates defined with (0,0) in the top-left corner, positive-y going down, and positive-x going to the right. The units are measured in "pixels" that are defined by the context. Lets draw a rectangle.

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

