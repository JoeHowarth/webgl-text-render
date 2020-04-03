// @ts-ignore
import createLayout from "layout-bmfont-text"
import inherits from "inherits"
// @ts-ignore
import createIndices from "quad-indices"
// @ts-ignore
import vertices, {Glyph} from "./vertices"
import utils from "./utils"
import {Color3, Texture, Vector3, VertexData} from "@babylonjs/core"

export default function createTextGeometry(opt: Opt) {
  return new TextGeometry(opt)
}

export interface Opt {
  negate?: boolean
  map?: Texture
  color?: Color3
  precision?: string
  alphaTest?: boolean
  opacity?: number
  multipage?: boolean
  text?: string
  font?: any
  flipY?: boolean
}

class TextGeometry {
  _opt:Opt
  layout: Glyph[] = []
  private visibleGlyphs?: Glyph[]
  constructor(opt: Opt | string) {
    if (typeof opt === 'string') {
      opt = <Opt>{text: opt}
    }
    
    // use these as default values for any subsequent
    // calls to update()
    this._opt = Object.assign({}, opt)
    
    // also do an initial setup...
    if (opt) this.update(opt)
  }
  
  update(opt: Opt | string) {
    if (typeof opt === 'string') {
      opt = <Opt>{text: opt}
    }
    
    // use constructor defaults
    opt = <Opt>Object.assign({}, this._opt, opt)
    
    if (!opt.font) {
      throw new TypeError('must specify a { font } in options')
    }
    
    this.layout = createLayout(opt)
    
    // get vec2 texcoords
    const flipY = opt.flipY !== false
    
    // the desired BMFont data
    const font = opt.font
    
    // determine texture size from font file
    const texWidth = font.common.scaleW
    const texHeight = font.common.scaleH
    
    // get visible glyphs
    const glyphs = this.layout.glyphs.filter(function (glyph: Glyph) {
      var bitmap = glyph.data
      return bitmap.width * bitmap.height > 0
    })
    
    // provide visible glyphs for convenience
    this.visibleGlyphs = glyphs
    
    // get common vertex data
    const positions = vertices.positions(glyphs)
    const uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
    const indices = createIndices({
      clockwise: true,
      type: 'uint16',
      count: glyphs.length
    })
    
    // update vertex data
    let buffer = new VertexData()
    buffer.indices = new Uint16Array(indices)
    buffer.positions = positions
    buffer.uvs = uvs
    
    // update multipage data
    if (!opt.multipage ) {
      // disable multipage rendering
      // this.removeAttribute('page')
    } else if (opt.multipage) {
      // var pages = vertices.pages(glyphs)
      // enable multipage rendering
      // buffer.attr(this, 'page', pages, 1)
      throw new Error("pages not supported")
    }
  }
}

// TextGeometry.prototype.computeBoundingSphere = function () {
//   if (this.boundingSphere === null) {
//     this.boundingSphere = new THREE.Sphere()
//   }
//
//   var positions = this.attributes.position.array
//   var itemSize = this.attributes.position.itemSize
//   if (!positions || !itemSize || positions.length < 2) {
//     this.boundingSphere.radius = 0
//     this.boundingSphere.center.set(0, 0, 0)
//     return
//   }
//   utils.computeSphere(positions, this.boundingSphere)
//   if (isNaN(this.boundingSphere.radius)) {
//     console.error('THREE.BufferGeometry.computeBoundingSphere(): ' +
//         'Computed radius is NaN. The ' +
//         '"position" attribute is likely to have NaN values.')
//   }
// }

// TextGeometry.prototype.computeBoundingBox = function () {
//   if (this.boundingBox === null) {
//     this.boundingBox = new THREE.Box3()
//   }
//
//   var bbox = this.boundingBox
//   var positions = this.attributes.position.array
//   var itemSize = this.attributes.position.itemSize
//   if (!positions || !itemSize || positions.length < 2) {
//     bbox.makeEmpty()
//     return
//   }
//   utils.computeBox(positions, bbox)
// }
