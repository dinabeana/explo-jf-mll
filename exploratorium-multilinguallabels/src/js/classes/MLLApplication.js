import 'core-js/fn/array/from';
import 'core-js/fn/array/for-each';
import 'core-js/es6/promise';
import 'core-js/fn/promise';
import QRReader from './QRReader';
import LanguageForm from './LanguageForm';
import CanvasMask from './CanvasMask';
import Timeout from './Timeout';
import configureURL from '../functions/configureURL';
import testURL from '../functions/testURL';

class MLLApplication {
  constructor(config) {
    // config variables
    this.config = config;
    this.qrCanvasReadInterval = this.config.qrCanvasReadInterval;
    if (this.config.introPage) {
      this.exhibitId = this.config.introPage.exhibitId;
    } else {
      this.exhibitId = false;
    }

    // state variables
    this.activeScreenName = false;  // 'welcome' or 'app'
    this.qrCapability = false;
    this.codeEntryMode = false; // activated if code entered through 'qr' vs intro page
    this.inputOverlay = false;
    this.code = false;
    this.currentCode = '';

    this.errorCount = 0;
    this.iframeId = 'mllPage'; // change if different iframes to target, this app uses only one iframe

    // targetted DOM elements
    this.htmlEl = document.documentElement;
    this.screenEls = Array.from(document.querySelectorAll('.screen')); // turned to array from nodelist for older browsers
    const chooseLanguageEl_welcome = document.getElementById('languageForm-welcome');
    const chooseLanguageEl_app = document.getElementById('languageForm-app');
    const goButtonEl = document.getElementById('goButton');
    const reloadButtonEl = document.getElementById('reload');
    const helpButtonEl = document.getElementById('help');
    const qrVideoEl = document.createElement('video');
    const qrCanvasEl = document.getElementById('qr-canvas');
    const qrCtx = qrCanvasEl.getContext('2d');
    const canvasMaskEl = document.getElementById('canvas-mask');
    const canvasMaskCtx = canvasMaskEl.getContext('2d');
    this.qrReaderErrorEl = document.getElementById('qrReaderError');
    this.invalidQRCodeEl = document.getElementById('invalidQRCode');
    this.header = document.querySelector('header');
    this.footer = document.querySelector('footer');

    this.setActiveScreenName('welcome');

    // instantiate new objects from classes

    // instantiate QRReader
    this.qrReader = new QRReader({
      // ECMA2015 key-value shorthand
      qrVideoEl,
      qrCanvasEl,
      qrCtx,
      qrCanvasReadInterval: this.qrCanvasReadInterval,
      qrCallback: (code) => this.onQRDecoded(code)
    });
    this.qrCapability = this.qrReader.sniffQR();
    if (this.qrCapability) {
      this.controlCameraOnPageVisibilityChange();
    } else {
      console.log("qr code scanning not supported");
    }

    // instantiate and inject HTML language form elements
    this.languageForm_welcome = new LanguageForm(chooseLanguageEl_welcome, config);
    this.languageForm_app = new LanguageForm(chooseLanguageEl_app, config);
    this.setCurrentLanguage(this.config.languageAbbrs[0]); // first language in config array is default

    // set interface text based on language
    this.languageForm_welcome.onSetLanguage = languageAbbr => this.handleWelcomeScreen(languageAbbr);
    this.languageForm_app.onSetLanguage = languageAbbr => this.setCurrentLanguage(languageAbbr);

    // create transparent canvas mask for qr stream
    this.canvasMask = new CanvasMask(canvasMaskEl, canvasMaskCtx);
    this.canvasMask.drawCanvasMask();

    // start timeout
    this.timeout = new Timeout(this.config.clickEventForTimeout, this.config.inactivityTimeout, () => {
      window.location.reload(true);
    });

    // event listeners

    // show overlay with qr and code input elements
    goButtonEl.addEventListener('click', e => {
      e.preventDefault();
      this.setInputOverlayVisibility(true);
    });

    // handle error message css fade animation
    this.invalidQRCodeEl.addEventListener('animationend', e => {
      this.invalidQRCodeEl.classList.remove('fade');
      this.invalidQRCodeEl.classList.add('transparent');
    });

    helpButtonEl.addEventListener('click', e => {
      this.loadURL(this.config.introPage.exhibitId, this.iframeId);
    });

    reloadButtonEl.addEventListener('click', e => {
      location.reload(true);
    });
  }

