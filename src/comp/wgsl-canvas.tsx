import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

import Renderer from "../renderer";

let pixelRatio = window.devicePixelRatio || 1.0;

function WgslCanvas(props: {
  vertWgsl: string;
  onError: (err: string) => void;
}) {
  let canvasRef = useRef<HTMLCanvasElement>(null);

  let render = () => {
    console.info("rerender");

    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    const renderer = new Renderer(canvas);
    renderer.start(
      props.vertWgsl
        .replace("{%inner_width%}", window.innerWidth.toString())
        .replace("{%inner_height%}", window.innerHeight.toString())
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
