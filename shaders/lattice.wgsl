const inner_width: f32 = {%inner_width%};
const inner_height: f32 = {%inner_height%};

@fragment
fn fragment_main(vs_out: VertexOut) -> @location(0) vec4<f32> {
  // provide (x,y) in pixels, center is (0,0)
  let pos = vs_out.pos;
  let x = pos.x * inner_width * 0.5;
  let y = pos.y * inner_height * 0.5;
  let angle = atan2(y, x);

  let l = length(vec2(x, y));
  if l < 8 {
    return vec4(0.8, 0.8, 1.0, 1.0);
  }

  let grid = 200.0;
  let width = 0.004;

  let arrow_a = mid_fract((x + y) / grid);
  let arrow_b = mid_fract((x - y) / grid);

  if abs(arrow_a) < width || abs(arrow_b) < width {
    return vec4(1, 1, 1, 1);
  }

  let cell = 0.4;

  let fill_a = mid_fract((x + y) / grid + 0.5);
  let fill_b = mid_fract((x - y) / grid + 0.5);
  if abs(fill_a) < cell && abs(fill_b) < cell {
    let ag = atan2(fill_b, fill_a);
    let al = length(vec2(fill_a, fill_b));
    if al < 0.5 * (0.6 + 0.4 * cos(ag * 8)) {
      return vec4(vs_out.color, 1.0);
    }
    return vec4(0.7, 0.7, 1, 1) * 0.9 + vec4(vs_out.color, 1.0) * 0.1;
  }

  return vec4(vs_out.color, 1.0);
  // return vec4(0,0,0,1);
}

fn mid_fract(x: f32) -> f32 {
  let f = fract(x);
  if f < 0.5 {
    return f;
  } else {
    return f - 1;
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
