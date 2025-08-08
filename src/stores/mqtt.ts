// Na sua store (exemplo com Pinia)
import { defineStore } from "pinia";
import MqttService from "@/services/communication/MQTT/MqttService";
import { getAvailableSlot, freeSlot } from "@/services/functions/occupation";

export const useMqttStore = defineStore("mqtt", {
    state: () => ({
        mqttService: null as MqttService | null,
    }),
    actions: {
        async initializeMqtt(): Promise<boolean> {
            try {
                this.mqttService = new MqttService();
                await this.mqttService.connect();

                return true;
            } catch (error) {
                console.error("MQTT connection failed:", error);

                return false;
            }
        },

        connectMqtt() {
            this.mqttService?.subscribe(
                `${import.meta.env.VITE_MQTT_ROOT}/parking/entry`,
                (topic: string, message: string) => {
                    const path = getAvailableSlot(topic, message);
                    // if (path.slot !== "") {
                    //     console.log(`[MQTT] Available slot: ${path.slot} at gate ${message}`);
                    // } else {
                    //     console.log(`[MQTT] No available slot for gate: ${message}`);
                    // }
                    this.mqttService?.publish(
                        `${import.meta.env.VITE_MQTT_ROOT}/parking/entry/${message}/response`,
                        JSON.stringify(path),
                    );
                },
            );

            this.mqttService?.subscribe(
                `${import.meta.env.VITE_MQTT_ROOT}/parking/exit`,
                (topic: string, message: string) => {
                    freeSlot(message);
                },
            );
        },

        disconnect() {
            if (!this.mqttService) {
                console.error(`[MQTT] Already disconnected.`);
                return;
            }

            this.mqttService.disconnect();
            this.mqttService = null;
        },
    },
});
