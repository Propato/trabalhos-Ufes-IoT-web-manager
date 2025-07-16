export interface INode {
    id: number;
    label: string;
    type: "gate" | "path" | "slot" | "door";
}

export interface IEdge {
    id: number;
    source: string;
    target: string;
    length: number;
}
