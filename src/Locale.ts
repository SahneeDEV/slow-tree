enum Locale {
    DE,
    EN
}

/**
 * Gets the default locale of the current browser.
 */
export const defaultLocale = () => { 
    const lang = navigator.language.toLowerCase().split("-");
    switch(lang[0]) {
        case "en": return Locale.EN;
        case "de": return Locale.DE;
        default: return Locale.EN;
    }
}

export default Locale;
