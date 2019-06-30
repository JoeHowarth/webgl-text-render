import {Engine, Mesh, RawTexture, Scene, ShaderMaterial, Texture, VertexData} from "@babylonjs/core"
import font from "./sdfFont"
import {backgroundVertexDeclaration} from "@babylonjs/core/Shaders/ShadersInclude/backgroundVertexDeclaration"

const fontTextureSrc = "font_sdf.png"
export function drawString(text: string, scene: Scene): Mesh {
  const material: ShaderMaterial = sdfMaterial(scene)
  let mesh = new Mesh("sdf_" + text, scene)
  mesh.material = material
  let vertexData = makeVerticesForString(text)
  // let vertexData = getVertexData(text)
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
  const letterHeight = font.characters["a"].height
  const letterWidth = font.characters["a"].width
  for (let ii = 0; ii < len; ++ii) {
    const letter = s[ii]
    // @ts-ignore
    const glyphInfo = <CharacterInfo>font.characters[letter]
    console.log(glyphInfo)
    if (glyphInfo) {
      const x2 = x + glyphInfo.width
      const u1 = glyphInfo.x / font.width
      const v1 = (glyphInfo.y + glyphInfo.height) / font.height
      const u2 = (glyphInfo.x + glyphInfo.width) / font.width
      const v2 = glyphInfo.y / font.height
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
      
      x += glyphInfo.advance;
      offset += 12;
    } else {
      // we don't have this character so just advance
      x += font.characters[' '].width;
    }
  }
  
  let vertexData = new VertexData()
  const pos = new Float32Array(numVertices * 3)
  const indices = new Uint16Array(numVertices)
  for (let i = 0; i < numVertices; i++) {
    pos[i*3] = positions[i*2]      / font.characters['a'].width
    pos[i*3+1] = positions[i*2+1]  / font.characters['a'].width
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


function getVertexData(text: string): VertexData {
  let totalAdvance = 0
  // Measure how wide the text is
  for (var i = 0; i < text.length; i++) {
    // @ts-ignore
    totalAdvance += font.characters[text[i]].advance;
  }
  
  // Center the text at the origin
  // let x = -totalAdvance / 2
  let x = 0;
  const y = font.size / 2
  let verticesAndUvs = []
  const numVertices = text.length * 6;
  let vertices = new Float32Array( numVertices * 3)
  let uvs = new Float32Array(numVertices * 2)
  let indices = new Uint16Array(numVertices)
  
  // Add a quad for each character
  for (let i = 0; i < text.length; i++) {
    let c = <CharacterInfo>font.characters[text[i]];
    const vert = i * 6
    
    // p0 --- p1
    // | \     |
    // |   \   |
    // |     \ |
    // p2 --- p3
    
    var x0 = x - c.originX;
    var y0 = y - c.originY;
    var s0 = c.x / font.width;
    var t0 = c.y / font.height;
    
    var x1 = x - c.originX + c.width;
    var y1 = y - c.originY;
    var s1 = (c.x + c.width) / font.width;
    var t1 = c.y / font.height;
    
    var x2 = x - c.originX;
    var y2 = y - c.originY + c.height;
    var s2 = c.x / font.width;
    var t2 = (c.y + c.height) / font.height;
    
    var x3 = x - c.originX + c.width;
    var y3 = y - c.originY + c.height;
    var s3 = (c.x + c.width) / font.width;
    var t3 = (c.y + c.height) / font.height;
    let a = vert * 3
    vertices[a] = x0
    vertices[a + 1] = y0
    vertices[a + 2] = 0
    a += 3
    vertices[a] = x1
    vertices[a + 1] = y1
    vertices[a + 2] = 0
    a += 3
    vertices[a] = x3
    vertices[a + 1] = y3
    vertices[a + 2] = 0
    a += 3
    vertices[a] = x0
    vertices[a + 1] = y0
    vertices[a + 2] = 0
    a += 3
    vertices[a] = x3
    vertices[a + 1] = y3
    vertices[a + 2] = 0
    a += 3
    vertices[a] = x2
    vertices[a + 1] = y2
    vertices[a + 2] = 0
  
    let b = vert * 2
    uvs[b] = s0
    uvs[b+1] = t0
    b += 2
    uvs[b] = s1
    uvs[b+1] = t1
    b += 2
    uvs[b] = s3
    uvs[b+1] = t3
    b += 2
    uvs[b] = s0
    uvs[b+1] = t0
    b += 2
    uvs[b] = s3
    uvs[b+1] = t3
    b += 2
    uvs[b] = s2
    uvs[b+1] = t2
    
    // verticesAndUvs.push(x0, y0, s0, t0);
    // verticesAndUvs.push(x1, y1, s1, t1);
    // verticesAndUvs.push(x3, y3, s3, t3);
    //
    // verticesAndUvs.push(x0, y0, s0, t0);
    // verticesAndUvs.push(x3, y3, s3, t3);
    // verticesAndUvs.push(x2, y2, s2, t2);
    
    x += c.advance;
  }
  let data = new VertexData()
  data.positions = vertices
  data.uvs = uvs
  data.indices = indices
  return data
}
