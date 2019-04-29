## DIFFERENT XML REQUEST METHODS.

// ===================================================================== JSON like method (NOT WORKING)

// queryURL = "TEST.txt";
// $.ajax({
//   url: 'file:///C:/Users/ELVAN/Documents/PERSONAL/CONTABILIDAD/FACTURA_APP/TEST3.xml',
//   method: "GET"
// }).then(function (response) {
//   xmlresponse = $.parseXML(response);
//   console.log(xmlresponse);

// });

// ===================================================================== XMLHttp Request and DOMParser (WORKING BUT IN SECURE MODE)

// Chrome must be opened with: chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security from the Run window.

// var parser, xmlDoc, xmlDoc2, request, uurloon, uurloon1, uurloon2;

// let getXMLFile = function (path, callback) {
//   request = new XMLHttpRequest();
//   request.open("GET", path);
//   // request.setRequestHeader("text/xml",tex);
//   request.onreadystatechange = function () {

//     callback(request.responseText);

//   };
//   request.send();

// };

// getXMLFile("TEST.xml", function (xmlDoc) {

//   parser = new DOMParser();
//   xmlDoc2 = parser.parseFromString(xmlDoc, "text/xml");

//   console.log(xmlDoc2);
//   uurloon = xmlDoc2.getElementsByTagName("cfdi:Comprobante")[0];

//   WriteToHTML();
// });

// function WriteToHTML() {
//   uurloon1 = uurloon.getAttribute("subTotal");
//   document.getElementById("demo1").innerHTML = uurloon1;
//   uurloon2 = uurloon.getAttribute("total");
//   document.getElementById("demo2").innerHTML = uurloon2;
//   console.log(uurloon1);
//   console.log(uurloon2);
// };

// ===================================================================== XMLHttp Request (WORKING BUT IN SECURE MODE)


// var xhr = new XMLHttpRequest();

// xhr.open("GET", "file:///C:/Users/ELVAN/Documents/PERSONAL/CONTABILIDAD/FACTURA_APP/TEST3.xml", true);

// xhr.send();

// xhr.onreadystatechange = function() {
//   console.log(xhr.readyState);
//   console.log(xhr.status);
//   console.log(xhr.statusText);
// }

// ===================================================================== XMLHttp Request (WORKING BUT IN SECURE MODE)

// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'TEST.xml', true);

// xhr.timeout = 2000; // time in milliseconds

// xhr.onload = function () {
//   // Request finished. Do processing here.
//   var xmlDoc = this.responseXML; // <- Here's your XML file
//   console.log(xmlDoc);

// };

// xhr.ontimeout = function (e) {
//   // XMLHttpRequest timed out. Do something here.
// };

// xhr.send(null);