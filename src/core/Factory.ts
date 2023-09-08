
export abstract class Factory<T> {

    constructor(
        protected readonly type: new () => T,
    ) {
    }

    /**
     * Builds a new component to this factories specification.
     * @param recycle Component of the same type to reuse if available.
     */
    public build(recycle?: T): T {
        return recycle ?? this.construct();
    }

    protected construct(): T {
        return new this.type();
    }

    public isInstance(component: unknown): component is T {
        return component?.constructor === this.type;
    }

}
