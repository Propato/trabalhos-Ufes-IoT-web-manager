// src/stores/useGridStore.ts
import type { IOccupation } from "@/services/interfaces";
import { defineStore } from "pinia";

export const useOccupationStore = defineStore("occupation", {
    state: () => ({
        occupation: JSON.parse(localStorage.getItem("occupation") || "{}") as IOccupation,
        occupiedSlots: Number(localStorage.getItem("occupiedSlots") || "0"),
    }),

    actions: {
        persistOccupation() {
            localStorage.setItem("occupation", JSON.stringify(this.occupation));
        },

        persistOccupiedSlots() {
            localStorage.setItem("occupiedSlots", JSON.stringify(this.occupiedSlots));
        },

        addOccupation(slot: string) {
            this.occupation[slot] = true;
            this.occupiedSlots++;
        },

        deleteOccupation(slot: string) {
            delete this.occupation[slot];
            this.occupiedSlots--;
        },

        hasOccupation(slot: string): boolean {
            return !!this.occupation[slot];
        },
    },
    persist: true,
});
