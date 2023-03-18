import { useEffect, useRef } from "react";

import Renderer from "../renderer";

function WgslCanvas(props: {
  vertWgsl: string;
  onError: (err: string) => void;
}) {
  let canvasRef = useRef<HTMLCanvasElement>(null);

  let render = () => {
    console.log("rerender");

    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const renderer = new Renderer(canvas);
    renderer.start(props.vertWgsl);
  };

  useEffect(() => {
    render();
  }, [props.vertWgsl]);

  useEffect(() => {
    window.addEventListener("resize", render);
    return () => {
      window.removeEventListener("resize", render);
    };
  }, []);

  return <canvas id="canvas" ref={canvasRef} />;
}

export default WgslCanvas;
