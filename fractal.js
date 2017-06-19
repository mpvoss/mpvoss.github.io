//--------------------------------------------------------
// File:    fractal.js
// Author:  Matthew Voss
// Purpose: Generate a Mandelbrot fractal that the user
//          can zoom into, adjust colors, and pan around
//--------------------------------------------------------

// Global variables
var global_xCenter = -0.5;
var global_yCenter = 0;
var global_width = 5;
var global_height = 3;
var global_colorScale = 360;

//--------------------------------------------------------
// Set Pixel function.  Allows us to set the pixel of an
// image with rgb values in one function call
//--------------------------------------------------------
function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

//--------------------------------------------------------
// Zooms in 75% whereever the user clicked
//--------------------------------------------------------
function fractalZoom(event) {

   element = document.getElementById("canvas");
   var box = element.getBoundingClientRect();
  
   var x = event.clientX - box.left;
   var y = event.clientY - box.top;
    
   // Read the width and height of the canvas
   width = element.width;
   height = element.height;
    
    width = $("#canvas").outerWidth();
    height = $("#canvas").outerHeight();

   // Ratio of where we clicked to the width/height
   var xRatio = x/width;
   var yRatio = y/height;

   // Center - half of width is the top or left. Add the ratio * actual 
   // width or height to get the exact point clicked
   var xLoc = (global_xCenter - global_width/2)+(xRatio*global_width);
   var yLoc = (global_yCenter - global_height/2)+(yRatio*global_height);
  
   // Update our globals since we've zoomed in
   global_xCenter = xLoc;
   global_yCenter = yLoc;
   global_width *= 0.75;
   global_height *=0.75;

   // Update front end
   generateFractal(global_xCenter,global_yCenter,global_width,global_height);
}

//--------------------------------------------------------
// Loops around the HSV color spectrum
//--------------------------------------------------------
function shiftColorScale(delta){
   global_colorScale = (delta + global_colorScale)%100;

   if (global_colorScale < 0)
      global_colorScale = 360;
	  
    
    console.log(global_colorScale)
   // Update front end  
   generateFractal(global_xCenter,global_yCenter,global_width,global_height);

}

//--------------------------------------------------------
// Lets the user pan around without zooming
//--------------------------------------------------------
function pan(e){

    switch(e.keyCode) {
        case 37:
            // Left key pressed
            global_xCenter -= global_width*.25;
            break;
        case 38:
            // Up key pressed
            global_yCenter -= global_height*.25;
            break;
        case 39:
            // Right key pressed
            global_xCenter += global_width*.25;
            break;
        case 40:
            // Down key pressed
            global_yCenter += global_height*.25;
            break;  

    } 
	
	// Update front end
    generateFractal(global_xCenter,global_yCenter,global_width,global_height);

}

//--------------------------------------------------------
// Resets fractal to a normal zoom around the fractal
//--------------------------------------------------------
function initializeFractal(){
  global_xCenter = -0.5;
  global_yCenter = 0;
  global_width = 5;
  global_height = 3;
  
  element = document.getElementById("canvas");
  element.addEventListener("mousedown", fractalZoom, false);
  window.addEventListener("keydown",pan,false);
  generateFractal(global_xCenter,global_yCenter,global_width,global_height);
}

//--------------------------------------------------------
// TODO: Add more controls
//--------------------------------------------------------
function showControls(){
  alert("Arrow Keys to move.  Click on an area to zoom in,\n with the spot you clicked as the new center");
}

//--------------------------------------------------------
// Simple conversion. It's easiest to map colors to hsv 
// scale because it is continuous. Then this maps that 
// value back to rgb so we can use it
//--------------------------------------------------------
function hsv_to_rgb(h, s, v) {  

    var c = v * s;  
    var h1 = h / 60;  
    var x = c * (1 - Math.abs((h1 % 2) - 1));  
    var m = v - c;  
    var rgb;  
      
    if (typeof h == 'undefined') 
      rgb = [0, 0, 0];  
     
    else if (h1 < 1) rgb = [c, x, 0];  
    else if (h1 < 2) rgb = [x, c, 0];  
    else if (h1 < 3) rgb = [0, c, x];  
    else if (h1 < 4) rgb = [0, x, c];  
    else if (h1 < 5) rgb = [x, 0, c];  
    else if (h1 <= 6) rgb = [c, 0, x];  
      
    return [255 * (rgb[0] + m), 255 * (rgb[1] + m), 255 * (rgb[2] + m)];  
  }  

//--------------------------------------------------------
// Generates a fractal with the given center and scale.
//--------------------------------------------------------
function generateFractal(centerX,centerY,width,height){
 element = document.getElementById("canvas");
 canvas = element.getContext("2d");
 

    
    //console.write(centerX + " " + centerY + " " + width + " " + height);
   // Read the width and height of the canvas
   canvasWidth = element.width;
   canvasHeight = element.height;

   // Create a new pixel array
   imageData = canvas.createImageData(canvasWidth, canvasHeight);

   // Mandelbrot (Thanks to Wikipedia Psuedocode)
   // For each pixel (Px, Py) on the screen, do:
   for (var Px = 0; Px < canvasWidth; Px++) {
    for (var Py = 0; Py < canvasHeight; Py++) {
        {
			// Ratio of where pixel is on screen
            var xRatio = Px/canvasWidth;
            var yRatio = Py/canvasHeight;

			// Actual distance from left/top of image
            var xLoc = xRatio * width;
            var yLoc = yRatio * height;

			// The center - half of width/height is the actual x/y
            var x0 = centerX - (width/2) + xLoc;
            var y0 = centerY - (height/2) + yLoc;

            var x = 0.0;
            var y = 0.0;
            var iteration = 0;
            var max_iteration = 500;

			// See if the point is in the Mandelbrot set
            while (x * x + y * y < 2 * 2 && iteration < max_iteration) {
                var xtemp = x * x - y * y + x0
                y = 2 * x * y + y0
                x = xtemp
                iteration = iteration + 1
            }
			
			// Color mapping
            var h = (iteration+360* global_colorScale /100)%360;
            var s = 1;
            var v = 1;
            var colors= hsv_to_rgb(h,s,v);

			// Color it black if we reached max_iteration
            if (iteration == max_iteration)
              colors = [0,0,0]

            setPixel(imageData, Px, Py, colors[0], colors[1], colors[2], 255); 
        }
    }
}

// Copy the image data back onto the canvas
canvas.putImageData(imageData, 0, 0); // at coords 0,0
}