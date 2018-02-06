import store from './store';
import { wrapStore } from 'react-chrome-redux';

import { createOrUpdateBookmark, createOrUpdateTags, initialize } from './store/actions';
import { createBookmark, createFolder } from './store/aliases';

import addBookmark from './utils/addBookmark';
import checkDrawerStatus from './utils/checkDrawerStatus';
import * as spreadsheet from './utils/spreadsheet';
import getBookmarksAndFolders from './utils/getBookmarksAndFolders';
import getChildren from './utils/getChildren';
import toggleDrawer from './utils/toggleDrawer';

wrapStore(store, {
  portName: 'tagmarker',
});

// SET UP THE STORE
// get all bookmarks from chrome
chrome.bookmarks.getTree(arr => {
  let data = getBookmarksAndFolders(arr, { bookmarks: {}, tags: {}, });
  // initialize data in the store
  store.dispatch(initialize(data));
});

chrome.storage.sync.get('TagMarker', response => {
  let spreadsheetId = response.TagMarker;

  // if we have a spreadsheet id, set it in the store
  // TODO: confirm that the spreadsheet exists
  if (spreadsheetId) store.dispatch({ type: 'SET_SPREADSHEET', spreadsheetId });
  // otherwise, create one
  else {
    spreadsheet.create()
      .then(data => {
        spreadsheetId = data.spreadsheetId;
        // add it to the store
        store.dispatch({ type: 'SET_SPREADSHEET', spreadsheetId });
        chrome.storage.sync.set({'TagMarker': spreadsheetId}, () => {
          if (chrome.runtime.lastError) {
            console.log("Error Storing: " + chrome.runtime.lastError);
          }
        });
      }, error => {
        console.error(error);
      });
  }
})

// SET UP LISTENERS
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

// listen for key commands
chrome.commands.onCommand.addListener(command => {
  if (command === "add-bookmark") {
    // see if the drawer is open
    checkDrawerStatus()
      .then((data) => {
        let { drawerIsOpen, tabId } = data;

        // if it's closed, open it
        if (!drawerIsOpen) toggleDrawer(tabId);
        // add bookmark
        addBookmark();
      });
  }
});

// listen for created bookmarks
chrome.bookmarks.onCreated.addListener((id, bookmarkOrFolder) => {
  // wait in case it's being added to the store from the extension
  setTimeout(() => {
    // if we have a url, it's a bookmark
    if (bookmarkOrFolder.url) {
      let storeState = store.getState();

      // if the bookmark does not already exist (not created in extension)
      if (!storeState.bookmarks[id]) {
        // add it to the store
        store.dispatch(createBookmark({ bookmark: bookmarkOrFolder, tagsToAdd: [ bookmarkOrFolder.parentId, ...storeState.tags[bookmarkOrFolder.parentId].parents ] }));
      }
    }
    // otherwise, it's a folder
    else store.dispatch(createFolder({ folder: bookmarkOrFolder }));
  }, 250)
});

// listen for changed bookmarks (name or url)
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

// listen for removed bookmarks
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
