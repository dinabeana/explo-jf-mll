import hidpiCanvas from '../functions/hidpiCanvas';

class CanvasMask {

  constructor(canvasMaskEl, canvasMaskCtx) {
    this.canvasMaskEl = canvasMaskEl;
    this.canvasMaskCtx = canvasMaskCtx;

    window.addEventListener('resize', e => {
      this.drawCanvasMask();
    });
  }

  drawCanvasMask() {
    this.canvasMaskEl.width = window.innerWidth;
    this.canvasMaskEl.height = window.innerHeight;
    hidpiCanvas(this.canvasMaskEl);
    this.innerRectangleMaxSize = 0.8 * Math.min(this.canvasMaskEl.width, this.canvasMaskEl.height);
    this.innerRectangleOffsetLeft = 0.5 * (this.canvasMaskEl.width - this.innerRectangleMaxSize);
    this.innerRectangleOffsetTop = 0.5 * (this.canvasMaskEl.height - this.innerRectangleMaxSize);

    const length = 0.2 * this.innerRectangleMaxSize;

    this.canvasMaskCtx.fillStyle = 'rgba(0,0,0,0.2)';
    this.canvasMaskCtx.fillRect(0, 0, this.canvasMaskEl.width, this.canvasMaskEl.height);
    this.canvasMaskCtx.clearRect(this.innerRectangleOffsetLeft, this.innerRectangleOffsetTop, this.innerRectangleMaxSize, this.innerRectangleMaxSize);
    this.canvasMaskCtx.strokeStyle = 'rgba(243,243,235, 1.0)';
    this.canvasMaskCtx.lineWidth = 30;
    this.canvasMaskCtx.save();
    this.canvasMaskCtx.translate(this.innerRectangleOffsetLeft, this.innerRectangleOffsetTop);
    this.canvasMaskCtx.beginPath();
    this.canvasMaskCtx.moveTo(length, 0);
    this.canvasMaskCtx.lineTo(0, 0);
    this.canvasMaskCtx.lineTo(0, length);
    this.canvasMaskCtx.moveTo(this.innerRectangleMaxSize - length, 0);
    this.canvasMaskCtx.lineTo(this.innerRectangleMaxSize, 0);
    this.canvasMaskCtx.lineTo(this.innerRectangleMaxSize, length);
    this.canvasMaskCtx.moveTo(this.innerRectangleMaxSize, this.innerRectangleMaxSize - length);
    this.canvasMaskCtx.lineTo(this.innerRectangleMaxSize, this.innerRectangleMaxSize);
    this.canvasMaskCtx.lineTo(this.innerRectangleMaxSize - length, this.innerRectangleMaxSize);
    this.canvasMaskCtx.moveTo(length, this.innerRectangleMaxSize);
    this.canvasMaskCtx.lineTo(0, this.innerRectangleMaxSize);
    this.canvasMaskCtx.lineTo(0, this.innerRectangleMaxSize - length);
    // center crosshairs
    this.canvasMaskCtx.moveTo(this.innerRectangleMaxSize/2, this.innerRectangleMaxSize/2 - length/3);
    this.canvasMaskCtx.lineTo(this.innerRectangleMaxSize/2, this.innerRectangleMaxSize/2 + length/3);
    this.canvasMaskCtx.moveTo(this.innerRectangleMaxSize/2 - length/3, this.innerRectangleMaxSize/2);
    this.canvasMaskCtx.lineTo(this.innerRectangleMaxSize/2 + length/3, this.innerRectangleMaxSize/2);
    this.canvasMaskCtx.restore();
    this.canvasMaskCtx.stroke();
  }
}

export default CanvasMask
