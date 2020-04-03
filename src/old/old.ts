import {Mesh, Scene, StandardMaterial, Texture, Vector3, VertexData} from "@babylonjs/core"
import {initShader} from "@/old/text"

const src = "./8x8-font.png"
function sanityTexturedBox(scene: Scene) {
  let square = Mesh.CreateBox("box", 2, scene, true);
  let material = new StandardMaterial("asdf", scene)
  material.diffuseTexture = new Texture(src, scene);
  square.material = material
}

export function sanityTriangle(scene: Scene) {
  const glyphTex = new Texture(src, scene)
  let glyphMat = initShader(scene)
  glyphTex.onLoadObservable.add(() => {
    glyphMat.setTexture("u_texture", glyphTex)
    
    let vertexData = new VertexData()
    const pos = [-1, 2, -3, -3, -2, -3, 0, -2, -3]
    const uvs = [0, 1, 0, 0, 1, 0]
    vertexData.positions = new Float32Array(pos)
    vertexData.uvs = new Float32Array(uvs)
    vertexData.indices = new Uint16Array([0,1,2])
    // let normals: number[] = []
    // VertexData.ComputeNormals(vertexData.positions, vertexData.indices, normals)
    // vertexData.normals = new Float32Array(normals)
    
    let quad = new Mesh("quad_simple", scene)
    quad.position = Vector3.One()
    quad.material = glyphMat
    vertexData.applyToMesh(quad)
  })
  
}
