/*
  This is an example of 2D rendering, simply
  using bitmap fonts in orthographic space.

  var geom = createText({
    multipage: true,
    ... other options
  })
 */

// var shuffle = require('array-shuffle')
// var quotes = shuffle(require('sun-tzu-quotes/quotes.json').join(' ').split('.'))
import {Scene, Texture} from "@babylonjs/core"

const quotes = ["afadsf", "adfadsf", "2fqwe"]
// var createText = require('../')
import createText from '@/bmfont'
// var MSDFShader = require('../shaders/msdf')
import MSDFShader from '@/msdf'
// var palettes = require('nice-color-palettes')
// var palette = palettes[5]
// var background = palette.shift()
import loadBMFont from 'load-bmfont'
import font from '@/fonts/Roboto-msdf.json'
import createShader from "@/msdf"

require('./load')({
  font: 'fnt/Roboto-msdf.json',
  image: 'fnt/Roboto-msdf.png'
}, start)

export default function(scene: Scene) {
  let tex = new Texture("Roboto-msdf.png", scene)
  tex.onLoadObservable.add(tex => start(scene, tex))
}

export function start (scene: Scene, texture: Texture) {
  loadBMFont("font/Roboto-msdf.json")
  createShader(scene)

  createGlyph()

  var time = 0
  // update orthographic
  // app.on('tick', function (dt) {
  //   time += dt / 1000
  //   var s = (Math.sin(time * 0.5) * 0.5 + 0.5) * 2.0 + 0.5
  //   container.scale.set(s, s, s)
  //   // update camera
  //   var width = app.engine.width
  //   var height = app.engine.height
  //   app.camera.left = -width / 2
  //   app.camera.right = width / 2
  //   app.camera.top = -height / 2
  //   app.camera.bottom = height / 2
  //   app.camera.updateProjectionMatrix()
  // })

  function createGlyph () {
    var angle = (Math.random() * 2 - 1) * Math.PI
    var geom = createText({
      text: quotes[Math.floor(Math.random() * quotes.length)].split(/\s+/g).slice(0, 6).join(' '),
      font: font,
      align: 'left',
      flipY: texture.flipY
    })

    var material = new THREE.RawShaderMaterial(MSDFShader({
      map: texture,
      transparent: true,
      color: palette[Math.floor(Math.random() * palette.length)]
    }))

    var layout = geom.layout
    var text = new THREE.Mesh(geom, material)
    text.position.set(0, -layout.descender + layout.height, 0)
    text.scale.multiplyScalar(Math.random() * 0.5 + 0.5)

    var textAnchor = new THREE.Object3D()
    textAnchor.add(text)
    textAnchor.rotation.z = angle
    container.add(textAnchor)
  }
}

