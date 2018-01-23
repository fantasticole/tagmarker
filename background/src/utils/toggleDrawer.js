export default function toggleDrawer (tabId) {
  chrome.tabs.sendMessage(tabId, { ref: 'toggle_drawer' });
}
