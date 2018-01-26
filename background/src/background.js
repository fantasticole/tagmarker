import store from './store';
import { wrapStore } from 'react-chrome-redux';

import { createOrUpdateBookmark, createOrUpdateTags, initialize } from './store/actions';
import { createBookmark, createFolder } from './store/aliases';

import addBookmark from './utils/addBookmark';
import getBookmarksAndFolders from './utils/getBookmarksAndFolders';
import toggleDrawer from './utils/toggleDrawer';

wrapStore(store, {
  portName: 'tagmarker',
});

// open and close drawer on icon click
chrome.browserAction.onClicked.addListener(tab => {
  // send the action to the container
  toggleDrawer(tab.id);
});

// listen for commands from popup or component
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if the message is about toggling the drawer
  if (request.ref === 'toggle_drawer') {
    // pass the message along
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      toggleDrawer(tabs[0].id);
    });
  }
  // if the message is about adding a bookmark
  else if (request.ref === 'add_bookmark') addBookmark();
});

chrome.commands.onCommand.addListener(command => {
  if (command === "add-bookmark") {
    // check to see if drawer is open
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { ref: 'check_drawer_status' }, drawerOpen => {
        // if it's closed, open it
        if (!drawerOpen) toggleDrawer(tabs[0].id);
        // add bookmark
        addBookmark();
      });
    });
  }
});

chrome.bookmarks.onCreated.addListener((id, bookmarkOrFolder) => {
  // wait in case it's being added to the store from the extension
  setTimeout(() => {
    // if we have a url, it's a bookmark
    if (bookmarkOrFolder.url) {
      // if the bookmark does not already exist (not created in extension)
      if (!store.getState().bookmarks[id]) {
        // add it to the store
        store.dispatch(createBookmark({ bookmark: bookmarkOrFolder, tagsToAdd: [ bookmarkOrFolder.parentId ] }));
      }
    }
    // otherwise, it's a folder
    else store.dispatch(createFolder({ folder: bookmarkOrFolder }));
  }, 250)
});

// fired when bookmark name or url changes
chrome.bookmarks.onChanged.addListener((id, data) => {
  let storeState = store.getState();

  // if there's a url, it's a bookmark
  if (data.url) {
    let bookmark = Object.assign({}, storeState.bookmarks[id], data);

    // update the bookmark in the store
    store.dispatch(createOrUpdateBookmark(bookmark));
  }
  // otherwise, it's a folder
  else {
    let tag = Object.assign({}, storeState.tags[id], data);

    // update the tag in the store
    store.dispatch(createOrUpdateTags([tag]));
  }
});

chrome.bookmarks.onRemoved.addListener((id, data) => {
  // node includes all children, if any
  let { node, parentId } = data;

  // if there's a url, it's a bookmark
  if (node.url) store.dispatch({ type: 'REMOVE_BOOKMARK', id });
  // otherwise, it's a tag
  else {
    // get all folders and tags to be removed
    let toRemove = getChildren(node, { bookmarks: [], tags: [] }),
        { bookmarks, tags } = toRemove;

    bookmarks.forEach(id => {
      store.dispatch({ type: 'REMOVE_BOOKMARK', id });
    })

    tags.forEach(id => {
      store.dispatch({ type: 'REMOVE_TAG', id });
    })
  }
});

function getChildren(node, all) {
  if (node.children) {
    all.tags = [...all.tags, node.id];
    node.children.forEach(n => {
      return getChildren(n, all);
    })
  }
  else all.bookmarks = [...all.bookmarks, node.id];
  return all;
}

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
  // initialize data in the store
  store.dispatch(initialize(data));
});
