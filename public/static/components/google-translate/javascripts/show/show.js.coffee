googleTranslateElementInit = (languages) ->
  new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: languages, layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false}, 'google_translate_element')

$ ->
  configs = JSON.parse($('#google-translate-config').html())
  languages = configs.languages
  googleTranslateElementInit(languages)
