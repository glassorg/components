import { Factory } from "./Factory.js";
import { assignIfDifferent } from "./functions.js";

export abstract class ConfigureFactory<T extends object, Properties = Partial<T>> extends Factory<T> {

    constructor(
        type: new () => T,
        protected readonly properties: Properties,
    ) {
        super(type);
    }

    /**
     * Builds a new node to this factories specifications.
     * @param recycle node of the same type to reuse if available.
     */
    public build(recycle?: T): T {
        const node = super.build(recycle);
        this.configure(node, this.properties);
        return node;
    }

    protected configure(node: T, properties: Properties) {
        assignIfDifferent(node, properties);
    }

    // // public abstract watch(node: T, callback: Callback<boolean>): Unwatch;
    // public abstract toComponent: ClassExtender<T, Observable<{ connected: boolean }>>

}
