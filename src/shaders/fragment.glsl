precision mediump float;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;
void main() {
    vec4 texture = texture2D(uTexture, vUv);
    texture.rgb *= vElevation + 1.10;
     gl_FragColor = vec4(texture);
}