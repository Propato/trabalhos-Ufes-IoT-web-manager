export interface INode {
    label: string;
    type: "gate" | "path" | "slot" | "door";
}

export interface IEdge {
    source: string;
    target: string;
    length: number;
}
