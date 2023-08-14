
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

/*.ui-datepicker-calendar table {
    border-spacing: 2px;
    row-gap: 2px !important;
}*/

.fc-border-separate .fc-state-highlight{
  background-color: lightblue !important;
}

.calendar-item .label-color{
  border-radius: 6px !important;
  width: 20px !important;
  height: 20px !important;
  padding: 0 !important;
  margin-top: 2px !important;
  margin-bottom: 2px !important;
}
.calendar-item input[type="checkbox"]{
  appearance: none;
  background-color: #eee;
  width: 10px;
  height: 10px;
  margin-top: 4.8px !important;
  margin-left: 4.8px !important;
  border-radius: 2px !important;
  cursor: pointer;
}

.calendar-item input[type="checkbox"]:after{
  content: '';
  position: absolute;
  background-color: #eee;
  width: 6px;
  height: 6px;
  top: 2px !important;
  left: 2px !important;
  border-radius: 1px !important;
  pointer-events: none;
  cursor: pointer;
}

.calendar-item input:checked[type="checkbox"]:after{
  background-color: #333;
}

.calendar-item label{
  border: none !important;
  padding-right: 20px !important;
}

.calendar-item .notch{
  display: none !important;
}

.colorPicker-palette{
  background-color: #fff !important;
}

.colorPicker-picker{
  position: absolute;
  right: 0 !important;
  top: -4px !important; 
  transform: rotateZ(45deg) scale(1.2);
}

#checkUncheckAll{
  margin-bottom: 10px !important;
}

#checkUncheckAll a{
  text-decoration: none !important;
  outline: none !important;
}

#ical{
  background-color: #5E0366 !important;
  background-image: none !important;
  box-shadow: inset 0 0 0 2px #5E0366 !important;
  border: none !important;
  border-radius: 5px !important;
  text-align: center;
  padding: 0.5625rem 1.125rem 0.625rem !important;
  text-shadow: none !important;
  color: white !important;
}

#ical:hover{
  color: #eee !important;
}

.fc-header button{
  background-image: none !important;
  background-color: #dadada;
  box-shadow: inset 0 0 0 2px #dadada;
  border: none !important;
  border-radius: 5px !important;
  text-align: center;
  padding: 0.5625rem 1.125rem 0.625rem !important;
}






`;



if(iframe != null){
  addInlineStylesInIframe(iframe, inlineCSS);
}



