import type { IEdge, INode, IPath } from "@/utils/interfaces";
import type { TAllDistance, TAllPath, TFullPath } from "../types";

const setAncestor = (paths: TAllPath): TFullPath => {
    const fullPaths: TFullPath = {};

    for (const gate in paths) {
        fullPaths[gate] = {};
        for (const initialNode in paths[gate]) {
            const fullPathToNode: string[] = [];
            let currentNode: string | null = initialNode; // Começa pelo elemento atual

            while (currentNode !== null) {
                fullPathToNode.unshift(currentNode); // Adiciona no início do caminho
                currentNode = paths[gate][currentNode]; // Vai para o pai do atual
            }

            fullPaths[gate][initialNode] = fullPathToNode;
        }
    }

    return fullPaths;
};

export const formatPath = (
    nodes: INode[],
    edges: IEdge[],
    distances: TAllDistance,
    paths: TAllPath,
) => {
    const pathTable: IPath[] = [];

    const fullPaths = setAncestor(paths);
    const entranceNodes: string[] = [];
    const edgesToEntrance: { [key: string]: { entrance: string; length: number } } = {};

    nodes.forEach((node) => {
        if (node.active && node.type === "entrance") {
            entranceNodes.push(node.label);
        }
        edgesToEntrance[node.label] = { entrance: "", length: Infinity };
    });

    edges.forEach((edge) => {
        if (edge.active && entranceNodes.includes(edge.target)) {
            if (edge.length < edgesToEntrance[edge.source].length) {
                edgesToEntrance[edge.source] = { entrance: edge.target, length: edge.length };
            }
        }
    });

    console.log("Distances:", distances);
    console.log("Paths:", paths);
    console.log("Full Paths:", fullPaths);
    console.log("Entrance Nodes:", entranceNodes);
    console.log("Edges to entrance:", edgesToEntrance);

    for (const gate in distances) {
        for (const node in distances[gate]) {
            if (edgesToEntrance[node].entrance !== "") {
                console.log({
                    slot_length: distances[gate][node],
                    full_length: distances[gate][node] + edgesToEntrance[node].length,
                    gate: gate,
                    slot: node,
                    entrance: edgesToEntrance[node].entrance,
                    path: [...fullPaths[gate][node], edgesToEntrance[node].entrance],
                });
                pathTable.push({
                    slot_length: distances[gate][node],
                    full_length: distances[gate][node] + edgesToEntrance[node].length,
                    gate: gate,
                    slot: node,
                    entrance: edgesToEntrance[node].entrance,
                    path: [...fullPaths[gate][node], edgesToEntrance[node].entrance],
                });
            }
        }
    }

    return pathTable;
};
