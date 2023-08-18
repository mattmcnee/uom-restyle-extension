// const userData = {
//   mainTheme: {
//     light: "#5E0366",
//     dark: "#5E0366"
//   },
//   backgroundMain: {
//     light: "#fff",
//     dark: "#111"
//   },
//   backgroundMainOutline{
//     light: "#fff",
//     dark: "#111"
//   }
// };

// // Save data to storage
// chrome.storage.local.set({ userData }, () => {
//   console.log("Data saved:", userData);
// });



// Retrieve the checkbox element
const restyleCheckbox = document.getElementById('restyleCheckbox');

// When the checkbox state changes, save it to local storage and send a message to content.js
restyleCheckbox.addEventListener('change', () => {
  const isEnabled = restyleCheckbox.checked;
  chrome.storage.local.set({ isEnabled });
  
  // Send a message to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: changeRestylingState,
      args: [isEnabled],
    });
  });
});

// Function to be executed in content.js
function changeRestylingState(isEnabled) {
  // You can now use the isEnabled value in your content script logic
  if (isEnabled) {
    // Call your function to restyle the page
    console.log('Restyling enabled!');
  } else {
    console.log('Restyling disabled.');
  }
}


// Function to be executed in content.js
function changeRestylingState(isEnabled) {
  // You can now use the isEnabled value in your content script logic
  if (isEnabled) {
    // Call your function to restyle the page
    console.log('Restyling enabled!');
  } else {
    console.log('Restyling disabled.');
  }
}
