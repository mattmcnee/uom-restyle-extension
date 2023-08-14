
console.log('Custom script injected');

// const iframe2 = document.getElementById('iframe_wrap');
// console.log(iframe2);

// var iframe = iframe2.children[0];

// // const iframe = document.getElementById('mybbCanvas');
// console.log(iframe);




// const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
// console.log(iframeDoc);



        function loadStylesheetInIframe(iframeElement, stylesheetUrl) {
            iframeElement.onload = function() {
                var iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;
                console.log(iframeDocument);
                // Create a new <link> element for the stylesheet
                var linkElement = iframeDocument.createElement("link");
                linkElement.rel = "stylesheet";
                linkElement.type = "text/css"
                linkElement.href = stylesheetUrl;
                
                // Append the link element to the iframe's head
                iframeDocument.head.appendChild(linkElement);
            };
        }

        // Call the function to load the additional stylesheet
        var iframe = document.getElementById("mybbCanvas");
        loadStylesheetInIframe(iframe, "https://github.com/mattmcnee/uom-restyle-extension/blob/main/content.css");





// function checkValue() {
//   console.log(iframe.contentWindow.innerWidth);
//   if (iframe.contentWindow.innerWidth > 1) {
//     console.log(iframe.contentDocument);
//   } else {
//     setTimeout(checkValue, 100);
//   }
// }

// function addStylesheetToIframe(iframe, stylesheetUrl) {
//     console.log(iframe.contentWindow);
//     checkValue();
//     // iframe.contentWindow.addEventListener('load', function() {
//         console.log('Custom script injected');
//         var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//         console.log(iframeDocument);
//         var linkElement = iframeDocument.createElement('link');
//         linkElement.rel = 'stylesheet';
//         linkElement.href = stylesheetUrl;
//         iframeDocument.head.appendChild(linkElement);
//     // });
// }

// // Usage example
// var iframe = document.getElementById('mybbCanvas');
// var stylesheetUrl = 'content.css';
// addStylesheetToIframe(iframe, stylesheetUrl);


