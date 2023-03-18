import { useState } from "react";
import WgslCanvas from "./comp/wgsl-canvas";
import ShaderEditor from "./comp/shader-editor";

function Container() {
  const [code, setCode] = useState(shaderCode);

  return (
    <div>
      <WgslCanvas
        vertWgsl={code}
        onError={(error) => {
          console.error(error);
        }}
      />
      <ShaderEditor
        code={code}
        onChange={(text) => {
          setCode(text);
        }}
      />
    </div>
  );
}

export default Container;

let shaderCode = `
struct VSOut {
  @builtin(position) Position: vec4<f32>,
   @location(0) color: vec3<f32>,
 };

@vertex
fn vertex_main(@location(0) inPos: vec3<f32>,
               @location(1) inColor: vec3<f32>) -> VSOut {
  var vsOut: VSOut;
  vsOut.Position = vec4<f32>(inPos, 1.0);
  vsOut.color = inColor;
  return vsOut;
}

@fragment
fn fragment_main(@location(0) inColor: vec3<f32>) -> @location(0) vec4<f32> {
  return vec4<f32>(inColor, 1.0);
}
`;
