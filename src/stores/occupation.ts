// src/stores/useGridStore.ts
import HttpService from "@/services/communication/HTTP/HttpService";
import type { IOccupation } from "@/services/interfaces";
import { defineStore } from "pinia";

export const useOccupationStore = defineStore("occupation", {
    state: () => ({
        occupation: {} as IOccupation,
        occupiedSlots: 0,
        httpService: null as HttpService | null,
    }),

    actions: {
        addOccupation(slot: string, telemetry = true) {
            this.occupation[slot] = true;
            this.occupiedSlots++;

            if (telemetry) {
                this.sendOccupationTelemetry();
            }
        },

        deleteOccupation(slot: string, telemetry = true) {
            delete this.occupation[slot];
            this.occupiedSlots--;

            if (telemetry) {
                this.sendOccupationTelemetry();
            }
        },

        hasOccupation(slot: string): boolean {
            return !!this.occupation[slot];
        },

        initializeHttpService() {
            if (!this.httpService) {
                const baseUrl = import.meta.env.VITE_HTTP_TELEMETRY_BASE_URL;
                this.httpService = new HttpService(baseUrl);
            }
        },

        async sendOccupationTelemetry() {
            try {
                if (!this.httpService) {
                    this.initializeHttpService();
                }

                const deviceToken = import.meta.env.VITE_DEVICE_TOKEN;
                const endpoint = `/api/v1/${deviceToken}/telemetry`;

                const payload = {
                    Occupation: this.occupiedSlots,
                };

                await this.httpService?.post(endpoint, payload);
            } catch (error) {
                console.error("[HTTP] Telemetry failed:", error);
            }
        },
    },
    // persist: true,
});
