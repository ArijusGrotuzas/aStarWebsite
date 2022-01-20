// Get the canvas and the context to draw on.
var canvas = document.getElementById('content');
var ctx = canvas.getContext('2d');

// Array of landscape
var landscape = null;

// Array for storing white tiles, e.g. white tiles.
var squares = [];
var path = null;

// Variable for storing the width of each tile.
var square_width = null;

// Variable for storing the height of each tile.
var square_height = null;

// Array for storing the previous and current positions of selected points
var previous_squares = [{}, {}];
var current_squares = [{}, {}];

// Id for determining if a point is a starting point or an end point
var pointID = true;

/*	Function for creating a random array filler with either zero or one.
	The function takes in the height and width of desired array and a
	ratio of zero's to ones, as arguments*/
function random2DArray(height, width, ratio){
	var base = new Array(height)

	for (var i = 0; i < base.length; i++) {
		base[i] = new Array(width);
	}

	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			var num = Math.random();
			if (num > ratio){
				base[i][j] = 1;
			}
			else{
				base[i][j] = 0;
			}
		}
	}

	return base
}

// Draw a square in the canvas
function drawSquare(color, x, y, width, height){
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.stroke();
}

function closestTile(position){
	var shortest_diff = square_width/2;
	var tempSquare = null;

	for(var i = 0; i < squares.length; i++){

		// Euclidean distance between current mouse coordinate and the n-th tile.
		var diff = Math.sqrt(Math.pow(squares[i].x - position.x, 2) + Math.pow(squares[i].y - position.y, 2));

		// If the distance is less than radius of a tile, then we found the correct tile.
		if(diff < shortest_diff){
			shortest_diff = diff;
			tempSquare = squares[i];
		}
	}
	return tempSquare;
}

// Function for converting pointer's page coordinates to canvas coordinates.
function windowToCanvas(canvas, x, y) {
	var bbox = canvas.getBoundingClientRect();
	return {x: Math.round(x - bbox.left * (canvas.width  / bbox.width)), y: Math.round(y - bbox.top  * (canvas.height / bbox.height))};
}

// Function that draws the grid.
function draw_context(size, ratio){
	// Reset some of the global variables
	squares = []
	previous_squares = [{}, {}];
	current_squares = [{}, {}];
	path = [];

	landscape = random2DArray(size, size, ratio);

	square_width = canvas.width/size;
	square_height = canvas.height/size;

	for (var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){

			var xPos = square_width * i;
			var yPos = square_height * j;

			if (landscape[i][j] == 0){
				drawSquare("white", xPos, yPos, square_width, square_height);
				squares.push({x: xPos + (square_width/2), y: yPos + (square_height/2), s: i, v: j});
			}
			else if(landscape[i][j] == 1){
				drawSquare("black", xPos, yPos, square_width, square_height);
			}
		}
	}
}

// Select a tile in the canvas
function selectTile (index, position, color){

	if(current_squares[index]){
		previous_squares[index] = {x: current_squares[index].x, y: current_squares[index].y};
	}

	tile = closestTile(position);

	if (tile){

		for(var i = 0; i < current_squares.length; i++){
			if (current_squares[i].x == tile.x && current_squares[i].y == tile.y){
				return;
			}
		}

		current_squares[index] = tile;

		/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Draw current square ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		drawSquare(color, current_squares[index].x - (square_width/2), current_squares[index].y - (square_height/2), square_width, square_height);

		if (!(previous_squares[index].x == current_squares[index].x) || !(previous_squares[index].y == current_squares[index].y)){
			/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Remove previous square ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			drawSquare("white", previous_squares[index].x - (square_width/2), previous_squares[index].y - (square_height/2), square_width, square_height);
		}
	}
}

// Set the start point
document.getElementById("start").addEventListener("click", function(e){
	e.preventDefault();
	pointID = true;
})

// Set the end point
document.getElementById("end").addEventListener("click", function(e){
	e.preventDefault();
	pointID = false;
})

document.getElementById("travel").addEventListener("click", function(e){
	e.preventDefault();

	var diagonal = document.getElementById("diagonal").checked;
	
	var emptySelection = false;

	if(path){
		for(var i = 1; i < path.length-1; i++){
			drawSquare("white", square_width * path[i].x, square_height * path[i].y, square_width, square_height);
		}
	}

	for(var i = 0; i < current_squares.length; i++){

		if (Object.keys(current_squares[i]).length === 0){
			alert("Missing one of the points.");
			emptySelection = true;
		}
	}

	if (!emptySelection){
		path = a_star(landscape, {x: current_squares[0].s, y: current_squares[0].v}, {x: current_squares[1].s, y: current_squares[1].v}, diagonal, 100000);

		if(path){
			document.getElementById("warning").innerHTML = "";
			
			for(var i = 1; i < path.length-1; i++){
			setTimeout(function(y){
				drawSquare("green", square_width * path[y].x, square_height * path[y].y, square_width, square_height)
				}, (path.length-1 - i) * 50, i);
			}
		}
		else{
			document.getElementById("warning").innerHTML = "Could not find a path...";
		}
	}
})

// MouseOver event listener attached to the canvas element.
document.getElementById("content").onmousemove = function (e) {
	var loc = windowToCanvas(canvas, e.clientX, e.clientY);
	tile = closestTile(loc);
};


// Click event listener attached to the canvas element.
document.getElementById("content").addEventListener("click", function(e){

	// Get the position of mouse inside the canvas
	var loc = windowToCanvas(canvas, e.clientX, e.clientY);

	if(pointID){
		selectTile(0, loc, "red");
	}
	else{
		selectTile(1, loc, "blue");
	}
})

// Create a new random map
document.getElementById("refresh").addEventListener("click", function(e){
	e.preventDefault();

	var new_ratio = parseFloat(document.getElementById("ratio").value);
	var new_size = parseInt(document.getElementById("size").value);

	if (!new_ratio){
		new_ratio = 0.85;
	}

	if (new_ratio < 0.0 || new_ratio > 1.0){
		new_ratio = 0.85;
	}

	if(!new_size || new_size < 0 || new_size > 100){
		new_size = 20;
	}

	draw_context(new_size, new_ratio);
});

// Size the canvas up to the scale of computer screen
function resize_window(){
	// Width and height of the window
	canvas.width = parseInt(screen.availWidth * 0.325);
	canvas.height = parseInt(screen.availHeight * 0.5787);
	
	draw_context(20, 0.8);
}

window.onload = resize_window;