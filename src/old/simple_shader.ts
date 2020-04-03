import {Matrix, Scene, ShaderMaterial, Vector3, Vector4} from "@babylonjs/core"

export default function(scene: Scene): ShaderMaterial {
  var shaderMaterial = new ShaderMaterial("simple_shader", scene, "./text1",
      {
        attributes: ["position"],
        uniforms: ["worldViewProjection"]
      })
  // shaderMaterial.setVector4("position", Vector4.FromVector3(Vector3.One(), 0))
  // shaderMaterial.setMatrix("matrix", Matrix.Identity())
  
  return shaderMaterial
}


