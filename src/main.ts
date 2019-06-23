import Vue from "vue"
import App from "./App.vue"
import store from "./store"
import {Engine} from "@babylonjs/core/Engines/engine"
import {Scene} from "@babylonjs/core/scene"
import {Vector3} from "@babylonjs/core/Maths/math"
import {FreeCamera} from "@babylonjs/core/Cameras/freeCamera"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight"
import {Mesh} from "@babylonjs/core/Meshes/mesh"

import {CellMaterial} from "@babylonjs/materials/cell"
// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder"
import simple_shader from "@/simple_shader"

function main() {
  // Get the canvas element from the DOM.
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement
  canvas.width = window.innerWidth - 2
  canvas.height = window.innerHeight - 2
  
  const engine = new Engine(canvas)
  let scene = new Scene(engine)
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene)
  
  camera.setTarget(Vector3.Zero())
  camera.attachControl(canvas, true)
  
  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene)
  light.intensity = 0.7
  
  // let shaderMaterial = simple_shader(scene)
  const sphere = Mesh.CreateSphere("sphere1", 16, 2, scene)
  const material = new CellMaterial("grid", scene)
  
  sphere.material = material
  sphere.position.y = 2
  
  const ground = Mesh.CreateGround("ground1", 6, 6, 2, scene)
  ground.material = material
  
  
  engine.runRenderLoop(() => {
    // shaderMaterial.setMatrix("matrix", sphere.getWorldMatrix())
    sphere.position.x = (sphere.position.x + 0.1) % 10
    scene.render()
  })
}

window.addEventListener("load", main, false)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount("#app")
