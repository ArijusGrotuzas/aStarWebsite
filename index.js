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

function draw_context(height, width, size){
	var canvas = document.getElementById('content');
	var ctx = canvas.getContext('2d');

	var arr = random_2d_array(size, size, 0.85);
	
	var cube_width = width/size;
	var cube_height = height/size;

	for (var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			if (arr[i][j] == 0){
				ctx.fillStyle = "white";
         		ctx.fillRect(cube_width * i, cube_height * j, cube_width, cube_height);
         		ctx.beginPath();
				ctx.rect(cube_width * i, cube_height * j, cube_width, cube_height);
				ctx.stroke();
			}
			else if(arr[i][j] == 1){
				ctx.fillStyle = "black";
         		ctx.fillRect(cube_width * i, cube_height * j, cube_width, cube_height);
			}
		}
	}
}

document.getElementById("refresh").addEventListener("click", function(e){
	e.preventDefault();

	var new_height = document.getElementById("height").value;
	var new_width = document.getElementById("width").value;
	var new_size = parseInt(document.getElementById("size").value);

	if (!new_height){
		new_height = canvas.height;
	}

	if(!new_width){
		new_width = canvas.width;
	}

	if(!new_size){
		new_size = 20;
	}

	document.getElementById("content").width = new_width;
	document.getElementById("content").height = new_height;

	draw_context(new_height, new_width, new_size);
});

window.onload = draw_context(500, 500, 20);