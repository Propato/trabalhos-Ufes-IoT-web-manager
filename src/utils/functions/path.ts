import type { IEdge, INode } from "@/utils/interfaces";

interface IPath {
    slot_length: number;
    full_length: number;
    gate: string;
    slot: string;
    entrance: string;
    path: string[];
}

const setAncestor = (paths: { [key: string]: string | null }): { [key: string]: string[] } => {
    const completePaths: { [key: string]: string[] } = {};

    for (const p in paths) {
        const caminho: string[] = [];
        let atual: string | null = p; // Começa pelo elemento atual

        while (atual !== null && atual in paths) {
            caminho.unshift(atual); // Adiciona no início do caminho
            atual = paths[atual]; // Vai para o pai do atual
        }

        completePaths[p] = caminho;
    }

    return completePaths;
};

export const setPath = (
    nodes: INode[],
    edges: IEdge[],
    distances: { [key: string]: number },
    paths: { [key: string]: string | null },
) => {
    const completePaths: IPath[] = [];

    const fullPaths = setAncestor(paths);
    const entranceNodes: string[] = [];
    const entranceEdges: { [key: string]: { [key: string]: number } } = {};

    nodes.forEach((element) => {
        if (element.active && element.type === "entrance") {
            entranceNodes.push(element.label);
        }
    });

    edges.forEach((element) => {
        if (element.active && entranceNodes.includes(element.target)) {
            entranceEdges[element.target] = entranceEdges[element.target] || {};
            entranceEdges[element.target][element.source] = element.length;
        }
    });

    Object.keys(distances).forEach((d) => {
        Object.keys(entranceEdges).forEach((e) => {
            if (!!entranceEdges[e][d]) {
                completePaths.push({
                    slot_length: distances[d],
                    full_length: distances[d] + (entranceEdges[e][d] || 0),
                    gate: fullPaths[d][0] || "",
                    slot: fullPaths[d][fullPaths[d].length - 1] || "",
                    entrance: e,
                    path: [...fullPaths[d], e],
                });
            }
        });
    });

    return completePaths;
};
