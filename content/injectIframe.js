let anchor = document.createElement('div'), // element to attach drawer to
    container = document.createElement('div'); // container for drawer

anchor.id = 'tagmarker-anchor';
container.id = 'tagmarker-container';
// remove any div styles and set my own to affix drawer to side
container.style.cssText = 'all: unset; height: 100vh; width: 300px; position: fixed; right: 0; top: 0; transform: translateX(105%); transition: 0.5s transform ease-in-out;z-index:1000000099;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);';

// append container to anchor and anchor to page
anchor.appendChild(container);
document.body.appendChild(anchor);

// listen for flags to open and close drawer
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // make sure the message is about the drawer
  if (request.ref === 'drawer') {
    // ge tthe action and the container DOM element
    let { action } = request,
        frameContainer = document.getElementById('tagmarker-container');

    // apply that action to the container
    frameContainer.style.transform=`translateX(${action === 'open_drawer' ? 0 : 105 }%)`
  }
})

// help with the iframe found on StackOverflow:
// https://stackoverflow.com/questions/24641592/injecting-iframe-into-page-with-restrictive-content-security-policy

// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;

if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');
    iframe.id = 'tagmarker-iframe';
    // dynamically add in iframe source
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('content/injected.html');

    // remove any iframe styles and set my own
    iframe.style.cssText = 'all: unset; position: absolute; top: 0; bottom: 0; right: 0; height: 100%; width: 100%;';

    // add the iframe to the container
    document.getElementById('tagmarker-container').appendChild(iframe);
}