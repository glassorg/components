import * as BABYLON from "babylonjs"
import { Constructor } from "../../components/private/types.js"
import { ConfigureFactory } from "../../components/private/ConfigureFactory.js"
import { Factory } from "../../components/Factory.js"

export interface NodeProperties {
    name?: string
    children: Factory<BABYLON.Node>[]
}

export class NodeFactory<T extends BABYLON.Node, P extends NodeProperties> extends ConfigureFactory<T, P> {

    constructor(
        type: Constructor<T>,
        properties: P,
        protected readonly factoryFunction: (properties: P) => T,
        protected readonly ignoreProperties?: (keyof Required<Omit<P, "children">>)[]
    ) {
        super(type, properties)
    }

    protected override construct(): T {
        return this.factoryFunction(this.properties)
    }

    protected override configure(node: T, { children, ...properties }: P): void {
        if (this.ignoreProperties) {
            properties = { ...properties }
            for (let name of this.ignoreProperties) {
                delete properties[name]
            }
        }
        super.configure(node, properties as P)
        if (children) {
            this.buildChildren(node, children)
        }
    }

    protected buildChildren(node: T, childFactories: Factory<BABYLON.Node>[]) {
        let children = getChildren(node)
        let removeChildren: BABYLON.Node[] | undefined
        let length = Math.max(children?.length ?? 0, childFactories.length)
        for (let i = 0; i < length; i++) {
            let maybeRecycleChild = children?.[i]
            let childFactory = i < childFactories.length ? childFactories[i] : null
            if (maybeRecycleChild && childFactory && childFactory.isInstance(maybeRecycleChild)) {
                childFactory.build(maybeRecycleChild)
            }
            else {
                if (maybeRecycleChild) {
                    (removeChildren ??= []).push(maybeRecycleChild)
                }
                if (childFactory) {
                    let child = childFactory.build()
                    child.parent = node
                }
            }
        }
        if (removeChildren) {
            for (let i = removeChildren.length - 1; i >= 0; i--) {
                removeChildren[i].dispose()
            }
        }
    }

}

function getChildren(node: BABYLON.Node): BABYLON.Node[] | null {
    return (node as any)._children
}

export function babylonNode<T extends BABYLON.Node, P extends NodeProperties>(
    type: Constructor<T>,
    factoryFunction: (properties: P) => T,
    ignoreProperties?: (keyof Omit<P, "children">)[],
): CreateFunction<T, P> {
    function create(propertiesOrFirstChild: P, ...otherChildren: Factory<BABYLON.Node>[]): Factory<T> {
        let properties: P | undefined
        if (propertiesOrFirstChild instanceof Factory) {
            otherChildren.unshift(propertiesOrFirstChild)
        }
        else {
            properties = propertiesOrFirstChild
        }
        properties ??= {} as P
        properties.children = otherChildren
        console.log({ otherChildren })
        return new NodeFactory(type, properties, factoryFunction, ignoreProperties)
    }
    return create as unknown as CreateFunction<T, P>
}

type ChildrenType<P> = P extends { children: Array<infer C> } ? P["children"] : never[]

export type CreateFunction<T extends BABYLON.Node, P extends object> = { children } extends P ? {
    (properties: Omit<P, "children">, ...children: ChildrenType<P>): Factory<T>,
    (...children: ChildrenType<P>): Factory<T>,
} : {
    (properties: Omit<P, "children">, ...children: ChildrenType<P>): Factory<T>,
}

