export default function checkDrawerStatus () {
  return new Promise((resolve, reject) => {
    // check to see if drawer is open
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { ref: 'check_drawer_status' }, drawerIsOpen => resolve({ drawerIsOpen, tabId: tabs[0].id }));
    });
  })
}
