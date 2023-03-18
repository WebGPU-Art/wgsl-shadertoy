import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

import Renderer from "../renderer";

function WgslCanvas(props: {
  vertWgsl: string;
  onError: (err: string) => void;
}) {
  let canvasRef = useRef<HTMLCanvasElement>(null);

  let render = () => {
    console.info("rerender");

    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.width = window.innerWidth * (devicePixelRatio || 1.0);
    canvas.height = window.innerHeight * (devicePixelRatio || 1.0);
    const renderer = new Renderer(canvas);
    renderer.start(
      props.vertWgsl
        .replace(
          "{%inner_width%}",
          (window.innerWidth * (devicePixelRatio || 1.0)).toString()
        )
        .replace(
          "{%inner_height%}",
          (window.innerHeight * (devicePixelRatio || 1.0)).toString()
        )
    );
  };

  let debouncedRender = useDebouncedCallback(render, 200);

  useEffect(() => {
    debouncedRender();
  }, [props.vertWgsl]);

  useEffect(() => {
    window.addEventListener("resize", debouncedRender);
    return () => {
      window.removeEventListener("resize", debouncedRender);
    };
  }, []);

  return <canvas id="canvas" ref={canvasRef} />;
}

export default WgslCanvas;
