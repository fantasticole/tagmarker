export default function addBookmark () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let { url } = tabs[0];

    chrome.tabs.sendMessage(tabs[0].id, { ref: 'bookmark_url', url });
  });
}
