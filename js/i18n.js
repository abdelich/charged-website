/**
 * Charged Development — runtime strings.
 *
 * The page copy itself is static: English lives in /index.html and Swedish in
 * /sv/index.html, as two separate documents, so search engines are served real
 * HTML in both languages instead of a translation that only exists after
 * JavaScript runs. Language is whatever the page declares in <html lang>.
 *
 * Only the strings JavaScript writes at runtime need to live here. Everything
 * a visitor reads on load belongs in the markup of the page it appears on —
 * if you edit copy, edit both pages.
 */
(function () {
  "use strict";

  var STRINGS = {
    en: {
      "work.showAll": "Show all {count} projects",
      "work.showFewer": "Show fewer projects",
      "form.sending": "Sending…",
      "form.success": "Thank you! We have your enquiry and will reply by email within 1–2 business days.",
      "form.error": "The enquiry could not be sent. Please email us directly at contacts@chargeddata.com.",
      "quick.fab": "Contact us",
      "quick.close": "Close the contact menu"
    },
    sv: {
      "work.showAll": "Visa alla {count} projekt",
      "work.showFewer": "Visa färre projekt",
      "form.sending": "Skickar…",
      "form.success": "Tack! Vi har fått er förfrågan och svarar via e-post inom 1–2 arbetsdagar.",
      "form.error": "Förfrågan kunde inte skickas. Mejla oss gärna direkt på contacts@chargeddata.com.",
      "quick.fab": "Kontakta oss",
      "quick.close": "Stäng kontaktmenyn"
    }
  };

  var pageLang = document.documentElement.lang;
  var lang = STRINGS[pageLang] ? pageLang : "en";

  window.I18N = {
    lang: lang,

    t: function (key, replacements) {
      var value = STRINGS[lang][key] || STRINGS.en[key] || key;

      if (replacements) {
        Object.keys(replacements).forEach(function (name) {
          value = value.split("{" + name + "}").join(replacements[name]);
        });
      }

      return value;
    }
  };
})();
