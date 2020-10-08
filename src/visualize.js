import drawDualbarsBlocks from './visuals/drawDualbarsBlocks.js';

//options:type,colors,stroke
export default function visualize(data, canvasId, options = {}, frame) {
  //make a clone of options
  options = { ...options };
  //options
  if (!options.stroke) options.stroke = 1;
  if (!options.colors) options.colors = ['#ff9234', '#ff9234'];
  let canvas = document.getElementById(canvasId);

  if (!canvas) return;

  let ctx = canvas.getContext('2d');
  let h = canvas.height;
  let w = canvas.width;

  ctx.strokeStyle = options.colors[0];
  ctx.lineWidth = options.stroke;

  const functionContext = {
    data,
    options,
    ctx,
    h,
    w,
    Helper: this.Helper,
    canvasId,
  };
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  drawDualbarsBlocks(functionContext);
}
