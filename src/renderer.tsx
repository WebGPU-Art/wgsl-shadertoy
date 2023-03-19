import render from "bottom-tip";

// 🔎 Check out the blog post:
// https://alain.xyz/blog/raw-webgpu

// 🌅 Renderer
// 📈 Position Vertex Buffer Data
const positions = new Float32Array([
  1.0, -1.0, 0.0, -1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0,
  0.0, -1.0, 1.0, 0.0,
]);

// 🎨 Color Vertex Buffer Data
const colors = new Float32Array([
  1.0,
  0.0,
  0.0, // 🔴
  0.0,
  1.0,
  0.0, // 🟢
  0.0,
  0.0,
  1.0, // 🔵
  1.0,
  1.0,
  0.0, // 🔴
  0.0,
  1.0,
  0.0, // 🟢
  0.0,
  0.0,
  1.0, // 🔵
]);

// 📇 Index Buffer Data
const indices = new Uint16Array([0, 1, 2, 3, 4, 5]);

let sharedDevice = null;

let getWidth = () => window.innerWidth * (devicePixelRatio || 1.0);
let getHeight = () => window.innerHeight * (devicePixelRatio || 1.0);

export default class Renderer {
  canvas: HTMLCanvasElement;

  // ⚙️ API Data Structures
  adapter: GPUAdapter;
  device: GPUDevice;
  queue: GPUQueue;

  // 🎞️ Frame Backings
  context: GPUCanvasContext;
  colorTexture: GPUTexture;
  colorTextureView: GPUTextureView;
  depthTexture: GPUTexture;
  depthTextureView: GPUTextureView;

  // 🔺 Resources
  positionBuffer: GPUBuffer;
  colorBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;
  vertModule: GPUShaderModule;
  fragModule: GPUShaderModule;
  pipeline: GPURenderPipeline;

  commandEncoder: GPUCommandEncoder;
  passEncoder: GPURenderPassEncoder;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  // 🏎️ Start the rendering engine
  async start(code: string) {
    if (await this.initializeAPI()) {
      this.resizeBackings();
      await this.initializeResources(code);
      this.render();
    } else {
      // canvas.style.display = "none";
      // props.onError(
      //   `<p>Doesn't look like your browser supports WebGPU.</p><p>Try using any chromium browser's canary build and go to <code>about:flags</code> to <code>enable-unsafe-webgpu</code>.</p>`
      // );
      console.error("TODO");
    }
  }

  // 🌟 Initialize WebGPU
  async initializeAPI(): Promise<boolean> {
    if (sharedDevice) {
      this.device = sharedDevice.device;
      this.adapter = sharedDevice.adapter;
      this.queue = sharedDevice.queue;
      return true;
    }

    try {
      // 🏭 Entry to WebGPU
      const entry: GPU = navigator.gpu;
      if (!entry) {
        return false;
      }

      // 🔌 Physical Device Adapter
      this.adapter = await entry.requestAdapter();

      // 💻 Logical Device
      this.device = await this.adapter.requestDevice();

      // 📦 Queue
      this.queue = this.device.queue;

      sharedDevice = {
        device: this.device,
        adapter: this.adapter,
        queue: this.queue,
      };
    } catch (e) {
      console.error(e);
      return false;
    }

    return true;
  }

