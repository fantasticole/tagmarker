import { createStore } from 'redux';
import rootReducer from './store';
import { wrapStore } from 'react-chrome-redux';

import { setBookmarks, setTags } from './store/actions';

import getBookmarksAndFolders from './utils/getBookmarksAndFolders';

const store = createStore(rootReducer, {});

wrapStore(store, {
  portName: 'tagmarker',
});

// open and close drawer on icon click
chrome.browserAction.onClicked.addListener((tab) => {
  // get current drawer status
  let { drawerOpen } = store.getState(),
      // if it's open send close action and vice versa
      action = drawerOpen ? 'close_drawer' : 'open_drawer';

  // send the action to the container
  chrome.tabs.sendMessage(tab.id, { action, ref: 'drawer' });
  // update the store
  store.dispatch({ type: 'TOGGLE_DRAWER', data: !drawerOpen });
});

// listen for commands from popup or drawer component to open or close
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // make sure the message is about the drawer
  if (request.ref === 'drawer') {
    // pass the message along
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: request.msg, ref: 'drawer' });
    });
  };
});

function getBookmarks () {
  // get all bookmarks from chrome
  chrome.bookmarks.getTree(arr => {
    let data = getBookmarksAndFolders(arr, { bookmarks: [], tags: {}, });
    // save formatted bookmarks and tags in the store
    store.dispatch(setBookmarks(data.bookmarks));
    store.dispatch(setTags(data.tags));
  });
}

getBookmarks();
