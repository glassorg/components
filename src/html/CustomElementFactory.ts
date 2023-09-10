import { Factory } from "../core/Factory.js";
import { FunctionalComponent, createFunctionalComponentClass } from "../core/FunctionalComponent.js";
import { Constructor } from "../core/types.js";
import { CreateFunction, ElementFactory, ElementProperties, element } from "../dom/ElementFactory.js";
import { HTMLElementProperties, HTMLElementTagNameMapExact, htmlElementToType } from "./elements.js";

type CustomElement<B extends HTMLElement, P extends HTMLElementProperties> = FunctionalComponent<B, P>;

export class CustomElementFactory<
    T extends CustomElement<HTMLElementTagNameMapExact[E], P>,
    P extends ElementProperties,
    E extends keyof typeof htmlElementToType,
> extends ElementFactory<T, P> {

    constructor(
        tagName: string,
        componentConstructor: Constructor<T>,
        properties: P,
        protected readonly extend?: E
    ) {
        super("http://www.w3.org/1999/xhtml", tagName, componentConstructor, properties);
    }

    protected override construct(): T {
        if (this.extend) {
            return document.createElement(this.extend, { is: this.tagName }) as T;
        }
        else {
            return document.createElement(this.tagName) as T;
        }
    }

    protected override configure(node: T, properties: P): void {
        super.addEvents(node, properties.events);
        node.properties = properties;
    }

}

let customElementCount = 0;
//  if base type is not specified then we extend span.
export function customElement<P extends ElementProperties>(
    update: (properties: P) => Factory<HTMLSpanElement & { tagName: "span" }>,
    options?: { tagName?: string }
): CreateFunction<HTMLSpanElement, P>
//  if base type is specified then we must return a factory of that type from the render function
export function customElement<P extends ElementProperties, Extends extends keyof typeof htmlElementToType>(
    update: (properties: P) => Factory<HTMLElementTagNameMapExact[Extends]>,
    options: { tagName?: string, extends: Extends }
): CreateFunction<HTMLElementTagNameMapExact[Extends], P>
export function customElement<P extends ElementProperties, Extends extends keyof typeof htmlElementToType>(
    render: (properties: P) => Factory<HTMLElementTagNameMapExact[Extends]>,
    options: { tagName?: string, extends?: Extends } = {}
): CreateFunction<HTMLElementTagNameMapExact[Extends], P> {
    const { tagName = `custom-element-${customElementCount++}` } = options;
    const baseClass = options.extends ? htmlElementToType[options.extends] : HTMLElement;
    const newFunctionalClass = createFunctionalComponentClass(baseClass, render);
    customElements.define(tagName, newFunctionalClass, { extends: options.extends });
    return element<HTMLElementTagNameMapExact[Extends], P>(
        "http://www.w3.org/1999/xhtml",
        tagName,
        newFunctionalClass as unknown as Constructor<HTMLElementTagNameMapExact[Extends]>,
        (_namespace, tagName, type, properties) => new CustomElementFactory(tagName, type as any, properties, options.extends) as any
    );
}
