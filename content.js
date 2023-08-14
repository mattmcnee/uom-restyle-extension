
console.log('Custom script injected');

// const iframe2 = document.getElementById('iframe_wrap');
// console.log(iframe2);

// var iframe = iframe2.children[0];

// // const iframe = document.getElementById('mybbCanvas');
// console.log(iframe);




// const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
// console.log(iframeDoc);
       // Function to add inline CSS rules inside the iframe
function addInlineStylesInIframe(iframeElement, cssRules) {
    iframeElement.onload = function() {
        var iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow.document;
        console.log(iframeDocument);
        // Create a new <style> element for inline styles
        var styleElement = iframeDocument.createElement("style");
        styleElement.type = "text/css";

        console.log(cssRules);
        styleElement.appendChild(iframeDocument.createTextNode(cssRules)); // For modern browsers
        
        console.log(styleElement);
        // Append the style element to the iframe's head
        iframeDocument.head.appendChild(styleElement);
    };
}

        // Call the function to add inline styles
var iframe = document.getElementById("mybbCanvas");
var inlineCSS = `

.stream_header{
  background-color: #fff !important;
/*    background-image: none !important;
  background-repeat: initial !important;*/
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
  z-index: 6 !important;
  position: relative;
}

.stream_page_left {
  border: none !important;

}

.left_stream_wrapper{
/*  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2) !important;*/
border: none !important;
background-color: #fff !important;
z-index: 5 !important;
box-shadow: none !important;
}

.ui-datepicker-calendar .ui-state-default{
  width: 30px !important;
  height: 20px !important;
  text-align: center !important;
    border: none !important;
    border-radius: 5px !important;
    background-color: #f0f0f0 !important;

}

.ui-datepicker-calendar td{
  padding: 3px 0 !important;
}

.fc-border-separate .fc-state-highlight{
  background-color: lightblue !important;
}






`;



if(iframe != null){
  addInlineStylesInIframe(iframe, inlineCSS);
}