  // methods

  // UI
  setActiveScreenName(screenName) {
    if (screenName === this.activeScreenName) {
      return;
    }
    this.activeScreenName = screenName;
    // gave in to older broswers and android
    // for (const screenEl of this.screenEls) {
    //   const isActiveScreen = screenEl.classList.contains(`${screenName}-screen`);
    //   if (isActiveScreen) {
    //     screenEl.classList.add('active');
    //   } else {
    //     screenEl.classList.remove('active');
    //   }
    // }
    this.screenEls.forEach(screenEl => {
      const isActiveScreen = screenEl.classList.contains(`${screenName}-screen`);
      if (isActiveScreen) {
        screenEl.classList.add('active');
      } else {
        screenEl.classList.remove('active');
      }
    });
  }

  // sets interface text based on language from welcome screen
  handleWelcomeScreen(languageAbbr) {
    this.setCurrentLanguage(languageAbbr);
    if (this.qrCapability) {
      if (this.activeScreenName === 'welcome' || this.inputOverlay === 'visible') {
        this.setActiveScreenName('app');
        if (this.config.introPage.include) {
          this.loadURL(this.config.introPage.exhibitId, this.iframeId);
          this.setInputOverlayVisibility(false);
        } else {
          this.setInputOverlayVisibility(true);
        }
      }
    } else {
      this.handleError('qrReader');
    }
  }

  // sets interface text based on language from app screen
  setCurrentLanguage(languageAbbr) {
    this.currentLanguage = languageAbbr;
    this.languageForm_app.setCurrentLanguage(this.currentLanguage);
    this.config.languageAbbrs.forEach((l) => {
      if (l === languageAbbr) {
        document.documentElement.classList.add(l);
      } else {
        document.documentElement.classList.remove(l);
      }
    });
    this.updateTranslationStrings();
    document.title = this.config.translations.htmlPageTitle[this.currentLanguage];
    if (this.activeScreenName === 'app' && !this.inputOverlay) {
      this.loadURL(this.exhibitId, this.iframeId);
    }
  }

  updateTranslationStrings() {
    const translationElements = Array.from(document.querySelectorAll('[data-translation-string]')); // older browsers
    // for (const translationElement of translationElements) {
    //   if (this.config.translations[translationElement.dataset.translationString]) {
    //     translationElement.innerHTML = this.config.translations[translationElement.dataset.translationString][this.currentLanguage];
    //   }
    // }
    translationElements.forEach (translationElement => {
      if (this.config.translations[translationElement.dataset.translationString]) {
        translationElement.innerHTML = this.config.translations[translationElement.dataset.translationString][this.currentLanguage];
      }
    });
  }

  setInputOverlayVisibility(visible) {
    this.inputOverlay = visible;
    if (visible) {
      this.currentCode = '';
      this.htmlEl.classList.add('input-overlay');
      this.setHeaderVisibility(false);
      this.setFooterVisibility(false);
      this.initCameraWhenNeeded();
    } else {
      this.htmlEl.classList.remove('input-overlay');
      this.setHeaderVisibility(true);
      this.setFooterVisibility(true);
      this.qrReader.stopCamera();
    }
  }

  setHeaderVisibility(visible) {
    if (visible) {
      this.header.classList.remove('hidden');
    } else {
      this.header.classList.add('hidden');
    }
  }

  setFooterVisibility(visible) {
    if (visible) {
      this.footer.classList.remove('hidden');
    } else {
      this.footer.classList.add('hidden');
    }
  }

  // QR
  onQRDecoded(code) {
    this.code = code.toLowerCase();  // some mis-scans are just case related
    if (this.code === this.currentCode) {
      return;
    }
    this.currentCode = this.code;
    if (this.inputOverlay) {
          this.validateCode(this.code); //this.processCode(code);
    }
  }

