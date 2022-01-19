const directions = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}]

class Node {
	constructor(parent = null, position = null){
		this.parent = parent;
		this.position = position;

		this.g = 0;
		this.h = 0;
		this.f = 0;
	}
}

function comparePos(nodeA, nodeB){
	if (nodeA.position.x == nodeB.position.x && nodeA.position.y == nodeB.position.y){
		return true;
	}

	return false;
}

function manhattanDist(node, goalNode){
	var dist = Math.abs(node.position.x - goalNode.position.x) + Math.abs(node.position.y - goalNode.position.y);
	return dist;
}

function a_star(landscape, start, end, epochs){

	let startNode = new Node(null, start);
	let endNode = new Node(null, end);

	var openSet = [];
	var closedSet = [];

	openSet.push(startNode);

	var index = 0;
	while(openSet.length > 0 && index < epochs){

		// Initialize the first node in the open set as the current node
		var currentNode = openSet[0];
		var currentIndex = 0;

		// Find the node with the lowest 'f'
		for(var i = 0; i < openSet.length; i++){
			if(openSet[i].f < currentNode.f){
				currentNode = openSet[i];
				currentIndex = i;
			}
		}

		// Remove the node with the lowest 'f'
		openSet.splice(currentIndex, 1);

		// Add the node with the lowest 'f' to the closed set
		closedSet.push(currentNode);

		if(comparePos(currentNode, endNode)){
			var path = [];
			var current = currentNode;
			
			while (current){
				path.push(current.position);
				current = current.parent;
			}

			return path;
		}

		var children = [];

		// Generate successors of the current node
		for(var i = 0; i < directions.length; i++){
			var newPos = {x: currentNode.position.x + directions[i].x, y: currentNode.position.y + directions[i].y};

			// Check if the new position is within the boundaries of the map
			if(newPos.x < 0 || newPos.x > landscape.length - 1 || newPos.y < 0 || newPos.y > landscape.length - 1){
				continue;
			}

			// Check if the position is not an obstacle
			if(landscape[newPos.x][newPos.y] == 1){
				continue;
			}

			// Append each child to the children's set
			var child = new Node(currentNode, newPos);
			children.push(child);
		}

		// Calculate each child's heuristic function
		for(var i = 0; i < children.length; i++){

			// Get the child object
			var child = children[i];

			// Variable for ignoring the successor
			var skip = false

			for(var j = 0; j < closedSet.length; j++){
				if (comparePos(child, closedSet[j])){
					skip = true;
					break;
				}
			}

			if(!skip){
				// Evaluate the successors 'f' score
				child.g = currentNode.g + 1;
				child.h = manhattanDist(child, endNode);
				child.f = child.g + child.h;

				// Check if a node with the same position in open set has lower 'f' score
				for(var j = 0; j < openSet.length; j++){
					if (comparePos(child, openSet[j]) && child.g >= openSet[j].g){
						skip = true;
						break;
					}
				}
			}

			if(skip){
				continue;
				console.log(index);
			}

			openSet.push(children[i]);
		}

		index+=1;
	}

	return;
}