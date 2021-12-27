# Christmas Tree CSV Viewer

Basically I am a JavaScript person and not a Python person so when I came to do [Matt's silly tree thing this year](https://www.youtube.com/watch?v=WuMRJf6B5Q4) I wanted a viewer that would work without setting up a Python environment. This is it. It's not especially nice but maybe you can use it.

# Using it

1. Clone this repo somewhere
2. Drop in the CSV of coordinates and the CSV of your effect
3. Copy `three.module.js` from THREE.js to `three.js/three.module.js`
4. Edit `script.js` to set `coordFile` and `effectFile` to the right filenames
5. Either launch a web browser with the safeties off, or else start a tiny HTTP server. I suggest the latter and using `npm install -g http-server` but you do you
6. Open `index.html` in a browser
