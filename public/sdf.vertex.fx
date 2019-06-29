attribute vec2 position;
attribute vec2 uv;

uniform mat4 worldViewProjection;
//uniform vec2 u_texsize;

varying vec2 vUv;

void main() {
    gl_Position = worldViewProjection * vec4(position.xy, 0, 1);
//    v_texcoord = uv / u_texsize;
    vUv = uv;
}
