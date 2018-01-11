import store from './store';
import { wrapStore } from 'react-chrome-redux';

import { setFolder, setBookmarks, setTags } from './store/actions';

import addBookmark from './utils/addBookmark';
import getBookmarksAndFolders from './utils/getBookmarksAndFolders';

wrapStore(store, {
  portName: 'tagmarker',
});

// see if there is a folder for tagmarker bookmarks
chrome.bookmarks.search({ title: 'TagMarker Bookmarks' }, (arr) => {
  // if the returned array has objects
  if (arr.length) {
    // find the folder that matches the query
    let folder = arr.find(option => (option.dateGroupModified));

    // if we found a folder, set that it in the store
    if (folder) store.dispatch(setFolder(folder));
  }
})

// open and close drawer on icon click
chrome.browserAction.onClicked.addListener(tab => {
  // send the action to the container
  chrome.tabs.sendMessage(tab.id, { ref: 'toggle_drawer' });
});

// listen for commands from popup or component
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if the message is about toggling the drawer
  if (request.ref === 'toggle_drawer') {
    // pass the message along
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { ref: 'toggle_drawer' });
    });
  }
  // if the message is about adding a bookmark
  else if (request.ref === 'add_bookmark') addBookmark();
});

chrome.commands.onCommand.addListener(command => {
  if (command === "add-bookmark") addBookmark();
});

// get all bookmarks from chrome
chrome.bookmarks.getTree(arr => {
  let data = getBookmarksAndFolders(arr, { bookmarks: {}, tags: {}, });
  // set data as variable on the window for debugging purposes
  window.bookmarkData = data;
  chrome.storage.local.set({'TagMarker': data}, () => {
    if (chrome.runtime.lastError) {
      console.log("Error Storing: " + chrome.runtime.lastError);
    }
  });
  // save formatted bookmarks and tags in the store
  store.dispatch(setBookmarks(data.bookmarks));
  store.dispatch(setTags(data.tags));
});
