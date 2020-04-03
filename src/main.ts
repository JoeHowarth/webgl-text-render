import Vue from "vue"
import App from "./App.vue"
import store from "./old/store"
import {Engine} from "@babylonjs/core/Engines/engine"
import {Scene} from "@babylonjs/core/scene"
import {Vector3} from "@babylonjs/core/Maths/math"
import {FreeCamera} from "@babylonjs/core/Cameras/freeCamera"
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight"
import {Mesh} from "@babylonjs/core/Meshes/mesh"

import {CellMaterial} from "@babylonjs/materials/cell"
// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder"
import {drawText} from "@/old/text"
import {drawString} from "@/old/sdf"

function main() {
  // Get the canvas element from the DOM.
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement
  canvas.width = window.innerWidth - 2
  canvas.height = window.innerHeight - 2
  
  const engine = new Engine(canvas)
  let scene = new Scene(engine)
  const camera = new FreeCamera("camera1", new Vector3(3, 5, -20), scene)
  
  camera.setTarget(new Vector3(2, 1, 0))
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
  
  // let text1 = drawText("hi", scene)
  // text1.sca
  let mesh = drawString("This is my text!!, isn't it awesomely clippy?!?!", scene)
  // let mesh = drawString("ab c", scene)
  mesh.position = new Vector3(-5, 1, 10)
  let t = 1
  engine.runRenderLoop(() => {
    // shaderMaterial.setMatrix("matrix", sphere.getWorldMatrix())
    sphere.position.x = (sphere.position.x + 0.1) % 10
    mesh.position.z = t * t
    // t =  (t + 0.051) % 50
    scene.render()
  })
}

window.addEventListener("load", main, false)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount("#app")
