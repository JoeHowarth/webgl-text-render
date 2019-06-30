#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform sampler2D u_texture;
varying vec2 vUv;

void main() {
    float dist = texture2D(u_texture, vUv).r;

    // Use fwidth() to figure out the scale factor between the encoded
    // distance and screen pixels. This uses finite differences with
    // neighboring fragment shaders to see how fast "dist" is changing.
    // This transform gives us signed distance in screen space.
    float scale = 1.0 / fwidth(dist);
    float signedDistance = (dist - 0.5) * scale;

    // Use two different distance thresholds to get dynamically stroked text
    //      float color = clamp(signedDistance + 0.5, 0.0, 1.0);
//    float color = clamp(signedDistance - 0.9, 0.0, 1.0);
    float color = 0.0;
//    float alpha = clamp(signedDistance + scale * 0.125, 0.0, 1.0);
    float alpha = clamp(signedDistance, 0.0, 1.0);
    gl_FragColor = vec4(color, color, color, 1) * alpha;
}
