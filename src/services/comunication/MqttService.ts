import mqtt from "mqtt/dist/mqtt.min";
import { Buffer } from "buffer";

type MessageCallback = (topic: string, message: string) => void;

class MqttService {
    private client: mqtt.MqttClient | null = null;
    private readonly url: string;
    private readonly options: mqtt.IClientOptions;
    private messageHandlers: Map<string, MessageCallback> = new Map();

    constructor(brokerUrl: string, clientId: string) {
        this.url = brokerUrl;
        this.options = {
            clientId,
            reconnectPeriod: 2000,
            clean: true,
        };
    }

    async connect(timeoutMs = 5000): Promise<void> {
        if (this.client) return;

        return new Promise((resolve, reject) => {
            // Configura timeout
            const timeout = setTimeout(() => {
                reject(new Error("Timeout ao conectar ao broker MQTT"));
                this.disconnect();
            }, timeoutMs);

            this.client = mqtt.connect(this.url, this.options);

            this.client.on("connect", () => {
                clearTimeout(timeout);
                console.log("[MQTT] Conectado ao broker");
                resolve();
            });

            this.client.on("error", (error: unknown) => {
                clearTimeout(timeout);
                console.error("[MQTT] Erro na conexão:", error);
                reject(error);
            });

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
            console.error(`[MQTT] Não conectado. Mensagem não enviada para ${topic}`);
            return;
        }
        this.client.publish(topic, message);
    }

    subscribe(topic: string, callback: MessageCallback) {
        if (!this.client?.connected) {
            console.error(`[MQTT] Não conectado. Não inscrito em ${topic}`);
            return;
        }

        this.messageHandlers.set(topic, callback);
        this.client.subscribe(topic, (err: unknown) => {
            if (err) {
                console.error(`[MQTT] Erro ao inscrever em ${topic}:`, err);
            } else {
                console.log(`[MQTT] Inscrito em ${topic}`);
            }
        });
    }

    unsubscribe(topic: string) {
        this.client?.unsubscribe(topic);
        this.messageHandlers.delete(topic);
    }
}

export default MqttService;
