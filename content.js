function injectCSS() {
  chrome.scripting.insertCSS({
    file: 'content.css'
  });
}

function waitForLoad() {
  if (document.readyState === 'complete') {
    injectCSS();
  } else {
    setTimeout(waitForLoad, 100);
  }
}

waitForLoad();

// function injectCSS() {
//   chrome.scripting.insertCSS({
//     file: 'content.css'
//   });
// }

// function observeDOMChanges() {
//   const observer = new MutationObserver((mutationsList) => {
//     for (const mutation of mutationsList) {
//       if (mutation.type === 'childList') {
//         injectCSS();
//       }
//     }
//   });

//   observer.observe(document.body, { childList: true, subtree: true });
// }

// observeDOMChanges();

