import type { TMqttCallback } from "@/services/types";
import mqtt from "mqtt/dist/mqtt.min";
import { Buffer } from "buffer";

class MqttService {
    private client: mqtt.MqttClient | null = null;
    private readonly url: string;
    private readonly options: mqtt.IClientOptions;
    private messageHandlers: Map<string, TMqttCallback> = new Map();

    constructor(
        brokerUrl: string = import.meta.env.VITE_MQTT_BROKER_URL,
        clientId: string = `${import.meta.env.VITE_MQTT_CLIENT_ID}-${Math.random().toString(16).substr(2, 8)}`,
    ) {
        this.url = brokerUrl;
        this.options = {
            clientId,
            reconnectPeriod: parseInt(import.meta.env.VITE_MQTT_RETRY_INTERVAL || "1000"),
            connectTimeout: parseInt(import.meta.env.VITE_MQTT_TIMEOUT || "30000"),
            maxReconnectAttempts: parseInt(import.meta.env.VITE_MQTT_MAX_RETRIES || "5"),
            keepalive: 60, // Ping a cada 60 segundos (valor ideal para ESP32)
            clean: false, // Mantém sessão ativa entre reconexões
            reschedulePings: true, // Ajusta pings automaticamente
            protocolId: "MQTT",
        };
    }

    async connect(): Promise<void> {
        if (this.client) return;

        return new Promise((resolve, reject) => {
            this.client = mqtt.connect(this.url, this.options);

            this.client.on("connect", () => {
                // clearTimeout(timeout);
                console.log("[MQTT] Connected to broker");
                resolve();
            });

            this.client.on("error", (error: unknown) => {
                // clearTimeout(timeout);
                console.error("[MQTT] Connection error:", error);
                reject(error);
            });

            this.client.on("close", () => console.log("[MQTT] Connection closed"));
            this.client.on("offline", () => console.log("[MQTT] Client offline"));
            this.client.on("reconnect", () => console.log("[MQTT] Reconnecting to broker..."));

            this.client.on("message", (topic: string, payload: Buffer) => {
                const handler = this.messageHandlers.get(topic);
                if (handler) {
                    handler(topic, payload.toString());
                }
            });
        });
    }

    disconnect() {
        this.client?.end();
        this.client = null;
        this.messageHandlers.clear();
    }

    publish(topic: string, message: string) {
        if (!this.client?.connected) {
            console.warn(`[MQTT] Not connected. Message not sent to ${topic}`);
            return;
        }
        this.client.publish(topic, message);
    }

    subscribe(topic: string, callback: TMqttCallback) {
        if (!this.client?.connected) {
            console.warn(`[MQTT] Not connected. Not subscribed to ${topic}`);
            return;
        }

        this.messageHandlers.set(topic, callback);
        this.client.subscribe(topic, (err: unknown) => {
            if (err) {
                console.error(`[MQTT] Error subscribing to ${topic}:`, err);
            } else {
                console.log(`[MQTT] Subscribed to ${topic}`);
            }
        });
    }

    unsubscribe(topic: string) {
        this.client?.unsubscribe(topic);
        this.messageHandlers.delete(topic);
    }
}

export default MqttService;
