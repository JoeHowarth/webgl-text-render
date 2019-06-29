//#version 300 es
precision mediump float;
in vec4 position;
in vec2 uv;
uniform mat4 worldViewProjection;
out vec2 v_texcoord;
void main() {
    gl_Position = worldViewProjection * position;
    v_texcoord = uv;
}
