// const inner_width: f32 = {%inner_width%};
// const inner_height: f32 = {%inner_height%};

@fragment
fn fragment_main(vs_out: VertexOut) -> @location(0) vec4<f32> {

  let pos = vs_out.pos;
  let x = pos.x * inner_width * 0.5;
  let y = pos.y * inner_height * 0.5;

  let grid = 100.0;

  let x_s = balanced_fract(x / grid) * grid;
  let y_s = balanced_fract(y / grid) * grid;

  let angle = atan2(y_s, x_s);

  let l = length(vec2<f32>(x_s, y_s));
  if l < 10 * (1 + sin(4 * angle + x * 0.2)) * (1 + cos(9 * angle + y * 0.1)) {
    return vec4(1.0, 1.0, 0.0, 1.0);
  }

  return vec4(vs_out.color, 1.0);
}

fn balanced_fract(x: f32) -> f32 {
  let f = fract(x);
  if f > 0.5 {
    return f - 1.;
  } else {
    return f;
  }
}

struct VertexOut {
  // default position
  @builtin(position) position: vec4<f32>,
  // position from -1 to 1
  @location(1) pos: vec3<f32>,
  // defined vertex color
  @location(0) color: vec3<f32>,
};

/**
 * (-1, 1,0) (1, 1,0)
 *
 * (-1,-1,0) (1,-1,0)
 */
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