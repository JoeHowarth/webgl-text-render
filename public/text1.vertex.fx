#version 300 es
in vec4 position;
//in vec2 texcoord;

uniform mat4 worldViewProjection;

out vec2 v_texcoord;

void main() {
    // Multiply the position by the matrix.
    gl_Position = worldViewProjection * position;

    // Pass the texcoord to the fragment shader.
    v_texcoord = texcoord;
}

