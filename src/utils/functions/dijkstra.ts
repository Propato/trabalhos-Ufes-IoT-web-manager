import type { IEdge, INode } from "@/utils//interfaces";

function getClosestNode(distances: { [key: string]: number }, visited: Set<string>): string | null {
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

export function dijkstra(gateLabel: string, nodes: INode[], edges: IEdge[]) {
    const distances: { [key: string]: number } = {}; // Create an object to store the shortest distance from the start node to every other node
    const paths: { [key: string]: string | null } = {}; // Create an object to store the shortest path from the start node to every other node
    const visited = new Set<string>(); // A set to keep track of all visited nodes

    // Get all the nodes of the graph
    const filteredNodes: { [key: string]: INode } = {};
    const filteredEdges: { [key: string]: IEdge[] } = {};

    nodes.forEach((node) => {
        if (
            node.active &&
            (node.type === "slot" || node.type === "path" || node.label === gateLabel)
        ) {
            filteredNodes[node.label] = node;

            filteredEdges[node.label] = edges.filter(
                (edge) => edge.active && edge.source === node.label,
            );

            distances[node.label] = Infinity;
            paths[node.label] = null;
        }
    });
    distances[gateLabel] = 0; // The distance from the start node to itself is 0

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

    return { distances: distances, paths: paths };
}
