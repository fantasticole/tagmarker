function logToConsole (...data) {
  // use '...data' to pass in arbitrary number of arguments
  chrome.extension.getBackgroundPage().console.log(...data);
}

document.getElementById('pop').addEventListener('click', () => {
  document.getElementById('popped').append("Pop\n");
});

// when the popup opens, alert the background
chrome.runtime.sendMessage({ msg: "opened" });

// get data from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  logToConsole('request:', request);
});
