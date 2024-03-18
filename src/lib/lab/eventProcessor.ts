export class EventProcessor {
    private subscriberMap: Record<string | number, ((payload?: any) => void)[]> = {};

    dispatchEvent(topic: string | number, payload?: any) {
        this.subscriberMap[topic!] && this.subscriberMap[topic!]?.forEach((callback) => callback(payload));
    }

    subscribe(topic: string | number, callback: (payload?: any) => void) {
        if (!this.subscriberMap[topic]) {
            this.subscriberMap[topic] = [];
        }
        if (this.subscriberMap[topic].map((cb) => cb.name).includes(callback.name)) {
            return;
        }
        this.subscriberMap[topic].push(callback);
    }

    unsubscribe(topic: string | number, callback: (payload?: any) => void) {
        if (!this.subscriberMap[topic]) return;
        this.subscriberMap[topic] = this.subscriberMap[topic].filter((cb) => cb.name !== callback.name);
    }
}

export const eventProcessor = new EventProcessor();