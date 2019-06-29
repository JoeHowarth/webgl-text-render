import {Engine, Mesh, RawTexture, Scene, ShaderMaterial, Texture, Vector4, VertexData} from "@babylonjs/core"
import fontInfo from "./sdfFont"

const fontTextureSrc = "font_sdf.png"
export function drawString(text: string, scene: Scene): Mesh {
  const material: ShaderMaterial = sdfMaterial(scene)
  let mesh = new Mesh("sdf_" + text, scene)
  mesh.material = material
  let vertexData = makeVerticesForString(text)
  vertexData.applyToMesh(mesh)
  console.log(vertexData)
  console.log(mesh)
  
  return mesh
}

export function sdfMaterial(scene: Scene): ShaderMaterial {
  let material = initShader(scene)
  const sdfTexture = new Texture(fontTextureSrc, scene, false, false)
  sdfTexture.onLoadObservable.add(() => {
    material.setTexture("u_texture", sdfTexture)
    // material.setFloat("u_buffer", 8)
    // material.setFloat("u_gamma", 3)
    console.log(material)
  })
  return material
}

const glyphs = "" +
    "abcdefghijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "123456788890-=[]\;',./`" +
    '!@#$%^&*()_+_+{}|:<>?~"'

type CharacterInfo = { originX: number; originY: number; x: number; width: number; y: number; height: number; advance: number }
function makeVerticesForString(s: string) {
  const len = s.length
  const numVertices = len * 6
  const positions = new Float32Array(numVertices * 2)
  const texcoords = new Float32Array(numVertices * 2)
  let offset = 0
  let x = 0
  const maxX = fontInfo.width
  const maxY = fontInfo.height
  const letterHeight = fontInfo.characters["a"].height
  const letterWidth = fontInfo.characters["a"].width
  for (let ii = 0; ii < len; ++ii) {
    const letter = s[ii]
    // @ts-ignore
    const glyphInfo = <CharacterInfo>fontInfo.characters[letter]
    console.log(glyphInfo)
    if (glyphInfo) {
      const x2 = x + glyphInfo.width
      const u1 = glyphInfo.x / maxX
      const v1 = (glyphInfo.y + glyphInfo.height - 1) / maxY
      const u2 = (glyphInfo.x + glyphInfo.width - 1) / maxX
      const v2 = glyphInfo.y / maxY
      console.log(x, x2, glyphInfo.height)
      console.log(u1,v1, u2, v2)
      
      // 6 vertices per letter
      positions[offset] = x;
      positions[offset + 1] = 0;
      texcoords[offset] = u1;
      texcoords[offset + 1] = v1;
      
      positions[offset + 2] = x2;
      positions[offset + 3] = 0;
      texcoords[offset + 2] = u2;
      texcoords[offset + 3] = v1;
      
      positions[offset + 4] = x;
      positions[offset + 5] = glyphInfo.height;
      texcoords[offset + 4] = u1;
      texcoords[offset + 5] = v2;
      
      positions[offset + 6] = x;
      positions[offset + 7] = glyphInfo.height;
      texcoords[offset + 6] = u1;
      texcoords[offset + 7] = v2;
      
      positions[offset + 8] = x2;
      positions[offset + 9] = 0;
      texcoords[offset + 8] = u2;
      texcoords[offset + 9] = v1;
      
      positions[offset + 10] = x2;
      positions[offset + 11] = glyphInfo.height
      texcoords[offset + 10] = u2;
      texcoords[offset + 11] = v2;
      
      x += glyphInfo.width + glyphInfo.advance;
      offset += 12;
    } else {
      // we don't have this character so just advance
      x += fontInfo.characters[' '].width;
    }
  }
  
  let vertexData = new VertexData()
  const pos = new Float32Array(numVertices * 3)
  const indices = new Uint16Array(numVertices)
  for (let i = 0; i < numVertices; i++) {
    pos[i*3] = positions[i*2]
    pos[i*3+1] = positions[i*2+1]
    pos[i*3+2] = 0
    indices[i] = i
  }
  vertexData.positions = pos
  vertexData.uvs = texcoords
  vertexData.indices = indices
  return vertexData
}

function initShader(scene: Scene): ShaderMaterial {
  let mat = new ShaderMaterial("sdf", scene, "./sdf",
      {
        attributes: ["position", "uv"],
        uniforms: ["worldViewProjection", "u_texture"]
      })
  {
    let cmTexture = new RawTexture(
        new Uint8Array([128, 128, 128, 255]), // data
        1, // width
        1, // height
        Engine.TEXTUREFORMAT_RGBA, // format
        scene,
        false, // gen mipmaps
        false, // invertY
        Texture.TRILINEAR_SAMPLINGMODE,
        Engine.TEXTURETYPE_UNSIGNED_INT
    )
    mat.setTexture("u_texture", cmTexture)
    // mat.setVector4("u_color", new Vector4(0.5,0.5,1,1))
  }
  return mat
}