  // 🍱 Initialize resources to render triangle (buffers, shaders, pipeline)
  async initializeResources(code: string) {
    // 🔺 Buffers
    let createBuffer = (arr: Float32Array | Uint16Array, usage: number) => {
      // 📏 Align to 4 bytes (thanks @chrimsonite)
      let desc = {
        size: (arr.byteLength + 3) & ~3,
        usage,
        mappedAtCreation: true,
      };
      let buffer = this.device.createBuffer(desc);
      const writeArray =
        arr instanceof Uint16Array
          ? new Uint16Array(buffer.getMappedRange())
          : new Float32Array(buffer.getMappedRange());
      writeArray.set(arr);
      buffer.unmap();
      return buffer;
    };

    this.positionBuffer = createBuffer(positions, GPUBufferUsage.VERTEX);
    this.colorBuffer = createBuffer(colors, GPUBufferUsage.VERTEX);
    this.indexBuffer = createBuffer(indices, GPUBufferUsage.INDEX);

    // 🖍️ Shaders
    const vsmDesc: any = {
      code: code,
    };
    this.vertModule = this.device.createShaderModule(vsmDesc);

    const fsmDesc: any = {
      code: code,
    };
    this.fragModule = this.device.createShaderModule(fsmDesc);

    this.vertModule.getCompilationInfo().then((info) => {
      if (info.messages.length > 0) {
        displayError(info.messages[0].message, code, info);
      } else {
        this.fragModule.getCompilationInfo().then((info) => {
          if (info.messages.length > 0) {
            displayError(info.messages[0].message, code, info);
          } else {
            displayError(null, code, info);
          }
        });
      }
    });

    // ⚗️ Graphics Pipeline

    // 🔣 Input Assembly
    const positionAttribDesc: GPUVertexAttribute = {
      shaderLocation: 0, // [[attribute(0)]]
      offset: 0,
      format: "float32x3",
    };
    const colorAttribDesc: GPUVertexAttribute = {
      shaderLocation: 1, // [[attribute(1)]]
      offset: 0,
      format: "float32x3",
    };
    const positionBufferDesc: GPUVertexBufferLayout = {
      attributes: [positionAttribDesc],
      arrayStride: 4 * 3, // sizeof(float) * 3
      stepMode: "vertex",
    };
    const colorBufferDesc: GPUVertexBufferLayout = {
      attributes: [colorAttribDesc],
      arrayStride: 4 * 3, // sizeof(float) * 3
      stepMode: "vertex",
    };

    // 🌑 Depth
    const depthStencil: GPUDepthStencilState = {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth24plus-stencil8",
    };

    // 🦄 Uniform Data
    const pipelineLayoutDesc = { bindGroupLayouts: [] };
    const layout = this.device.createPipelineLayout(pipelineLayoutDesc);

    // 🎭 Shader Stages
    const vertex: GPUVertexState = {
      module: this.vertModule,
      entryPoint: "vertex_main",
      buffers: [positionBufferDesc, colorBufferDesc],
    };

    // 🌀 Color/Blend State
    const colorState: GPUColorTargetState = {
      format: "bgra8unorm",
      writeMask: GPUColorWrite.ALL,
    };

    const fragment: GPUFragmentState = {
      module: this.fragModule,
      entryPoint: "fragment_main",
      targets: [colorState],
    };

    // 🟨 Rasterization
    const primitive: GPUPrimitiveState = {
      frontFace: "cw",
      cullMode: "none",
      topology: "triangle-list",
    };

    const pipelineDesc: GPURenderPipelineDescriptor = {
      layout,

      vertex,
      fragment,

      primitive,
      depthStencil,
    };
    this.pipeline = this.device.createRenderPipeline(pipelineDesc);
  }

  // ↙️ Resize Canvas, frame buffer attachments
  resizeBackings() {
    // ⛓️ Canvas Context
    if (!this.context) {
      this.context = this.canvas.getContext("webgpu");
      const canvasConfig: GPUCanvasConfiguration = {
        device: this.device,
        alphaMode: "opaque",
        format: "bgra8unorm",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      };
      this.context.configure(canvasConfig);
    }

    const depthTextureDesc: GPUTextureDescriptor = {
      size: [getWidth(), getHeight(), 1],
      dimension: "2d",
      format: "depth24plus-stencil8",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    };

    this.depthTexture = this.device.createTexture(depthTextureDesc);
    this.depthTextureView = this.depthTexture.createView();
  }

  // ✍️ Write commands to send to the GPU
  encodeCommands() {
    let colorAttachment: GPURenderPassColorAttachment = {
      view: this.colorTextureView,
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      loadOp: "clear",
      storeOp: "store",
    };

    const depthAttachment: GPURenderPassDepthStencilAttachment = {
      view: this.depthTextureView,
      depthClearValue: 1,
      depthLoadOp: "clear",
      depthStoreOp: "store",
      stencilClearValue: 0,
      stencilLoadOp: "clear",
      stencilStoreOp: "store",
    };

    const renderPassDesc: GPURenderPassDescriptor = {
      colorAttachments: [colorAttachment],
      depthStencilAttachment: depthAttachment,
    };

    this.commandEncoder = this.device.createCommandEncoder();

    // 🖌️ Encode drawing commands
    this.passEncoder = this.commandEncoder.beginRenderPass(renderPassDesc);
    this.passEncoder.setPipeline(this.pipeline);
    this.passEncoder.setViewport(0, 0, getWidth(), getHeight(), 0, 1);
    this.passEncoder.setScissorRect(0, 0, getWidth(), getHeight());
    this.passEncoder.setVertexBuffer(0, this.positionBuffer);
    this.passEncoder.setVertexBuffer(1, this.colorBuffer);
    this.passEncoder.setIndexBuffer(this.indexBuffer, "uint16");
    this.passEncoder.drawIndexed(6, 1);
    this.passEncoder.end();

    this.queue.submit([this.commandEncoder.finish()]);
  }

  render = () => {
    // ⏭ Acquire next image from context
    this.colorTexture = this.context.getCurrentTexture();
    this.colorTextureView = this.colorTexture.createView();

    // 📦 Write and submit commands to queue
    this.encodeCommands();

    // ➿ Refresh canvas
    // requestAnimationFrame(this.render);
  };
}

let displayError = (
  message: string | null,
  code: string,
  info: GPUCompilationInfo
) => {
  if (message == null) {
    render("ok~", "Ok");
  } else {
    console.error(info);
    let before = code.split("\n").slice(0, info.messages[0].lineNum).join("\n");
    let space = " ".repeat(info.messages[0].linePos - 1);
    render("error", before + "\n" + space + "^ " + message);
  }
};
