import getBrowserInfo from '../functions/getBrowserInfo';

class QRReader {

  constructor({ qrVideoEl, qrCanvasEl, qrCtx, qrCanvasReadInterval, qrCallback }) {
    this.qrVideoEl = qrVideoEl;
    this.qrCanvasEl = qrCanvasEl;
    this.qrCtx = qrCtx;
    this.qrStream = false;
    this.qrCanvasReadInterval = qrCanvasReadInterval;
    this.videoWidth = 0;
    this.videoHeight = 0;

    qrcode.callback = qrCallback;

    navigator.getUserMedia = (
      navigator['getUserMedia'] ||
      navigator['webkitGetUserMedia'] ||
      navigator['mozGetUserMedia'] ||
      navigator['msGetUserMedia']);
  }


  sniffQR(){
    setQRCapability(false);
    if (!navigator.getUserMedia) {
      return false; // early return, doesn't support QR codes
    }
    // but feature detection does not always work as browsers may lie about their
    // capabilities, so sniff versions and blacklist some.
    const info = getBrowserInfo();
    if (info.name === 'chrome' && info.version > 20) {
      setQRCapability(true);
      return true;
    }
    if (info.name === 'firefox') {
      if (
        (
          info.ua.includes('Mobile') ||
          info.ua.includes('Android') ||
          info.ua.includes('iPhone') ||
          info.ua.includes('iPad')
        )
        && info.version > 28
      ) {
        setQRCapability(true);
        return true;
      } else if (info.version > 19) {
        setQRCapability(true);
        return true;
      }
    }
  }

  initCamera() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    if (this.deviceOptions) {
      this.initCameraWithOptions(this.deviceOptions);
      return;
    }
    this.deviceOptions = {
      facingMode: {exact: "environment"}
    };
    this.initCameraWithOptions(this.deviceOptions);
  }

  initCameraWithOptions(deviceOptions) {
    navigator.getUserMedia({ video: deviceOptions, audio: false }, (stream) => {
      this.qrStream = stream;
      const info = getBrowserInfo();
      if (info.name === 'firefox') {
        this.qrVideoEl.mozSrcObject = stream;
        this.qrVideoEl.play();
      } else {
        this.qrVideoEl.src = window.URL.createObjectURL(stream);
      }
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => this.updateQRCanvas(), this.qrCanvasReadInterval);
    }, (error) => {
      console.error(error);
    });
  }

  updateQRCanvas() {
    if (this.videoWidth !== this.qrVideoEl.videoWidth) {
      this.videoWidth = this.qrVideoEl.videoWidth;
      this.qrCanvasEl.width = this.qrVideoEl.videoWidth;
    }
    // use in conjunction with object-fit: cover in css
    if (this.videoHeight !== this.qrVideoEl.videoHeight) {
      this.videoHeight = this.qrVideoEl.videoHeight;
      this.qrCanvasEl.height = this.qrVideoEl.videoHeight;
    }
    this.qrCtx.drawImage(this.qrVideoEl, 0, 0);
    try {
      qrcode.decode();
    } catch (e) {
    }
    clearTimeout(this.timeoutId);
    // redraw every x-ms
    this.timeoutId = setTimeout(() => this.updateQRCanvas(), this.qrCanvasReadInterval);
  }

  stopCamera() {
    if (!this.initialized) {
      return;
    }
    this.initialized = false;
    clearTimeout(this.timeoutId);
    const track = this.qrStream.getTracks()[0];
    track.stop();
    this.qrStream = false;
  }
}

const setQRCapability = (enabled) => {
  if (enabled) {
    document.documentElement.classList.add('has-qr');
    document.documentElement.classList.remove('no-qr');
  } else {
    document.documentElement.classList.remove('has-qr');
    document.documentElement.classList.add('no-qr');
  }
};

export default QRReader
