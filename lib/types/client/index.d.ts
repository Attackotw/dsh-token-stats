interface SlotsServiceLike {
    inject(name: string, setup: () => any): any;
    register(options: {
        name: string;
        id: string;
        order?: number;
    }, component: (props: any) => any): () => void;
}
interface ClientContext {
    slots: SlotsServiceLike;
    effect(setup: () => () => void, label?: string): void;
}
export declare const inject: string[];
export declare function apply(ctx: ClientContext): void;
export {};
