import * as BABYLON from "babylonjs"
import { Vector3, Quaternion } from "babylonjs"
import { NodeProperties, babylonNode } from "./private/NodeFactory.js"

export const BabylonNode = babylonNode(BABYLON.Node, ({ name = "Node" }: NodeProperties) => new BABYLON.Node(name))

interface FreeCameraProperties extends NodeProperties {
    position: Vector3
    target: Vector3
    children: never[]
    attach?: HTMLCanvasElement
}
export const FreeCamera = babylonNode(BABYLON.FreeCamera, ({ name = "FreeCamera", position, attach }: FreeCameraProperties) => {
    const node = new BABYLON.FreeCamera(name, position)
    node.attachControl(attach, true)
    return node
}, ["attach"])

interface HemisphericLightProperties extends NodeProperties {
    direction: Vector3
    intensity?: number
    children: never[]
}
export const HemisphericLight = babylonNode(BABYLON.HemisphericLight, ({ name = "HemisphericLight", direction }: HemisphericLightProperties) => new BABYLON.HemisphericLight(name, direction))

interface TransformProperties extends NodeProperties {
    position?: Vector3
    rotation?: Vector3
    rotationQuaternion?: Quaternion
    scaling?: Vector3
}
export const Transform = babylonNode(BABYLON.TransformNode, ({ name = "TransformNode" }: TransformProperties) => new BABYLON.TransformNode(name))

interface SphereProperties extends TransformProperties {
    diameter: number
    segments: number
}
export const Sphere = babylonNode(BABYLON.Mesh, ({ name = "Sphere", diameter, segments }: SphereProperties) => BABYLON.MeshBuilder.CreateSphere(name, { diameter, segments }))

interface GroundProperties extends TransformProperties {
    width: number
    height: number
}
export const Ground = babylonNode(BABYLON.Mesh, ({ name = "Ground", width, height }: GroundProperties) => BABYLON.MeshBuilder.CreateGround(name, { width, height }))
