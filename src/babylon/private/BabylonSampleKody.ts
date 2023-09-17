import * as BABYLON from "babylonjs"
import { Vector3 } from "babylonjs"
import { createCustomElement } from "../../html/createCustomElement.js"
import { useState } from "../../hooks/useState.js"
import { BabylonNode, FreeCamera, Ground, HemisphericLight, Sphere, Transform } from "../nodes.js"
import { Canvas } from "../../html/elements.js"
import { useMemo } from "../../hooks/useMemo.js"

export const BabylonSampleKody = createCustomElement(function () {
    const canvas = this

    const engine = useMemo(() => new BABYLON.Engine(canvas, true));
    const [scene, setScene] = useState(() => new BABYLON.Scene(engine));

    const [ground, setGround] = useState(true)

    const sceneRootName = "scene-root"
    Transform(
        { scene, name: sceneRootName },
        FreeCamera({ scene, position: new Vector3(0, 5, -10), target: Vector3.Zero() }),
        HemisphericLight({ scene, direction: new Vector3(0, 1, 0), intensity: 0.7 }),
        Transform({ scene, position: new Vector3(0, 0, 0) },
            Sphere({ scene, diameter: 1.3, segments: 32, position: new Vector3(0, 1, 0) }),
            Sphere({ scene, diameter: 2.2, segments: 32, position: new Vector3(0, 2, 0) }),
            Sphere({ scene, diameter: 3, segments: 32, position: new Vector3(0, 3, 0) }),
            ground ? Ground({ scene, name: "ground", width: ground ? 8 : 0, height: 4 }) : null,
        ),
    ).build(scene.getTransformNodeByName(sceneRootName) ?? undefined)

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render()
    })

    return Canvas({
        width: 400, height: 250, style: { background: "beige", border: "solid 1px black" },
        on: { click: e => { setGround(!ground) } }
    })
}, { extends: "canvas" })

