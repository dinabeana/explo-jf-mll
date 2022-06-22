
const hidpiCanvas = (canvas) => {
  if (window.devicePixelRatio) {
    if (window.devicePixelRatio === 1) {
      return;
    }
    // grab the width and height from canvas
    let height = canvas.height;
    let width = canvas.width;
    // reset the canvas width and height with window.devicePixelRatio applied
    canvas.setAttribute('width', Math.round(width * window.devicePixelRatio));
    canvas.setAttribute('height', Math.round( height * window.devicePixelRatio));
  }
};

export default hidpiCanvas;
