// src/stores/useGridStore.ts
import type { IPath } from "@/services/interfaces";
import { defineStore } from "pinia";

export const usePathStore = defineStore("paths", {
    state: () => ({
        paths: JSON.parse(localStorage.getItem("paths") || "[]") as IPath[],
    }),

    actions: {
        persistPaths() {
            localStorage.setItem("paths", JSON.stringify(this.paths));
        },

        setPath(paths: IPath[]) {
            this.paths = paths;
            this.persistPaths();
        },
    },
    persist: true,
});
