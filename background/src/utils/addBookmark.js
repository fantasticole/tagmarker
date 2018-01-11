export default function addBookmark () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { ref: 'bookmark_data', data: tabs[0] });
  });
}
