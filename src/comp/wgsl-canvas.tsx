import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import Renderer from "../renderer";

let pixelRatio = window.devicePixelRatio || 1.0;

function WgslCanvas(props: {
  vertWgsl: string;
  onError: (err: string) => void;
}) {
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let [clickPosition, setClickPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

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
        .replace(
          "{%click_position%}",
          `vec2(${clickPosition.x},${clickPosition.y})`
        )
    );
  };

  let debouncedRender = useDebouncedCallback(render, 100);

  useEffect(() => {
    debouncedRender();
  }, [props.vertWgsl, clickPosition]);

  useEffect(() => {
    window.addEventListener("resize", debouncedRender);
    return () => {
      window.removeEventListener("resize", debouncedRender);
    };
  }, []);

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      onClick={(event) => {
        let w = window.innerWidth;
        let h = window.innerHeight;
        let center = { x: w / 2, y: h / 2 };
        let x = event.clientX;
        let y = event.clientY;
        let dx = x - center.x;
        let dy = center.y - y;
        console.log("click event", { x, y, w, h });
        setClickPos({ x: dx, y: dy });
      }}
    />
  );
}

export default WgslCanvas;
