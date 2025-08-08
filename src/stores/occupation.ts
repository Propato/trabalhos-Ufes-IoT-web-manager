// src/stores/useGridStore.ts
import type { IOccupation } from "@/services/interfaces";
import { defineStore } from "pinia";

export const useOccupationStore = defineStore("occupation", {
    state: () => ({
        occupation: JSON.parse(localStorage.getItem("occupation") || "{}") as IOccupation,
    }),

    actions: {
        persistOccupation() {
            localStorage.setItem("occupation", JSON.stringify(this.occupation));
        },

        addOccupation(slot: string) {
            this.occupation[slot] = true;
        },

        deleteOccupation(slot: string) {
            delete this.occupation[slot];
        },

        hasOccupation(slot: string): boolean {
            return !!this.occupation[slot];
        },
    },
    persist: true,
});
