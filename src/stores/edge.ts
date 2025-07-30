// src/stores/useGridStore.ts
import type { IEdge } from "@/utils/interfaces";
import { defineStore } from "pinia";

export const useEdgeStore = defineStore("edges", {
    state: () => ({
        edges: JSON.parse(localStorage.getItem("edges") || "[]") as IEdge[],
    }),

    getters: {
        getNextId(state) {
            return state.edges.length > 0 ? Math.max(...state.edges.map((edge) => edge.id)) + 1 : 1;
        },
    },

    actions: {
        deleteEdge(edge: IEdge) {
            this.edges = this.edges?.filter((n) => n.id !== edge.id) as IEdge[];
        },

        updateEdge(edge: IEdge) {
            const index = this.edges.findIndex((n) => n.id === edge.id);
            if (index !== -1) {
                this.edges[index] = { ...edge };
            }
        },

        addEdge(edge: IEdge) {
            this.edges.push({ ...edge });
        },

        persistEdges() {
            localStorage.setItem("edges", JSON.stringify(this.edges));
        },

        setEdge(edges: IEdge[]) {
            this.edges = edges;
            this.persistEdges();
        },
    },
    persist: true,
});
