class I18nHandler {
  private _i18n: Record<string, Record<string, string>>;
  private _currentLang: string;

  constructor() {
    this._i18n  = {};
    this._currentLang = localStorage.getItem("language") || "English";
  }

  public async initialize() {
    await this.loadLanguageFile("English");
    await this.loadLanguageFile(this._currentLang);
  }

  public setLanguage(lang: string): void {
    this._currentLang = lang;
    localStorage.setItem("language", lang);
    this.loadLanguageFile(lang).then(() => {
      this.reload();
    });
  }

  public getValue(key: string): string {
    const lang = this._currentLang;
    if (this._i18n[lang] && this._i18n[lang][key]) {
      return this._i18n[lang][key];
    } else {
      console.warn(`Missing translation for key: ${key} in language: ${lang}`, "Fallback to English");
      if (this._i18n["English"] && this._i18n["English"][key]) {
        return this._i18n["English"][key];
      } else {
        console.warn(`Missing translation for key: ${key} in language: English`);
        return key;
      }
    }
  }

  public reload(): void {
    const elements = document.querySelectorAll("[data-i18n]");
    const lang = this._currentLang;
    elements.forEach((element) => {
      element.textContent = this.getValue(element.getAttribute("data-i18n") || "");
    });
  }

  private async loadLanguageFile(lang: string) {
    await fetch(`./assets/i18n/${lang.toLowerCase()}.json`)
      .then((response) => response.json())
      .then((data) => {
        this._i18n[lang] = this.flattenJson(data);
      })
      .catch((error) => console.error("Error loading language file:", error));
  }
  
  private flattenJson(obj: any, prefix: string = ''): any {
    let result: Record<string, string> = {};
    
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(result, this.flattenJson(obj[key], newKey));
        } else {
          result[newKey] = obj[key];
        }
      }
    }

    return result;
  }
}

export const i18nHandler = new I18nHandler();