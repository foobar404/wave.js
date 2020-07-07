# Wave.js ![version](https://img.shields.io/badge/version-1.2.3-purple.svg)

audio visualizer library for javascript
(20+ designs)

<a href="https://foobar404.github.io/Wave.js/">Live Example</a>

<h1>Installation</h1>

<h3>Install With CDN</h3>

```html
<script src="https://cdn.jsdelivr.net/gh/foobar404/wave.js/dist/bundle.iife.js"></script>
```

<h3>Or NPM</h3>

```html
npm i @foobar404/wave
```

<h1>Setup</h1>

<p>if your using npm use a default import to include wave</p>

```javascript
import Wave from "@foobar404/wave"
```

<p>create a new wave object.</p>

```javascript
var wave = new Wave();
```


<h1>Usage</h1>

<p>call one of the three main function on the wave object, fromFile, fromStream, fromElement.</p>

```javascript
wave.fromElement("audio_element_id","canvas_id",{type:"wave"});
```


<h3>Documentation</h3>

<h3>Functions</h3>

<ul>
   <li>fromFile(file name,options)</li>
   <ul>
      <li>file name can be a string of a local or external file, or a data url object.</li>
      <li>options is a object of the options you want rendered.</li>
   </ul>
   <br>
   <li>fromElement(element_id,canvas_id,options)</li>
   <ul>
      <li>element_id is the id of a audio element as a string.</li>
      <li>canvas id is the id of the canvas you want to use as output. This is where the visualization will appear.</li>
      <li>options is a object of the options you want rendered.</li>
   </ul>
   <br>
   <li>fromStream(stream,canvas_id,options)</li>
   <ul>
      <li>stream is a stream object, usually gotten from the getUserMedia() api.</li>
      <li>canvas id is the id of the canvas you want to use as output. This is where the visualization will appear.</li>
      <li>options is a object of the options you want rendered.</li>
   </ul>
   <br>
   <li>stopStream()</li>
   <ul>
      <li>pauses the current visual from the fromStream function.</li>
   </ul>
   <br>
   <li>playStream()</li>
   <ul>
      <li>plays the current stream visual.</li>
   </ul>
</ul>

<h3>Options</h3>
<ul>
   <li><b>stroke:</b> The thickness of the lines that are drawn. Default is 2.</li>
   <li><b>colors:</b> An array of colors used in the visual. Any valid css color is legal.</li>
   <li><b>type:</b> String or array of visuals you want to display.</li>
   <ul>
      <li>["bars", "bars blocks", "big bars", "cubes", "dualbars", "dualbars blocks", "fireworks", "flower","flower blocks", "orbs", "ring", "rings", "round wave", "shine", "shine rings", "shockwave", "star","static", "stitches", "web", "wave"
        ]</li>
   </ul>
</ul>

<h3>Events</h3>
<ul>
   <li>onFileLoad</li>
   <ul>
      <li>This event is triggered when the fromFile function finishes.</li>
      <li>Set this variable equal to a function that takes one parameter <i>image</i>, which is a data uri as a png.
      </li>
   </ul>
</ul>

<h1>Example</h1>

```javascript

let wave = new Wave();
let options = {stroke:4,colors:["#24292e","#547ee2"],type:"star"};

wave.fromElement("audio_element_id","canvas_id",options);
```

<h1>Full Example</h1>

```html
<html>

<head></head>

<body>

   <canvas id="output" height="500" width="500"></canvas>

   <script src="https://cdn.jsdelivr.net/gh/PiethonCoder/wave.js/wave.js"></script>
   <script>
      let wave = new Wave();

      navigator.mediaDevices.getUserMedia({
            audio: true
         })
         .then(function (stream) {
            wave.fromStream(stream, "output", {
               type: "shine",
               colors: ["red", "white", "blue"]
            });
         })
         .catch(function (err) {
            console.log(err.message)
         });
   </script>
</body>

</html>
```

# Development Workflow

<ol>
   <li>Fork Wave.js repo</li>
   <li>Clone to your local computer</li>
   <li>Run "npm i" in the root folder to install dependencies</li>
   <li>Run "npm run test" to start the dev server and code watcher</li>
   <li>Open the src folder and make a change to one of the src files</li>
   <li>Save changes and refresh browser window to see changes</li>
   <li>Push to remote branch and create a pull request to the Wave.js master branch</li>
</ol>