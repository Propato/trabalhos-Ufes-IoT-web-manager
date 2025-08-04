import type { IEdge, INode } from "@/services/interfaces";
import type { TAllDistance, TAllPath, TDistance, TPath } from "@/services/types/dijkstra";

function getClosestNode(distances: TDistance, visited: Set<string>): string | null {
    let minKey: string | null = null;
    let minValue = Infinity;

    for (const key in distances) {
        if (!visited.has(key) && distances[key] < minValue) {
            minValue = distances[key];
            minKey = key;
        }
    }

    return minKey;
}

export function dijkstra(nodes: INode[], edges: IEdge[]) {
    const allDistances: TAllDistance = {}; // Create an object to store the shortest distance from all gates to every slot
    const allPaths: TAllPath = {}; // Create an object to store the shortest path from all gates to every slot

    const filteredEdges: { [key: string]: IEdge[] } = {};

    const initialDistances: TDistance = {}; // Create an object to store the shortest distance from the start node to every other node
    const initialPaths: TPath = {}; // Create an object to store the shortest path from the start node to every other node

    nodes.forEach((node) => {
        if (node.active && node.type !== "entrance" && node.type !== "gate") {
            filteredEdges[node.label] = edges.filter(
                (edge) => edge.active && edge.source === node.label,
            );
            initialDistances[node.label] = Infinity;
            initialPaths[node.label] = null;
        }
    });

    nodes.forEach((gate) => {
        if (gate.active && gate.type === "gate") {
            const visited = new Set<string>(); // A set to keep track of all visited nodes

            const distances: TDistance = { ...initialDistances }; // Create an object to store the shortest distance from the start node to every other node
            const paths: TPath = { ...initialPaths }; // Create an object to store the shortest path from the start node to every other node

            filteredEdges[gate.label] = edges.filter(
                (edge) => edge.active && edge.source === gate.label,
            );

            distances[gate.label] = 0; // The distance from the start node to itself is 0
            paths[gate.label] = null; // The path from the start node to itself is null

            // Loop until all nodes are visited
            while (true) {
                // Sort nodes by distance and pick the closest unvisited node
                const closestNode = getClosestNode(distances, visited);
                if (!closestNode) break; // If there's no reachable unvisited node, we're done

                // Mark the chosen node as visited
                visited.add(closestNode);

                // For each neighboring node of the current node
                for (const edge of filteredEdges[closestNode]) {
                    const neighbor = edge.target;

                    // If the neighbor hasn't been visited yet
                    if (!visited.has(neighbor)) {
                        // Calculate tentative distance to the neighboring node
                        const newDistance = distances[closestNode] + edge.length;

                        // If the newly calculated distance is shorter than the previously known distance to this neighbor
                        if (newDistance < distances[neighbor]) {
                            // Update the shortest distance to this neighbor
                            distances[neighbor] = newDistance;
                            paths[neighbor] = closestNode; // Update the path to this neighbor
                        }
                    }
                }
            }

            delete filteredEdges[gate.label];

            allDistances[gate.label] = distances;
            allPaths[gate.label] = paths;
        }
    });

    return { distances: allDistances, paths: allPaths };
}
