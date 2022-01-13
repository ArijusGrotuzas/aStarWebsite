// Get the canvas and the context to draw on.
var canvas = document.getElementById('content');
var ctx = canvas.getContext('2d');

// Array for storing white tiles, e.g. white tiles.
var squares = [];

// Variable for storing the width of each tile.
var square_width = null;

// Variable for storing the height of each tile.
var square_height = null;

var previous_square = {};
var current_square = {};

/*	Function for creating a random array filler with either zero or one.
	The function takes in the height and width of desired array and a
	ratio of zero's to ones, as arguments*/
function random_2d_array(height, width, ratio){
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

// Function for converting page mouse coordinates to canvas coordinates.
function windowToCanvas(canvas, x, y) {
	var bbox = canvas.getBoundingClientRect();
	return {x: Math.round(x - bbox.left * (canvas.width  / bbox.width)), y: Math.round(y - bbox.top  * (canvas.height / bbox.height))};
}


// Function that draws the grid.
function draw_context(height, width, size, ratio){
	// Reset the array of tiles and the previous current tile.
	squares = []
	previous_square = {};
	current_square = {};

	var arr = random_2d_array(size, size, ratio);

	square_width = width/size;
	square_height = (height - 20)/size;

	for (var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			if (arr[i][j] == 0){
				drawSquare("white", square_width * i, square_height * j + 20, square_width, square_height);
				squares.push({x: (square_width * i) + (square_width/2), y: (square_height * j) + 20 + (square_height/2)});
			}
			else if(arr[i][j] == 1){
				drawSquare("black", square_width * i, square_height * j + 20, square_width, square_height);
			}
		}
	}
}

// MouseOver event listener attached to the canvas element.
document.getElementById("content").onmousemove = function (e) {
	var loc = windowToCanvas(canvas, e.clientX, e.clientY);

	ctx.font = "18px Arial";
	ctx.fillStyle = "grey";
	ctx.fillRect(0, 0, canvas.width, 20);
	ctx.fillStyle = "white";
	ctx.fillText("x: " + loc.x.toString() + ", y: " + loc.y.toString(), canvas.width/2 - 50, 15);
};


// Click event listener attached to the canvas element.
document.getElementById("content").addEventListener("click", function(e){

	// Get the position of mouse inside the canvas
	var loc = windowToCanvas(canvas, e.clientX, e.clientY);

	// If current square is initialized, initialize previous square
	if (current_square){
		previous_square = {x: current_square.x, y: current_square.y};
	}

	var shortest_diff = square_width/2;
	var valid_tile = false;

	// Array that loops through all the tiles and check's which tile was clicked.
	for(var i = 0; i < squares.length; i++){

		// Euclidean distance between current mouse coordinate and the n-th tile.
		var diff = Math.sqrt(Math.pow(squares[i].x - loc.x, 2) + Math.pow(squares[i].y - loc.y, 2));

		// If the distance is less than radius of a tile, then we found the correct tile.
		if(diff < shortest_diff){
			shortest_diff = diff;
			current_square = squares[i];
			valid_tile = true;
		}
	}

	if (valid_tile){
		/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Draw current square ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		drawSquare("red", current_square.x - (square_width/2), current_square.y - (square_height/2), square_width, square_height);

		if (!(previous_square.x == current_square.x) || !(previous_square.y == current_square.y)){
			/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Remove previous square ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			drawSquare("white", previous_square.x - (square_width/2), previous_square.y - (square_height/2), square_width, square_height);
		}
	}	
})

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

	draw_context(parseInt(screen.availWidth * 0.325), parseInt(screen.availHeight * 0.5787), new_size, new_ratio);
});

function resize_window(){
	var canvas = document.getElementById("content");
	canvas.width = parseInt(screen.availWidth * 0.325);
	canvas.height = parseInt(screen.availHeight * 0.5787);

	draw_context(parseInt(screen.availWidth * 0.325), parseInt(screen.availHeight * 0.5787), 20, 0.85);
}

window.onload = resize_window;

