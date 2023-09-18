// import * as BABYLON from "babylonjs";
// import { Factory } from "../components/Factory.js"
// import { createFunctionalComponentClass } from "../components/private/FunctionalComponent.js"
// import { Constructor } from "../components/private/types.js"
// import { Component } from "../components/Component.js";

// class ComponentScene extends BABYLON.Scene implements Component {
//     get isConnected(): boolean {
//         return !this.isDisposed;
//     }
//     addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined): void {
//     }
//     removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined): void {
//     }
//     dispatchEvent(event: Event): boolean {
//         return false;
//     }
// }

// export interface CustomSceneProperties {
// }

// export function createCustomScene<P extends CustomSceneProperties>(
//     update: (this: BABYLON.Scene, properties: P) => Factory<ComponentScene>,
// ): (properties: P) => Factory<BABYLON.Scene> {
//     // const { tagName = `custom-element-${customElementCount++}` } = options;
//     // const baseClass = options.extends ? htmlElementToType[options.extends] : HTMLElement;
//     const newFunctionalClass = createFunctionalComponentClass(ComponentScene, update);
//     // customElements.define(tagName, newFunctionalClass, { extends: options.extends });
//     // return element<HTMLElementTagNameMapExact[Extends], P>(
//     //     "http://www.w3.org/1999/xhtml",
//     //     tagName,
//     //     newFunctionalClass as unknown as Constructor<HTMLElementTagNameMapExact[Extends]>,
//     //     (_namespace, tagName, type, properties) => new CustomElementFactory(tagName, type as any, properties, options.extends, options.shadow) as any
//     // );
//     throw ""
// }
