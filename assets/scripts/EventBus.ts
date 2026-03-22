export class EventBus {
    private static instance: EventBus = null;
    private events: Map<string, Function[]> = new Map();

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    public on(event: string, callback: Function, context?: any): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        const boundCallback = context ? callback.bind(context) : callback;
        this.events.get(event).push(boundCallback);
        console.log(`[EventBus] Registered listener for '${event}'. Total listeners: ${this.events.get(event).length}`);
    }

    public off(event: string, callback: Function): void {
        if (!this.events.has(event)) return;

        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    public emit(event: string, data?: any): void {
        console.log(`[EventBus] Emitting '${event}'. Has listeners: ${this.events.has(event)}`);
        if (!this.events.has(event)) {
            console.warn(`[EventBus] No listeners registered for '${event}'`);
            return;
        }

        const callbacks = this.events.get(event);
        console.log(`[EventBus] Calling ${callbacks.length} listener(s) for '${event}'`);
        callbacks.forEach((callback, index) => {
            try {
                console.log(`[EventBus] Calling listener ${index + 1}/${callbacks.length}`);
                callback(data);
            } catch (error) {
                console.error(`[EventBus] Error in event '${event}':`, error);
            }
        });
    }

    public clear(): void {
        this.events.clear();
    }
}
