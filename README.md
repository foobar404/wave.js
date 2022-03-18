# Wave.js

Audio visualizer library for javascript.

# Installation 
 
<h3>Install With CDN</h3>

```html
<script src="https://cdn.jsdelivr.net/gh/foobar404/wave.js/dist/bundle.js"></script>
```

<h3>Or NPM</h3>

```html
npm i @foobar404/wave
```

# Setup

If your using NPM: 
```javascript
import {Wave} from "@foobar404/wave";
```

# Usage

```javascript
let audioElement = document.querySelector("#audioElmId");
let canvasElement = document.querySelector("#canvasElmId");
let wave = new Wave(audioElement, canvasElement);

// Simple example: add an animation
wave.addAnimation(new wave.animations.Wave());

// Intermediate example: add an animation with options
wave.addAnimation(new wave.animations.Wave({
    lineWidth: 10,
    lineColor: "red",
    count: 20
}));

// Expert example: add multiple animations with options
wave.addAnimation(new wave.animations.Square({
    count: 50,
    diamater: 300
}));

wave.addAnimation(new wave.animations.Glob({
    fillColor: {gradient: ["red","blue","green"], rotate: 45},
    lineWidth: 10,
    lineColor: "#fff"
}));

// The animations will start playing when the provided audio element is played

// 'wave.animations' is an object with all possible animations on it.

// Each animation is a class, so you have to new-up each animation when passed to 'addAnimation'

```

# Contributing
<ol>
   <li>Fork Wave.js repo.</li>
   <li>Clone to your local computer.</li>
   <li>Run "npm i" in the root folder to install dependencies.</li>
   <li>Run "npm start" to start the code watcher.</li>
   <li>Open the src folder and make a change to one of the src files.</li>
   <li>Push to remote branch and create a pull request to the Wave.js main branch.</li>
</ol>

# License
[MIT](https://choosealicense.com/licenses/mit/)