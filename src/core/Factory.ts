import { Constructor } from "./types.js";

export abstract class Factory<T extends object> {

    constructor(
        protected readonly type: Constructor<T>,
    ) {
    }

    /**
     * Builds a new node to this factories specification.
     * @param recycle node of the same type to reuse if available.
     */
    public build(recycle?: T): T {
        return recycle ?? this.construct();
    }

    protected construct(): T {
        return new this.type();
    }

    public isInstance(node: unknown): node is T {
        return node?.constructor === this.type;
    }

}
