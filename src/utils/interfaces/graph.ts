export interface INode {
    id: number;
    label: string;
    type: "gate" | "path" | "slot" | "entrance";
    active: boolean;
}

export interface IEdge {
    id: number;
    source: string;
    target: string;
    length: number;
    active: boolean;
}

export interface IPath {
    length: number;
    gate: string;
    slot: string;
    entrance: string;
    path: string[];
}
