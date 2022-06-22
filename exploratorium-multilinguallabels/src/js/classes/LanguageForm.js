import combineArrays from '../functions/combineArrays';

class LanguageForm {

  constructor(el, config) {
    this.el = el;
    this.config = config;
    this.el.innerHTML = this.generateLanguageFormHTML(config.languages, config.languageAbbrs);
    this.initLanguageFormRadioButtons();
  }

  generateLanguageFormHTML(languageNames, languageCodes) {
    const newLanguageArray = combineArrays(languageNames, languageCodes);
    let html = '<div class="language-buttons-container">';

    if (this.el.id === 'languageForm-welcome') {
      newLanguageArray.forEach((language, index) => {
        if (language[1] === 'zh-Hant'){
          // add a class to vertically adjust chinese characters
          html += `<input type="radio" id="${this.el.id}-${language[1]}-languageButton" class="language-button" name="language" value="${language[1]}" /><label for="${this.el.id}-${language[1]}-languageButton" class="welcome-languageButton vert-adjust">${language[0]}</label>`;
        } else {
          html += `<input type="radio" id="${this.el.id}-${language[1]}-languageButton" class="language-button" name="language" value="${language[1]}" /><label for="${this.el.id}-${language[1]}-languageButton" class="welcome-languageButton">${language[0]}</label>`;
        }
      });
      html += '</div>';
      return html;
    } else if (this.el.id === 'languageForm-app') {
      newLanguageArray.forEach((language, index) => {
        html += `<input type="radio" id="${this.el.id}-${language[1]}-languageButton" class="language-button" name="language" value="${language[1]}" /><label for="${this.el.id}-${language[1]}-languageButton" class="app-languageButton">${language[0]}</label>`;
      });
      html += '</div>';
      return html;
    }
  }

  initLanguageFormRadioButtons() {  // click event registers twice
    this.el.addEventListener('click', e => {
      const checkedLanguageEl = this.el.querySelector('input[name="language"]:checked');
      if (checkedLanguageEl) {
        this.setCurrentLanguage(checkedLanguageEl.value);
      }
    });
  }

  setCurrentLanguage(languageAbbr) {
    if (languageAbbr === this.currentLanguage) {
      return;
    }
    this.currentLanguage = languageAbbr;
    const input = this.el.querySelector(`input[value=${languageAbbr}]`);
    if (input) {
      input.setAttribute('checked', 'checked');
    }
    if (this.onSetLanguage){
      this.onSetLanguage(this.currentLanguage);
    }
  }
}

export default LanguageForm;
