// src/stores/useGridStore.ts
import type { INode } from "@/utils/interfaces";
import { defineStore } from "pinia";

export const useNodeStore = defineStore("nodes", {
    state: () => ({
        nodes: <INode[] | null>[
            { label: "Tesla", type: "gate" },
            { label: "Ford", type: "path" },
            { label: "Toyota", type: "slot" },
        ],
    }),
    actions: {
        deleteNodeByIndex(index: number) {
            if (index !== -1) this.nodes?.splice(index, 1);
        },

        deleteNodeByLabel(label: string) {
            this.nodes = this.nodes?.filter((node) => node.label !== label) as INode[] | null;
        },
    },
    persist: true,
});
