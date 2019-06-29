#version 300 es
precision mediump float;

in vec2 v_texcoord;
uniform sampler2D u_texture;
out vec4 outColor;

void main() {
    outColor = texture(u_texture, v_texcoord);
    //    outColor = vec4(v_texcoord, 0.5, 1);

    //    outColor = texture(u_texture, vec2(0.5, 0.3));
    //    outColor = vec4(0, 0.5, 0.5, 1);
}

