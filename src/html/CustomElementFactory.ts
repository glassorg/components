import { Factory } from "../core/Factory.js";
import { FunctionalComponent, createFunctionalComponentClass } from "../core/FunctionalComponent.js";
import { Constructor } from "../core/types.js";
import { CreateFunction, ElementFactory, ElementProperties, element } from "../dom/ElementFactory.js";
import { HTMLElementProperties, htmlElementToType } from "./elements.js";

type CustomElement<B extends HTMLElement, P extends HTMLElementProperties> = FunctionalComponent<B, P>;

export class CustomElementFactory<
    T extends CustomElement<HTMLElementTagNameMap[E], P>,
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
        return document.createElement(this.tagName, { is: this.extend }) as T;
    }

    protected override configure(node: T, properties: P): void {
        node.properties = properties;
    }

}

//  if base type is not specified then we extend span.
export function customElement<P extends ElementProperties>(
    tagName: string,
    update: (properties: P) => Factory<HTMLSpanElement>,
): CreateFunction<HTMLSpanElement, P>
//  if base type is specified then we must return a factory of that type from the render function
export function customElement<P extends ElementProperties, Extends extends keyof typeof htmlElementToType>(
    tagName: string,
    update: (properties: P) => Factory<HTMLElementTagNameMap[Extends]>,
    extend: Extends
): CreateFunction<HTMLElementTagNameMap[Extends], P>
export function customElement<P extends ElementProperties, Extends extends keyof typeof htmlElementToType>(
    tagName: string,
    render: (properties: P) => Factory<HTMLElementTagNameMap[Extends]>,
    extend?: Extends
): CreateFunction<HTMLElementTagNameMap[Extends], P> {
    const baseClass = extend ? htmlElementToType[extend] : HTMLElement;
    const newFunctionalClass = createFunctionalComponentClass(baseClass, render);
    customElements.define(tagName, newFunctionalClass, { extends: extend });
    return element<HTMLElementTagNameMap[Extends], P>(
        "http://www.w3.org/1999/xhtml",
        tagName,
        newFunctionalClass as unknown as Constructor<HTMLElementTagNameMap[Extends]>,
        (_namespace, tagName, type, properties) => new CustomElementFactory(tagName, type as any, properties, extend) as any
    );
}
