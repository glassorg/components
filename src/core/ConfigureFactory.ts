import { Factory } from "./Factory.js";
import { assignIfDifferent } from "./functions.js";

export class ConfigureFactory<T, Properties = Partial<T>> extends Factory<T> {

    constructor(
        type: new () => T,
        protected readonly properties: Properties,
    ) {
        super(type);
    }

    /**
     * Builds a new component to this factories specifications.
     * @param recycle Component of the same type to reuse if available.
     */
    public build(recycle?: T): T {
        const component = super.build(recycle);
        this.configure(component, this.properties);
        return component;
    }

    protected configure(component: T, properties: Properties) {
        assignIfDifferent(component, properties);
    }

}
