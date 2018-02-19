import store from './store';
import { wrapStore } from 'react-chrome-redux';

import { createOrUpdateBookmarks, createOrUpdateTags, initialize } from './store/actions';
import { addBookmark, addTag } from './store/aliases';

import sendBookmarkData from './utils/sendBookmarkData';
import checkDrawerStatus from './utils/checkDrawerStatus';
import * as spreadsheet from './utils/spreadsheet';
import getBookmarksAndFolders from './utils/getBookmarksAndFolders';
import getChildren from './utils/getChildren';
import toggleDrawer from './utils/toggleDrawer';

wrapStore(store, {
  portName: 'tagmarker',
});

// SET UP THE STORE
chrome.storage.sync.get('TagMarker', response => {
  let data = response.TagMarker;

  // if we have a spreadsheet id
  if (data) {
    // make sure the spreadsheet exists
    spreadsheet.exists(data.id)
      .then(tagsAndBookmarks => {
        // if it does, set the spreadsheet id in the store
        if (tagsAndBookmarks) {
          store.dispatch({ type: 'SET_SPREADSHEET', data });
          // initialize tags and bookmarks in the store
          store.dispatch(initialize(tagsAndBookmarks));
        }
        // otherwise, create one
        else createSpreadsheet();
      }, error => {
        console.error(error);
      });
  }
  // otherwise, create one
  else createSpreadsheet();
})

function createSpreadsheet () {
  spreadsheet.create()
    .then(data => {
      // add it to the store
      store.dispatch({ type: 'SET_SPREADSHEET', data });
      chrome.storage.sync.set({'TagMarker': data}, () => {
        if (chrome.runtime.lastError) {
          console.log("Error Storing: " + chrome.runtime.lastError);
        }
      });

      return data.id;
    }, error => {
      console.error(error);
    })
    .then(id => {
      // get all bookmarks from chrome
      chrome.bookmarks.getTree(arr => {
        let data = getBookmarksAndFolders(arr, { bookmarks: {}, tags: {}, });

        // initialize data in the store
        store.dispatch(initialize(data));
        // add tag and bookmark data to the spreadsheet
        spreadsheet.addRows('bookmarks', Object.values(data.bookmarks), id);
        spreadsheet.addRows('tags', Object.values(data.tags), id);
      });
    });
}

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
  else if (request.ref === 'add_bookmark') sendBookmarkData();
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
        sendBookmarkData(drawerIsOpen);
      });
  }
});

// listen for created bookmarks
chrome.bookmarks.onCreated.addListener((id, bookmarkOrFolder) => {
  // wait in case it's being added to the store from the extension
  setTimeout(() => {
    let storeState = store.getState();

    // if we have a url, it's a bookmark
    if (bookmarkOrFolder.url) {
      // if the bookmark does not already exist (not created in extension)
      if (!storeState.bookmarks[id]) {
        let bookmark = bookmarkOrFolder,
            tagsToAdd = [ bookmarkOrFolder.parentId, ...storeState.tags[bookmarkOrFolder.parentId].parents ];

        // add it to the store
        store.dispatch(addBookmark({ bookmark, tagsToAdd }));

        // see if the drawer is open
        checkDrawerStatus()
          .then((data) => {
            let { drawerIsOpen, tabId } = data;

            // if it's closed, open it
            if (!drawerIsOpen) toggleDrawer(tabId);
            // add bookmark
            sendBookmarkData(drawerIsOpen, bookmark);
          });
      }
    }
    // otherwise, it's a folder
    else {
      // if the tag does not already exist (not created in extension)
      if (!storeState.tags[id]) {
        // add it to the store
        store.dispatch(addTag({ folder: bookmarkOrFolder }));
      }
    }
  }, 250)
});

// listen for changed bookmarks (name or url)
chrome.bookmarks.onChanged.addListener((id, data) => {
  let storeState = store.getState();

  // if there's a url, it's a bookmark
  if (data.url) {
    let { bookmarks } = storeState,
        bookmarkCount = Object.keys(bookmarks).length,
        bookmark = Object.assign({}, bookmarks[id], data);

    spreadsheet.update(bookmark, 'bookmarks', bookmarkCount)
    // update the bookmark in the store
    store.dispatch(createOrUpdateBookmarks(bookmark));
  }
  // otherwise, it's a folder
  else {
    let { tags } = storeState,
        tagCount = Object.keys(tags).length,
        tag = Object.assign({}, tags[id], data);

    spreadsheet.update(tag, 'tags', tagCount)
    // update the tag in the store
    store.dispatch(createOrUpdateTags(tag));
  }
});

// listen for moved bookmarks
chrome.bookmarks.onMoved.addListener((id, moveInfo) => {
  let { parentId, oldParentId } = moveInfo,
      { bookmarks, tags } = store.getState(),
      type = bookmarks[id] ? 'bookmark' : 'tag',
      suggestedTags = [...tags[parentId].parents, parentId];

  if (type === 'tag') {
    // get tag with updated parents
    let tag = Object.assign({}, tags[id], { parents: suggestedTags });

    // update the spreadsheet
    spreadsheet.update(tag, 'tags', Object.keys(tags).length);
    // update the tag in the store
    store.dispatch(createOrUpdateTags(tag));
  }
  else {
    // see if the drawer is open
    checkDrawerStatus()
      .then((data) => {
        let { drawerIsOpen, tabId } = data,
            // get bookmark with updated parentId
            bookmark = Object.assign({}, bookmarks[id], { parentId });

        // if it's closed, open it
        if (!drawerIsOpen) toggleDrawer(tabId);
        // add bookmark
        sendBookmarkData(drawerIsOpen, bookmark, suggestedTags);
      });
  }
})

// listen for removed bookmarks
chrome.bookmarks.onRemoved.addListener((id, data) => {
  // wait in case it's being deleted from the extension
  setTimeout(() => {
    // node includes all children, if any
    let { node, parentId } = data;
    let storeState = store.getState();

    // if there's a url, it's a bookmark (if it exists, delete it)
    if (node.url && storeState.bookmarks[id]) {
      store.dispatch({ type: 'REMOVE_BOOKMARK', id });
    }
    // otherwise, it's a tag (if it exists, delete it)
    else if (storeState.tags[id]) {
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
  }, 250)
});
