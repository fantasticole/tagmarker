import { createStore } from 'redux';
import store from './store';
import { wrapStore } from 'react-chrome-redux';

import { setBookmarkFolder, setBookmarks, setTags } from './store/actions';

import createDatabase from './utils/createDatabase';
import getBookmarksAndFolders from './utils/getBookmarksAndFolders';

wrapStore(store, {
  portName: 'tagmarker',
});

// Default store structure:
// {
//   bookmarks: [],
//   drawerOpen: false,
//   tags: {},
// }

// see if there is a folder for tagmarker bookmarks
chrome.bookmarks.search({ title: 'TagMarker Bookmarks' }, (arr) => {
  console.log('tagmarker search arr:', arr)
  // if the returned array has objects
  if (arr.length) {
    // find the folder that matches the query
    let folder = arr.find(option => (option.dateGroupModified));

    console.log('tagmarker folder:', folder)
    // if we found a folder, set that it in the store
    if (folder) store.dispatch(setBookmarkFolder(folder));
  }
  else {
    // create the folder in 'Other Bookmarks'
    // 'Other Bookmarks' is default parent if no parentId is specified
    chrome.bookmarks.create({ title: 'TagMarker Bookmarks' }, folder => {
      console.log('tagmarker folder:', folder)
      // set the folder in the store
      store.dispatch(setBookmarkFolder(folder));
    });
  }
})


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

// get all bookmarks from chrome
chrome.bookmarks.getTree(arr => {
  let data = getBookmarksAndFolders(arr, { bookmarks: [], tags: {}, });
  // set data as variable on the window for debugging purposes
  window.bookmarkData = data;
  // save formatted bookmarks and tags in the store
  createDatabase(data);
  store.dispatch(setBookmarks(data.bookmarks));
  store.dispatch(setTags(data.tags));
});

