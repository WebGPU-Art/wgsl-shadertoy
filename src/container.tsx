import { useEffect, useState } from "react";
import WgslCanvas from "./comp/wgsl-canvas";
import ShaderEditor from "./comp/shader-editor";

import baseWgsl from "../shaders/base.wgsl?raw";

function Container() {
  const [code, setCode] = useState(baseWgsl);
  const [_, forceRerender] = useState(0);

  const fullHeight = window.innerHeight === screen.availHeight;

  useEffect(() => {
    let handler = () => {
      forceRerender(Math.random());
    };
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <div>
      <WgslCanvas
        vertWgsl={code}
        onError={(error) => {
          console.error(error);
        }}
      />
      {fullHeight ? null : (
        <ShaderEditor
          code={code}
          onChange={(text) => {
            setCode(text);
          }}
        />
      )}
    </div>
  );
}

export default Container;
