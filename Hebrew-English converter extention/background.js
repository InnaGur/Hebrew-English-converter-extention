// Add a context menu item for converting text
chrome.contextMenus.create({
    id: "convert-text",
    title: "Convert Hebrew ↔ English",
    contexts: ["selection"]
  });
  
  // Handle the context menu item click
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("Menu item clicked");
    if (info.menuItemId === "convert-text") {
        console.log("Menu item clicked, selection:", info.selectionText);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: convertText,
        args: [info.selectionText]
      });
    }
  });

  function convertText(selectedText) {

    // Transliteration maps for basic Hebrew ↔ English conversion
    const hebrewToEnglishMap = {
        'א': 't', 'ב': 'c', 'ג': 'd', 'ד': 's', 'ה': 'v', 'ו': 'u', 
        'ז': 'z', 'ח': 'j', 'ט': 'y', 'י': 'h', 'כ': 'f', 'ל': 'k',
        'מ': 'n', 'נ': 'b', 'ס': 'x', 'ע': 'g', 'פ': 'p', 'צ': 'm',
        'ק': 'e', 'ר': 'r', 'ש': 'a', 'ת': ',', 'ך': 'l', 'ם': 'o', 
        'ן': 'i', 'ף': ';', 'ץ': '.'
    };        

    const englishToHebrewMap = {
        't': 'א', 'c': 'ב', 'd': 'ג', 's': 'ד', 'v': 'ה', 'u': 'ו', 
        'z': 'ז', 'j': 'ח', 'y': 'ט', 'h': 'י', 'f': 'כ', 'k': 'ל',
        'n': 'מ', 'b': 'נ', 'x': 'ס', 'g': 'ע', 'p': 'פ', 'm': 'צ',
        'e': 'ק', 'r': 'ר', 'a': 'ש', ',': 'ת', 'l': 'ך', 'o': 'ם', 
        'i': 'ן', ';': 'ף', '.': 'ץ'
    };

    function hebrewToEnglish(text) {
        return text.split('').map(char => hebrewToEnglishMap[char] || char).join('');
    }

    function englishToHebrew(text) {
        return text.split('').map(char => englishToHebrewMap[char] || char).join('');
    }

    const isHebrew = /[\u0590-\u05FF]/.test(selectedText);
    const convertedText = isHebrew ? hebrewToEnglish(selectedText) : englishToHebrew(selectedText);

    // Replace the selected text with the converted text
    document.execCommand('insertText', false, convertedText);
}

  