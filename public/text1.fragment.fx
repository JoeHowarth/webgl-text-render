#version 300 es
precision mediump float;

// Passed in from the vertex shader.
in vec2 v_texcoord;

uniform sampler2D texture;

out vec4 outColor;

void main() {
    outColor = texture(texture, v_texcoord);
    outColor = vec4(0.5, 0.5, 0.5, 1);
}