  // toggles camera off if page loses focus and vice versa
  controlCameraOnPageVisibilityChange() {
    let hidden;
    let visibilityChange;
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') {
      console.log('browser does not support the Page Visibility API');
    } else {
      // console.log('listen for page visibility change');
      document.addEventListener(visibilityChange, () => {
        if (document[hidden]) {
          // console.log('call stop camera');
          this.qrReader.stopCamera();
        } else {
          // console.log('call init camera');
          this.initCameraWhenNeeded();
        }
      });
    }
  }

  initCameraWhenNeeded() {
    if (this.qrCapability && this.activeScreenName === 'app' && this.inputOverlay) {
      this.qrReader.initCamera();
    }
  }

  // Validation checks for correct domain and correct number of exhibit id digits
  // in order to filter out not-explo qr codes and mis-scans by qr library.
  // The loadURL function further tests to see if the label exists, if not, it returns
  // the same invalid error.

  validateCode(code) {
    // code needs to be on correct domain
    if (code.startsWith(this.config.contentURLPrefix)) {
      this.codeID = this.code.replace(this.config.contentURLPrefix, '').trim();
      // exhibit id needs to be valid number of digits
      if (this.codeID.length === this.config.numExhibitIdDigits) {
        this.codeEntryMode = 'qr';
        this.processCode(this.codeID);
      } else {
        this.handleError('invalid');
      }
    } else {
      this.handleError('invalid');
    }
  }

  handleError(errorType) {
    switch (errorType) {
      case 'invalid':
        this.currentCode = '';
        if (this.errorCount < this.config.qrMisreadAllowance) {
          this.errorCount += 1;
        } else {
          this.errorCount = 0;
          if (this.activeScreenName === 'app') {
            this.invalidQRCodeEl.classList.remove('transparent');
            this.invalidQRCodeEl.classList.add('fade');
          }
        }
        break;
      case 'qrReader':
        this.qrReaderErrorEl.classList.remove('transparent');
        break;
      default:
        return;
    }
  }

  processCode(codeID) {
    this.invalidQRCodeEl.classList.add('transparent');
    this.currentCode = codeID;
    // get the URL for this code
    this.loadURL(codeID, this.iframeId);
  }

// handle external URLs
  loadURL(codeID, iframeId) {
    let url = configureURL(this.config.contentURLPrefix, codeID, this.currentLanguage);
    testURL(url, this.config.testURLTimeout).then(urlWorks => {
      if (urlWorks) {
        this.exhibitId = codeID;
        url = configureURL(this.config.contentURLPrefix, codeID, this.currentLanguage);
        this.placeURL(iframeId, url);
        this.setInputOverlayVisibility(false);
        // if looking for instructions from missing welcome page, skip to app
      } else if (this.activeScreenName === 'welcome') {
        this.activeScreenName = 'app';
        this.setInputOverlayVisibility(true);
        // if QRcode reader or code entry form not reading valid code
      } else if (this.activeScreenName === 'app') {
        if (this.codeEntryMode === 'qr') {
          this.invalidQRCodeEl.classList.remove('transparent');
          this.invalidQRCodeEl.classList.add('fade');
        }
      }
    });
  }

  placeURL(iframeId, url) {
    // clear the iframe holder
    const $iframeContainer = document.getElementById(iframeId);
    $iframeContainer.innerHTML = `<iframe class="iframe" src="${url}"></iframe>`;
    const $iframe = $iframeContainer.querySelector('iframe');
    const checkLoaded = () => {
      const iframedoc = $iframe.contentDocument || ($iframe.contentWindow && $iframe.contentWindow.document);
      if (iframedoc) {
        const tabs = iframedoc.querySelector('.horizontal-tabs-list');
        if (tabs) {
          tabs.style.display = 'none';
          return;
        }
      }
      setTimeout(checkLoaded, 100);
    };
    checkLoaded();
  }
}

export default MLLApplication;
