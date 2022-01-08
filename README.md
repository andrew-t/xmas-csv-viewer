# Christmas Tree CSV Viewer

Basically I am a JavaScript person and not a Python person so when I came to do [Matt's silly tree thing this year](https://www.youtube.com/watch?v=WuMRJf6B5Q4) I wanted a viewer that would work without setting up a Python environment. This is it. It's not especially nice but maybe you can use it.

[Play around online](https://github.andrewt.net/xmas-csv-viewer/) or follow the instructions below to set up a local version you can use to iterate faster if you're designing your own effects.

I have no idea if the framerate even approximately matches the real tree.

# Using it

1. Clone this repo somewhere
2. Drop in the CSV of coordinates and the CSV of your effect
3. Edit `script.js` to set `coordFile` and `effectFile` to the right filenames
4. Either launch a web browser with the safeties off, or else start a tiny HTTP server. I suggest the latter and using `npm install -g http-server` but you do you
5. Open `index.html` in a browser
