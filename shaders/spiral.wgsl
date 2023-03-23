const inner_width: f32 = {%inner_width%};
const inner_height: f32 = {%inner_height%};

const PI = 3.14159265358979323846264338327;

@fragment
fn fragment_main(vs_out: VertexOut) -> @location(0) vec4<f32> {

  let pos = vs_out.pos;
  let x = pos.x * inner_width * 0.5;
  let y = pos.y * inner_height * 0.5;
  let angle = atan2(y, x);

  let step = 200.0;

  let l = length(vec2<f32>(x, y));
  let d = l + angle * 0.5 / PI * step;
  var offset = fract(d / step);

  if (offset > 0.5) {
    offset -= 1;
  }

  let ff = pow(abs(offset), 0.3);
  let shadow = min(1.0, 1 / ff * 0.1);
  return vec4(shadow, shadow, shadow, 1.0);
}

struct VertexOut {

  @builtin(position) position: vec4<f32>,

  @location(1) pos: vec3<f32>,

  @location(0) color: vec3<f32>,
};

@vertex
fn vertex_main(
    @location(0) in_pos: vec3<f32>,
    @location(1) in_color: vec3<f32>
  ) -> VertexOut {
  var ret: VertexOut;
  ret.position = vec4<f32>(in_pos, 1.0);
  ret.color = in_color;
  ret.pos = in_pos;
  return ret;
}
