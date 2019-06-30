import {Mesh, Scene, Vector2} from "@babylonjs/core"

export interface textApi {
  init(scene: Scene, font_src?: string, fontInfo?: Object): boolean
  drawText(text: string,
           where: Vector2,
           size?: number,
           font?: string): Mesh
  
}
