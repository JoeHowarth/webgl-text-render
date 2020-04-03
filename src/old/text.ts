import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial'
import {
  BoxBuilder,
  DynamicTexture,
  Engine,
  Mesh,
  RawTexture,
  Scene, StandardMaterial,
  Texture,
  Vector3,
  VertexData
} from "@babylonjs/core"
import {fresnelFunction} from "@babylonjs/core/Shaders/ShadersInclude/fresnelFunction"

const src = "./8x8-font.png"

export function drawText(text: string, scene: Scene): Mesh {
  let glyphTex = new Texture(src, scene, false, false)
  let glyphMat = initShader(scene)
  glyphTex.onLoadObservable.add(() => {
    glyphMat.setTexture("u_texture", glyphTex)
    console.log(glyphTex)
  })
  
  let quads = new Mesh("quad", scene)
  quads.position = Vector3.Zero()
  let vertexData = new VertexData()
  let verts = makeVerticesForString(fontInfo, text)
  {
    let pos = new Float32Array(verts.numVertices * 3)
    let indices = new Uint16Array(verts.numVertices)
    let uvs     = new Float32Array(verts.arrays.texcoord)
    for (let i = 0; i < verts.numVertices; ++i) {
      pos[i * 3]     = verts.arrays.position[i * 2]     / 8
      pos[i * 3 + 1] = verts.arrays.position[i * 2 + 1] / 8
      pos[i * 3 + 2] = 0
      indices[i]     = i
    }
    vertexData.positions = pos
    vertexData.indices   = indices
    vertexData.uvs      = uvs
  }
  vertexData.applyToMesh(quads, true)
  quads.material = glyphMat
  console.log(vertexData)
  console.log(quads)
  return quads
  
}

type LetterInfo = {x: number, width: number, y: number}
type FontInfo = {
  spacing: number,
  textureWidth: number,
  glyphInfos: {
    a: LetterInfo, "!": LetterInfo, b: LetterInfo, c: LetterInfo, d: LetterInfo, e: LetterInfo, f: LetterInfo, g: LetterInfo, h: LetterInfo, i: LetterInfo, j: LetterInfo, "*": LetterInfo, k: LetterInfo, l: LetterInfo, m: LetterInfo, "-": LetterInfo, n: LetterInfo, o: LetterInfo, p: LetterInfo, "0": LetterInfo, q: LetterInfo, "1": LetterInfo, r: LetterInfo, "2": LetterInfo, s: LetterInfo, "3": LetterInfo, t: LetterInfo, "4": LetterInfo, u: LetterInfo, "5": LetterInfo, v: LetterInfo, "6": LetterInfo, w: LetterInfo, "7": LetterInfo, x: LetterInfo, "8": LetterInfo, y: LetterInfo, "9": LetterInfo, z: LetterInfo, "?": LetterInfo
  }; letterHeight: number; textureHeight: number; spaceWidth: number
}
const fontInfo: FontInfo = {
  letterHeight: 8,
  spaceWidth: 8,
  spacing: -1,
  textureWidth: 64,
  textureHeight: 40,
  glyphInfos: {
    'a': { x:  0, y:  0, width: 8, },
    'b': { x:  8, y:  0, width: 8, },
    'c': { x: 16, y:  0, width: 8, },
    'd': { x: 24, y:  0, width: 8, },
    'e': { x: 32, y:  0, width: 8, },
    'f': { x: 40, y:  0, width: 8, },
    'g': { x: 48, y:  0, width: 8, },
    'h': { x: 56, y:  0, width: 8, },
    'i': { x:  0, y:  8, width: 8, },
    'j': { x:  8, y:  8, width: 8, },
    'k': { x: 16, y:  8, width: 8, },
    'l': { x: 24, y:  8, width: 8, },
    'm': { x: 32, y:  8, width: 8, },
    'n': { x: 40, y:  8, width: 8, },
    'o': { x: 48, y:  8, width: 8, },
    'p': { x: 56, y:  8, width: 8, },
    'q': { x:  0, y: 16, width: 8, },
    'r': { x:  8, y: 16, width: 8, },
    's': { x: 16, y: 16, width: 8, },
    't': { x: 24, y: 16, width: 8, },
    'u': { x: 32, y: 16, width: 8, },
    'v': { x: 40, y: 16, width: 8, },
    'w': { x: 48, y: 16, width: 8, },
    'x': { x: 56, y: 16, width: 8, },
    'y': { x:  0, y: 24, width: 8, },
    'z': { x:  8, y: 24, width: 8, },
    '0': { x: 16, y: 24, width: 8, },
    '1': { x: 24, y: 24, width: 8, },
    '2': { x: 32, y: 24, width: 8, },
    '3': { x: 40, y: 24, width: 8, },
    '4': { x: 48, y: 24, width: 8, },
    '5': { x: 56, y: 24, width: 8, },
    '6': { x:  0, y: 32, width: 8, },
    '7': { x:  8, y: 32, width: 8, },
    '8': { x: 16, y: 32, width: 8, },
    '9': { x: 24, y: 32, width: 8, },
    '-': { x: 32, y: 32, width: 8, },
    '*': { x: 40, y: 32, width: 8, },
    '!': { x: 48, y: 32, width: 8, },
    '?': { x: 56, y: 32, width: 8, },
  },
};

export function initShader(scene: Scene): ShaderMaterial {
  let mat = new ShaderMaterial("glyph", scene, "./glyph",
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
  }
  return mat
}

function makeVerticesForString(fontInfo: FontInfo, s: string) {
  const len = s.length
  const numVertices = len * 6
  const positions = new Float32Array(numVertices * 2)
  const texcoords = new Float32Array(numVertices * 2)
  let offset = 0
  let x = 0
  const maxX = fontInfo.textureWidth
  const maxY = fontInfo.textureHeight
  for (let ii = 0; ii < len; ++ii) {
    const letter = s[ii]
    // @ts-ignore
    const glyphInfo: LetterInfo = fontInfo.glyphInfos[letter]
    if (glyphInfo) {
      const x2 = x + glyphInfo.width
      const u1 = glyphInfo.x / maxX
      const v1 = (glyphInfo.y + fontInfo.letterHeight - 1) / maxY
      const u2 = (glyphInfo.x + glyphInfo.width - 1) / maxX
      const v2 = glyphInfo.y / maxY
  
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
      positions[offset + 5] = fontInfo.letterHeight;
      texcoords[offset + 4] = u1;
      texcoords[offset + 5] = v2;
      
      positions[offset + 6] = x;
      positions[offset + 7] = fontInfo.letterHeight;
      texcoords[offset + 6] = u1;
      texcoords[offset + 7] = v2;
      
      positions[offset + 8] = x2;
      positions[offset + 9] = 0;
      texcoords[offset + 8] = u2;
      texcoords[offset + 9] = v1;
      
      positions[offset + 10] = x2;
      positions[offset + 11] = fontInfo.letterHeight;
      texcoords[offset + 10] = u2;
      texcoords[offset + 11] = v2;
      
      x += glyphInfo.width + fontInfo.spacing;
      offset += 12;
    } else {
      // we don't have this character so just advance
      x += fontInfo.spaceWidth;
    }
  }
  
  // return ArrayBufferViews for the portion of the TypedArrays
  // that were actually used.
  return {
    arrays: {
      position: new Float32Array(positions.buffer, 0, offset),
      texcoord: new Float32Array(texcoords.buffer, 0, offset),
    },
    numVertices: offset / 2,
  };
}

