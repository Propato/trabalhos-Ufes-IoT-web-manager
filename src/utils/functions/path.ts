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
    const entranceEdges: TAllDistance = {};

    nodes.forEach((entranceNode) => {
        if (entranceNode.active && entranceNode.type === "entrance") {
            entranceNodes.push(entranceNode.label);
            entranceEdges[entranceNode.label] = {};
        }
    });

    edges.forEach((edgeToEntrance) => {
        if (edgeToEntrance.active && entranceNodes.includes(edgeToEntrance.target)) {
            entranceEdges[edgeToEntrance.target][edgeToEntrance.source] = edgeToEntrance.length;
        }
    });

    for (const gate in distances) {
        for (const node in distances[gate]) {
            for (const entrance in entranceEdges) {
                if (!!entranceEdges[entrance][node]) {
                    pathTable.push({
                        slot_length: distances[gate][node],
                        full_length:
                            distances[gate][node] + (entranceEdges[entrance][node] || Infinity),
                        gate: gate || "",
                        slot: fullPaths[gate][node][fullPaths[gate][node].length - 1] || "",
                        entrance: entrance,
                        path: [...fullPaths[gate][node], entrance],
                    });
                }
            }
        }
    }

    return pathTable;
};
