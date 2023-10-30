# A* example website

A naive implementation of an A* algorithm. The project features an iterface for specifiying two points on a grid and controls for movement. The black tiles are obstacles and the white tiles are available tiles.

The algorithm finds the shortest path at arriving to a given point by maximizing the `f` heuristic. The heuristic is determinded by `f = g + h`, where `g` is the distance from the current node to starting node, and `h` is the distance from current node to the goal node.
