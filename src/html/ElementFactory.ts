import { Factory } from "../Factory.js";
import { ConfigureFactory } from "../ConfigureFactory.js";
import { assignIfDifferent } from "../utility/objectFunctions.js";
import { TextFactory } from "./TextFactory.js";

export type ElementProperties<T> = {
    style?: Partial<CSSStyleDeclaration>,
    className?: string;
    id?: string;
    slot?: string;
    children?: Factory<Node>[],
}

type StyledElement = Element & { style: CSSStyleDeclaration };

type ElementNamespace = "http://www.w3.org/1999/xhtml" | "http://www.w3.org/2000/svg" | "http://www.w3.org/1998/Math/MathML";

export class ElementFactory<
    T extends StyledElement,
    Properties extends ElementProperties<T>
> extends ConfigureFactory<T, Properties> {

    constructor(
        protected readonly namespace: ElementNamespace,
        protected readonly tagName: string,
        componentConstructor: new () => T,
        properties: Properties
    ) {
        super(componentConstructor, properties);
    }

    protected override construct(): T {
        return document.createElementNS(this.namespace, this.tagName) as T;
    }

    protected override configure(component: T, { style, children, ...properties }: Properties): void {
        assignIfDifferent(component, properties);
        if (style) {
            assignIfDifferent(component.style, style);
        }
        if (children) {
            this.buildChildren(component, children);
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

    /**
     * @param namespace the element namespace
     * @param tagName  the element tag name
     * @param type the type of element
     * @returns a user friendly, well typed function for creating a specific element type.
     */
    static createFunction<T extends StyledElement, P extends ElementProperties<T>>(namespace: ElementNamespace, tagName: string, type: new () => T) {
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
            return new ElementFactory<T, P>(namespace, tagName, type, properties) as Factory<T>;
        }
        return create as CreateFunction<T, P>;
    }
}

type CreateFunction<T extends StyledElement, P extends ElementProperties<T>> = {
    (properties: P, ...children: (string | Factory<Node>)[]): Factory<T>,
    //  properties are optional IF no properties are actually required.
    (...children: {} extends P ? (string | Factory<Node>)[] : never): Factory<T>,
}
