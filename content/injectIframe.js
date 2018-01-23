let anchor = document.createElement('div'), // element to attach drawer to
    container = document.createElement('div'); // container for drawer

anchor.id = 'tagmarker-anchor';
container.id = 'tagmarker-container';
// remove any div styles and set my own to affix drawer to side
container.style.cssText = 'all: unset; height: 100vh; width: 300px; position: fixed; right: 0; top: 0; transform: translateX(105%); transition: 0.5s transform ease-in-out;z-index:1000000099;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);';

// append container to anchor and anchor to page
anchor.appendChild(container);
document.body.appendChild(anchor);

function getDrawer () {
  // get the action and the container DOM element
  let frameContainer = document.getElementById('tagmarker-container'),
      currentStyle = frameContainer.style.transform,
      // get current drawer status
      isOpen = currentStyle === 'translateX(0%)' ? true : false;

  return { frameContainer, isOpen };
}

// listen for flags to open and close drawer or get drawer status
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if we're checking the drawer status
  if (request.ref === 'check_drawer_status') {
    // figure out whether it's open or not
    let { isOpen } = getDrawer();

    // send that data back to the requester
    sendResponse(isOpen);
  }
  // if we're toggling the drawer
  else if (request.ref === 'toggle_drawer') {
    // get the container DOM element and current status
    let { frameContainer, isOpen } = getDrawer();

    // toggle the drawer's visibility
    frameContainer.style.transform=`translateX(${isOpen ? 105 : 0 }%)`
  }
})

// help with the iframe found on StackOverflow:
// https://stackoverflow.com/questions/24641592/injecting-iframe-into-page-with-restrictive-content-security-policy

// Avoid recursive frame insertion...
let extensionOrigin = 'chrome-extension://' + chrome.runtime.id;

if (!location.ancestorOrigins.contains(extensionOrigin)) {
  let iframe = document.createElement('iframe');
  iframe.id = 'tagmarker-iframe';
  // dynamically add in iframe source
  // Must be declared at web_accessible_resources in manifest.json
  iframe.src = chrome.runtime.getURL('content/injected.html');

  // remove any iframe styles and set my own
  iframe.style.cssText = 'all: unset; position: absolute; top: 0; bottom: 0; right: 0; height: 100%; width: 100%;';

  // add the iframe to the container
  document.getElementById('tagmarker-container').appendChild(iframe);
}