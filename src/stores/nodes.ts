import type { INode } from "@/services/interfaces";
import { defineStore } from "pinia";

export const useNodeStore = defineStore("nodes", {
    state: () => ({
        nodes: JSON.parse(localStorage.getItem("nodes") || "[]") as INode[],
    }),

    getters: {
        getNextId(state) {
            return state.nodes.length > 0 ? Math.max(...state.nodes.map((node) => node.id)) + 1 : 1;
        },
    },

    actions: {
        deleteNode(node: INode) {
            this.nodes = this.nodes?.filter((n) => n.id !== node.id) as INode[];
        },

        updateNode(node: INode) {
            const index = this.nodes.findIndex((n) => n.id === node.id);
            if (index !== -1) {
                this.nodes[index] = { ...node };
            }
        },

        addNode(node: INode) {
            this.nodes.push({ ...node });
        },

        persistNodes() {
            localStorage.setItem("nodes", JSON.stringify(this.nodes));
        },

        setNode(nodes: INode[]) {
            this.nodes = nodes;
        },
    },
    persist: true,
});
