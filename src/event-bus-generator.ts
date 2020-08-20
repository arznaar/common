export interface Options {
    throwIfNoSubscribers: boolean;
    parallelExecution: boolean;
}

export const createEventBus = <Events extends { [event: string]: unknown }>(options?: Options) => {
    type Handler<T extends keyof Events> = (payload: Events[T]) => Promise<void> | void;
    const subscribers = new Map<keyof Events, Handler<keyof Events>[]>();

    const publish = async <T extends keyof Events>(event: T, payload: Events[T]) => {
        const handlers = subscribers.get(event);
        if (!handlers) {
            if (options?.throwIfNoSubscribers) {
                throw new Error(errorNoSubscribers);
            }
            return;
        }

        if (options?.parallelExecution) {
            await Promise.all(handlers.map((x) => x(payload)));
        } else {
            for (const handler of handlers) {
                await handler(payload);
            }
        }
    };

    const subscribe = <T extends keyof Events>(event: T, handler: Handler<T>) => {
        const handlers = subscribers.get(event) || [];
        // HACK: map types aren't perfect
        // @ts-expect-error
        subscribers.set(event, [...handlers, handler]);
    };
    return {
        publish,
        subscribe,
    };
};

export const errorNoSubscribers = "event-bus-generator-no-subscribers";
