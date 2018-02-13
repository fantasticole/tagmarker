export default function sendBookmarkData (bookmark) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let data = tabs[0];

    // if a bookmark object was passed in, send that as the data
    if (bookmark) data = bookmark;
    chrome.tabs.sendMessage(tabs[0].id, { ref: 'bookmark_data', data });
  });
}
