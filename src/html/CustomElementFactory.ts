import { Component } from "../core/Component.js";
import { ConfigureFactory } from "../core/ConfigureFactory.js";
import { Constructor } from "../core/types.js";
import { CreateFunction, ElementFactory, ElementProperties } from "../dom/ElementFactory.js";

type CustomElement<P> = Component<P> & HTMLElement;

export class CustomElementFactory<
    T extends CustomElement<P>,
    P extends ElementProperties
> extends ElementFactory<T, P> {

    constructor(
        namespace: "http://www.w3.org/1999/xhtml",
        tagName: string,
        componentConstructor: Constructor<T>,
        properties: P
    ) {
        super(namespace, tagName, componentConstructor, properties);
    }

    protected override configure(node: T, properties: P): void {
        node.properties = properties;
    }

    // public static createFunction<T extends CustomElement<P>, P extends ElementProperties>(): CreateFunction<T,P> {
    //     throw "";
    // }

}

