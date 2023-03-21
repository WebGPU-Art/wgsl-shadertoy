import { useState } from "react";
import WgslCanvas from "./comp/wgsl-canvas";
import ShaderEditor from "./comp/shader-editor";

import baseWgsl from "../shaders/base.wgsl";

function Container() {
  const [code, setCode] = useState(baseWgsl);

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
