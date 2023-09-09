import { Factory } from "../core/Factory.js";
import { ConfigureFactory } from "../core/ConfigureFactory.js";
import { assignIfDifferent } from "../core/functions.js";
import { TextFactory } from "./TextFactory.js";
import { Constructor, Simplify } from "../core/types.js";

export type ElementProperties = {
    style?: Partial<CSSStyleDeclaration>,
    className?: string;
    id?: string;
    slot?: string;
    children: Factory<Node>[],
}

export type StyledElement = Element & { style: CSSStyleDeclaration };

type ElementNamespace = "http://www.w3.org/1999/xhtml" | "http://www.w3.org/2000/svg" | "http://www.w3.org/1998/Math/MathML";

export class ElementFactory<
    T extends StyledElement,
    Properties extends ElementProperties
> extends ConfigureFactory<T, Properties> {

    constructor(
        private readonly namespace: ElementNamespace,
        private readonly tagName: string,
        componentConstructor: Constructor<T>,
        properties: Properties
    ) {
        super(componentConstructor, properties);
    }

    protected override construct(): T {
        return document.createElementNS(this.namespace, this.tagName) as T;
    }

    protected override configure(node: T, { style, children, ...properties }: Properties): void {
        assignIfDifferent(node, properties);
        if (style) {
            assignIfDifferent(node.style, style);
        }
        if (children) {
            this.buildChildren(node, children);
        }
    }

    protected buildChildren(node: T, childFactories: Factory<Node>[]) {
        let maybeRecycleChild = node.firstChild;
        //  build the children recycling any old if possible
        for (let childFactory of childFactories) {
            if (maybeRecycleChild && childFactory.isInstance(maybeRecycleChild)) {
                childFactory.build(maybeRecycleChild);
                maybeRecycleChild = maybeRecycleChild!.nextSibling;
            }
            else {
                const childComponent = childFactory.build();
                if (maybeRecycleChild) {
                    node.insertBefore(childComponent, maybeRecycleChild);
                    node.removeChild(maybeRecycleChild);
                    maybeRecycleChild = childComponent.nextSibling;
                }
                else {
                    node.appendChild(childComponent);
                }
            }
        }
        //  remove any left over children
        while (maybeRecycleChild) {
            let nextSibling = maybeRecycleChild.nextSibling;
            node.removeChild(maybeRecycleChild);
            maybeRecycleChild = nextSibling;
        }
    }

}

// const foo = document.createElement("foo");

/**
 * @param namespace the element namespace
 * @param tagName  the element tag name
 * @param type the type of element
 * @returns a user friendly, well typed function for creating a specific element type.
 */
export function element<T extends StyledElement, P extends ElementProperties>(namespace: ElementNamespace, tagName: string, type: Constructor<T>, factoryType = ElementFactory): CreateFunction<T, P> {
    function create(propertiesOrFirstChild: P, ...otherChildren: (string | Factory<Node>)[]): Factory<T> {
        let properties: P | undefined;
        if (propertiesOrFirstChild instanceof Factory || typeof propertiesOrFirstChild === "string") {
            otherChildren.unshift(propertiesOrFirstChild);
            properties = {} as P;
        }
        else {
            properties = propertiesOrFirstChild;
        }
        properties.children = otherChildren.map(child => typeof child === "string" ? new TextFactory(child) : child);
        return new factoryType<T, P>(namespace, tagName, type, properties) as Factory<T>;
    }
    return create as unknown as CreateFunction<T, P>;
}

type AddStringIfTextAllowed<T> = T extends Factory<Node>[] ?
    (Factory<Text>[] extends T ? (string | T[number])[] : T) :
    T;

type ChildrenType<P extends ElementProperties> =
    AddStringIfTextAllowed<P["children"]>

export type CreateFunction<T extends StyledElement, P extends ElementProperties> = { children } extends P ? {
    (properties: Simplify<Omit<P, "children">>, ...children: ChildrenType<P>): Factory<T>,
    (...children: ChildrenType<P>): Factory<T>,
} : {
    (properties: Simplify<Omit<P, "children">>, ...children: ChildrenType<P>): Factory<T>,
};

