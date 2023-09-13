import { Factory } from "../core/Factory.js";
import { FunctionalComponent, createFunctionalComponentClass } from "../core/FunctionalComponent.js";
import { Constructor } from "../core/types.js";
import { CreateFunction, ElementFactory, ElementProperties, element } from "../dom/ElementFactory.js";
import { htmlElementToType } from "./elements.html.generated.js";
import { HTMLElementProperties, HTMLElementTagNameMapExact } from "./elements.js";

type CustomElement<B extends HTMLElement, P extends HTMLElementProperties> = FunctionalComponent<B, P>;

type ShadowMode = boolean; // "open" | "closed";

export class CustomElementFactory<
    T extends CustomElement<HTMLElementTagNameMapExact[E], P>,
    P extends ElementProperties,
    E extends keyof typeof htmlElementToType,
> extends ElementFactory<T, P> {

    constructor(
        tagName: string,
        componentConstructor: Constructor<T>,
        properties: P,
        protected readonly extend?: E,
        protected readonly shadow?: boolean
    ) {
        super("http://www.w3.org/1999/xhtml", tagName, componentConstructor, properties);
    }

    protected override construct(): T {
        const element = document.createElement(this.extend ?? this.tagName, { is: this.extend ? this.tagName : undefined }) as T;
        if (this.shadow) {
            element.attachShadow({ mode: "open" });
        }
        return element;
    }

    protected override configure(node: T, properties: P): void {
        super.addEvents(node, properties.on);
        node.properties = properties;
    }

}

let customElementCount = 0;
//  if base type is not specified then we extend span.
export function customElement<P extends ElementProperties>(
    update: (this: HTMLSpanElement, properties: P) => Factory<HTMLSpanElement & { tagName: "span" }>,
    options?: { tagName?: string, shadow?: ShadowMode }
): CreateFunction<HTMLSpanElement, P>
//  if base type is specified then we must return a factory of that type from the render function
export function customElement<P extends ElementProperties, Extends extends keyof typeof htmlElementToType>(
    update: (this: HTMLElementTagNameMapExact[Extends], properties: P) => Factory<HTMLElementTagNameMapExact[Extends]>,
    options: { tagName?: string, shadow?: ShadowMode, extends: Extends }
): CreateFunction<HTMLElementTagNameMapExact[Extends], P>
export function customElement<P extends ElementProperties, Extends extends keyof typeof htmlElementToType>(
    update: (this: HTMLElementTagNameMapExact[Extends], properties: P) => Factory<HTMLElementTagNameMapExact[Extends]>,
    options: { tagName?: string, shadow?: ShadowMode, extends?: Extends } = {}
): CreateFunction<HTMLElementTagNameMapExact[Extends], P> {
    const { tagName = `custom-element-${customElementCount++}` } = options;
    const baseClass = options.extends ? htmlElementToType[options.extends] : HTMLElement;
    const newFunctionalClass = createFunctionalComponentClass(baseClass, update);
    customElements.define(tagName, newFunctionalClass, { extends: options.extends });
    return element<HTMLElementTagNameMapExact[Extends], P>(
        "http://www.w3.org/1999/xhtml",
        tagName,
        newFunctionalClass as unknown as Constructor<HTMLElementTagNameMapExact[Extends]>,
        (_namespace, tagName, type, properties) => new CustomElementFactory(tagName, type as any, properties, options.extends, options.shadow) as any
    );
}
