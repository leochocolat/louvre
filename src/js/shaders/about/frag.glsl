varying vec2 vUv;

uniform sampler2D u_texture;
uniform sampler2D u_newTexture;
uniform sampler2D u_map;
uniform float u_transition;

void main () {
    vec2 uv_t = vec2(vUv.s, vUv.t);
    vec4 displace = texture2D(u_map, uv_t);
    
    // float displace_k = displace.g;
    // vec2 uv_displaced1 = vec2(vUv.x, vUv.y + displace_k);
    // vec2 uv_displaced2 = vec2(vUv.x, vUv.y - displace_k);

    vec4 texture = mix(texture2D(u_texture, vUv), texture2D(u_newTexture, vUv), u_transition);

    gl_FragColor = texture;
}