import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial'
import {DynamicTexture, Scene, Texture} from "@babylonjs/core"

function initShader(scene: Scene): ShaderMaterial {
  return new ShaderMaterial("shader", scene, "./glyph",
      {
        attributes: ["position", "texcoord"],
        uniforms: ["worldViewProjection"]
      })
}

export function drawLetter(scene: Scene) {
  let glyphShader = new ShaderMaterial("glyphShader", scene, "./glyph")
  let src = "https://webgl2fundamentals.org/webgl/resources/8x8-font.png"
  let glyphTex = new Texture(src, scene)
  let glyphMat = initShader(scene)
  glyphTex.onLoadObservable.add(() => {
    glyphMat.setTexture("texture", glyphTex)
  })
}

type LetterInfo = {x: number, width: number, y: number}
type FontInfo = {
  spacing: number,
  textureWidth: number,
  glyphInfos: {
    a: LetterInfo, "!": LetterInfo, b: LetterInfo, c: LetterInfo, d: LetterInfo, e: LetterInfo, f: LetterInfo, g: LetterInfo, h: LetterInfo, i: LetterInfo, j: LetterInfo, "*": LetterInfo, k: LetterInfo, l: LetterInfo, m: LetterInfo, "-": LetterInfo, n: LetterInfo, o: LetterInfo, p: LetterInfo, "0": LetterInfo, q: LetterInfo, "1": LetterInfo, r: LetterInfo, "2": LetterInfo, s: LetterInfo, "3": LetterInfo, t: LetterInfo, "4": LetterInfo, u: LetterInfo, "5": LetterInfo, v: LetterInfo, "6": LetterInfo, w: LetterInfo, "7": LetterInfo, x: LetterInfo, "8": LetterInfo, y: LetterInfo, "9": LetterInfo, z: LetterInfo, "?": LetterInfo
  }; letterHeight: number; textureHeight: number; spaceWidth: number
}
let fontInfo: FontInfo = {
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

function makeVerticesForString(fontInfo: FontInfo, s: string): { numVertices: number; arrays: { texcoord: Float32Array; position: Float32Array } } {
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
    const glyphInfo = fontInfo.glyphInfos[letter]
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


export function textMain(scene: Scene): void {
  let glyphShader = new ShaderMaterial("glyphShader", scene, "./glyph")
  // setup GLSL programs
  
  // Maunally create a bufferInfo
  const textBufferInfo = {
    attribs: {
      a_position: {buffer: gl.createBuffer(), numComponents: 2,},
      a_texcoord: {buffer: gl.createBuffer(), numComponents: 2,},
    },
    numElements: 0,
  }
  // const textVAO = twgl.createVAOFromBufferInfo( gl, textProgramInfo, textBufferInfo)
  
  // let dynamicTexture = new DynamicTexture("glyphTex", 40, scene, true)
  let src = "https://webgl2fundamentals.org/webgl/resources/8x8-font.png"
  let glyphTex = new Texture(src, scene)
  let glyphMat = initShader(scene)
  let verts = makeVerticesForString(fontInfo, "a")
  console.log("verts: ", verts)
  
  glyphTex.onLoadObservable.add(_ => {
    glyphMat.setTexture("texture", glyphTex)
    
  })
  
  
  // Create a texture.
  // const glyphTex = gl.createTexture()
  // gl.bindTexture(gl.TEXTURE_2D, glyphTex);
  // Fill the texture with a 1x1 blue pixel.
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  //     new Uint8Array([0, 0, 255, 255]));
  // Asynchronously load an image
  // const image = new Image()
  // image.src = src;
  // image.addEventListener('load', function() {
  //   // Now that the image has loaded make copy it to the texture.
  //   gl.bindTexture(gl.TEXTURE_2D, glyphTex);
  //   gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // });
  
  const names = [
    "anna",   // 0
    "colin",  // 1
    "james",  // 2
    "danny",  // 3
    "kalin",  // 4
    "hiro",   // 5
    "eddie",  // 6
    "shu",    // 7
    "brian",  // 8
    "tami",   // 9
    "rick",   // 10
    "gene",   // 11
    "natalie",// 12,
    "evan",   // 13,
    "sakura", // 14,
    "kai",    // 15,
  ]
  
  
  // const textUniforms = {
  //   u_matrix: m4.identity(),
  //   u_texture: glyphTex,
  //   u_color: [0, 0, 0, 1],  // black
  // }
  
  function degToRad(d: number): number {
    return d * Math.PI / 180;
  }
  
  const translation = [0, 30, 0]
  const rotation = [degToRad(190), degToRad(0), degToRad(0)]
  const scale = [1, 1, 1]
  const fieldOfViewRadians = degToRad(60)
  const rotationSpeed = 1.2
  
  let then = 0
  
  // requestAnimationFrame(drawScene);
  
  function drawScene(time): void {
    // Convert to seconds
    const now = time * 0.001
    // Subtract the previous time from the current time
    const deltaTime = now - then
    // Remember the current time for the next frame.
    then = now;
    
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    
    // Every frame increase the rotation a little.
    rotation[1] += rotationSpeed * deltaTime;
    
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);
    
    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);
    
    gl.disable(gl.BLEND);
    gl.depthMask(true);
    
    // Compute the matrix
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
    const zNear = 1
    const zFar = 2000
    const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)
  
    // Compute the camera's matrix using look at.
    const cameraRadius = 360
    const cameraPosition = [Math.cos(now) * cameraRadius, 0, Math.sin(now) * cameraRadius]
    const target = [0, 0, 0]
    const up = [0, 1, 0]
    const cameraMatrix = m4.lookAt(cameraPosition, target, up)
    const viewMatrix = m4.inverse(cameraMatrix)
  
    const textPositions = []
  
    const spread = 170
    for (let yy = -1; yy <= 1; ++yy) {
      for (let xx = -2; xx <= 2; ++xx) {
        let fViewMatrix = m4.translate(viewMatrix,
            translation[0] + xx * spread, translation[1] + yy * spread, translation[2])
        fViewMatrix = m4.xRotate(fViewMatrix, rotation[0]);
        fViewMatrix = m4.yRotate(fViewMatrix, rotation[1] + yy * xx * 0.2);
        fViewMatrix = m4.zRotate(fViewMatrix, rotation[2] + now + (yy * 3 + xx) * 0.1);
        fViewMatrix = m4.scale(fViewMatrix, scale[0], scale[1], scale[2]);
        fViewMatrix = m4.translate(fViewMatrix, -50, -75, 0);
        
        // remember the position for the text
        textPositions.push([fViewMatrix[12], fViewMatrix[13], fViewMatrix[14]]);
        
        // setup to draw the 'F'
        gl.useProgram(fProgramInfo.program);
        
        // setup the attributes and buffers for the F
        gl.bindVertexArray(fVAO);
        
        fUniforms.u_matrix = m4.multiply(projectionMatrix, fViewMatrix);
        
        twgl.setUniforms(fProgramInfo, fUniforms);
        
        twgl.drawBufferInfo(gl, fBufferInfo);
      }
    }
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    
    // setup to draw the text.
    // Because every letter uses the same attributes and the same progarm
    // we only need to do this once before drawing all the letters
    gl.useProgram(textProgramInfo.program);
    gl.bindVertexArray(textVAO);
    
    textPositions.forEach(function(pos, ndx) {
      const name = names[ndx]
      const s = name + ":" + pos[0].toFixed(0) + "," + pos[1].toFixed(0) + "," + pos[2].toFixed(0)
      const vertices = makeVerticesForString(fontInfo, s)
  
      // update the buffers
      textBufferInfo.attribs.a_position.numComponents = 2;
      gl.bindBuffer(gl.ARRAY_BUFFER, textBufferInfo.attribs.a_position.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices.arrays.position, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, textBufferInfo.attribs.a_texcoord.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices.arrays.texcoord, gl.DYNAMIC_DRAW);
      
      // use just the view position of the 'F' for the text
      
      // because pos is in view space that means it's a vector from the eye to
      // some position. So translate along that vector back toward the eye some distance
      const fromEye = m4.normalize(pos)
      const amountToMoveTowardEye = 150  // because the F is 150 units long
      const viewX = pos[0] - fromEye[0] * amountToMoveTowardEye
      const viewY = pos[1] - fromEye[1] * amountToMoveTowardEye
      const viewZ = pos[2] - fromEye[2] * amountToMoveTowardEye
      const desiredTextScale = -1 / gl.canvas.height * 2  // 1x1 pixels
      const scale = viewZ * desiredTextScale
  
      let textMatrix = m4.translate(projectionMatrix, viewX, viewY, viewZ)
      textMatrix = m4.scale(textMatrix, scale, scale, 1);
      
      // setup to draw the text.
      gl.useProgram(textProgramInfo.program);
      
      gl.bindVertexArray(textVAO);
      
      m4.copy(textMatrix, textUniforms.u_matrix);
      twgl.setUniforms(textProgramInfo, textUniforms);
      
      // Draw the text.
      gl.drawArrays(gl.TRIANGLES, 0, vertices.numVertices);
    });
    
    requestAnimationFrame(drawScene);
  }
}

// textMain();

