export default function logToConsole (...data) {
  // use '...data' to pass in arbitrary number of arguments
  chrome.extension.getBackgroundPage().console.log(...data);
}