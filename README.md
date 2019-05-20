# Wave.js
audio visualizer library for javascript

<img src="https://piethoncoder.github.io/Wave.js/media/s1.png" height="200" width="250">
<img src="https://piethoncoder.github.io/Wave.js/media/s2.png" height="200" width="250">
<img src="https://piethoncoder.github.io/Wave.js/media/s3.png" height="200" width="250">

<h1>Installation</h1>

<h3>Install With CDN</h3> 
https://cdn.jsdelivr.net/gh/PiethonCoder/wave.js/wave.js

<h3>Or</h3>
download the wave.js file from the root of this repository.

<h1>Setup</h1>
<p>create a new wave object.</p>

```javascript
var wave = new Wave();
```


<h1>Usage</h1>

<p>call one of the three main function on the wave object, fromFile, fromStream, fromElement.</p>

```javascript
var audio = document.getElementById("audio");
wave.fromElement(audio,"canvas_id",{wave:true});
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
   <li>fromElement(element,canvas id,options)</li>
   <ul>
      <li>element is a audio element object, or the id of a audio element as a string.</li>
      <li>canvas id is the id of the canvas you want to use as output. This is where the visualization will appear.</li>
      <li>options is a object of the options you want rendered.</li>
   </ul>
   <br>
   <li>fromStream(stream,canvas id,options,muted(optional))</li>
   <ul>
      <li>stream is a stream object, usually gotten from the getUserMedia() api.</li>
      <li>canvas id is the id of the canvas you want to use as output. This is where the visualization will appear.</li>
      <li>options is a object of the options you want rendered.</li>
      <li>muted is an optional parameter that controls if the audio is played outloud or not. Defaults to false.</li>
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
   <li><b>stroke:</b> the thickness of the lines that are drawn. Default is 2.</li>
   <li><b>colors:</b> an array of colors used in the visual. Any valid css color is legal.</li>
   <li><b>wave:</b> boolean -- shows the wave visual effect if true. All boolean defaults are false.</li>
   <li><b>ring:</b> boolean -- shows the ring visual effect if true.</li>
   <li><b>bars:</b> boolean -- shows the bars visual effect if true.</li>
   <li><b>bars_blocks:</b> boolean -- shows the bars_blocks visual effect if true.</li>
   <li><b>dualbars:</b> boolean -- shows the dualbars visual effect if true.</li>
   <li><b>dualbars_blocks:</b> boolean -- shows the dualbars_blocks visual effect if true.</li>
   <li><b>flower:</b> boolean -- shows the flower visual effect if true.</li>
   <li><b>flower_blocks:</b> boolean -- shows the flower_blocks visual effect if true.</li>
   <li><b>star:</b> boolean -- shows the star visual effect if true.</li>
   <li><b>round_wave:</b> boolean -- shows the round_wave visual effect if true.</li>
   <li><b>shine:</b> boolean -- shows the shine visual effect if true.</li>
   <li><b>orbs:</b> boolean -- shows the orbs visual effect if true.</li>
</ul>

<h3>Events</h3>
<ul>
   <li>onFileLoad</li>
   <ul>
      <li>This event is triggered when the fromFile function finishes.</li>
      <li>Set this variable equal to a function that takes one parameter <i>image</i>, which is a data uri as a png.</li>
   </ul>
</ul>

<h1>Example</h1>

```javascript

var wave = new Wave();

var a = document.getElementById("audio");
var options = {stroke:4,colors:["#24292e","#547ee2"],star:true};

wave.fromElement(a,"out_canvas",options);
```

<h1>Full Example</h1>

```html
<html>
   <head></head>
   <body>
   
      <canvas id="output" height="500" width="500"></canvas>   
   
      <script src="https://cdn.jsdelivr.net/gh/PiethonCoder/wave.js/wave.js"></script>
      <script>
         var wave = new Wave();
         
         navigator.mediaDevices.getUserMedia({audio:true})
         .then(function(stream) {
            wave.fromStream(stream,"output",{shine:true,colors:["pink","blue"]});
         })
         .catch(function(err) {
            console.log(err.message)
         });
      </script>
   </body>
</html>
```

