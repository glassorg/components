import { Component } from "../Component.js"
import { BaseFactory } from "./BaseFactory.js"
import { objectsEqualShallow, requestAnimationFrameCallback } from "./functions.js"
import { Constructor } from "./types.js"

export type FunctionalComponent<BaseType extends Component = Component, Properties extends object = object> = BaseType & {
    properties: Properties
    hookIndex: number
    hooks: any[]
    requestUpdate()
}

export function createFunctionalComponentClass<C extends Component, P extends object>(
    baseClass: Constructor<C>,
    update: (properties: P) => BaseFactory<C>,
    updateCallback = requestAnimationFrameCallback
): Constructor<FunctionalComponent<C, P>> {
    class CustomFunctionalComponent extends (baseClass as Constructor<Component>) {
        private _properties?: P
        private _updateAndBuildRequestID?: number
        private _updateCount = 0

        public hookIndex: number = 0
        public readonly hooks: any[] = []

        constructor() {
            super()
            this.updateAndBuild = this.updateAndBuild.bind(this)   //  bind so we can pass to requestUpdate as callback

            // this.addEventListener("connected", () => {
            //     this.requestUpdateAndBuild()
            // })
            // this.addEventListener("disconnected", () => {
            //     if (this._updateAndBuildRequestID) {
            //         updateCallback.cancel(this._updateAndBuildRequestID)
            //     }
            // })
        }

        get properties(): P {
            return this._properties!
        }
        set properties(value: P) {
            if (!this._properties || !objectsEqualShallow(value, this._properties)) {
                this._properties = value
                this.requestUpdate()
            }
        }

        requestUpdate() {
            console.log("requestUpdateAndBuild", { this: this })
            if (!this._updateCount && this.isConnected) {
                this.updateAndBuild()
            }
            else {
                this._updateAndBuildRequestID ??= updateCallback.request(this.updateAndBuild)
            }
        }

        public updateAndBuild() {
            this._updateCount++
            this._updateAndBuildRequestID = undefined
            if (!this.isConnected) {
                return
            }

            console.log(`updateAndBuild`, { this: this })

            this.hookIndex = 0
            activeFunctionalComponentStack.push(this)
            try {
                let factory = update.call(this, this.properties)
                factory.build(this as any)
            }
            finally {
                activeFunctionalComponentStack.pop()
            }
        }
    }
    return CustomFunctionalComponent as any
}

const activeFunctionalComponentStack: FunctionalComponent[] = []
export function getActiveFunctionalComponent() {
    return activeFunctionalComponentStack[activeFunctionalComponentStack.length - 1]
}