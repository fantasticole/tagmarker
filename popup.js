function logToConsole (...data) {
  // use '...data' to pass in arbitrary number of arguments
  chrome.extension.getBackgroundPage().console.log(...data);
}

function getBookmarks () {
  chrome.bookmarks.getTree(arr => {
    logToConsole('arr:', arr);
    // buildBookmarksTree(arr);
    let tree = buildBookmarksTree(arr, {});
    // let string = buildBookmarksString(arr, "");
    logToConsole('tree:', tree);
  });
}

function buildBookmarksTree (bookmarks, tree) {
  tree['bookmarks'] = [];

  for (x in bookmarks) {
    // logToConsole('current:', bookmarks[x])
    if (bookmarks[x].children) {
      // logToConsole('folder!')
      // tree[`${bookmarks[x].title}`] = {};
      // logToConsole('tree0:', tree);
      // let bookmarkChildren = buildBookmarksTree(bookmarks[x].children, {});

      // logToConsole('bookmarkChildren:', bookmarkChildren);
      // tree[`${bookmarks[x].title}`] = bookmarkChildren;
      tree[`${bookmarks[x].title}`] = buildBookmarksTree(bookmarks[x].children, {});
      // logToConsole('tree0:', tree);
    }
    else {
      // logToConsole('bookmark!')
      let bookmark = {[`${bookmarks[x].title}`] : bookmarks[x].url};

      tree['bookmarks'].push(bookmark);
    };
    logToConsole('treex:', tree);
  }
  // logToConsole('tree:', tree);
  return tree;
}

// function buildBookmarksTree (bookmarks) {
//   let bookmarkNames = [];
//   logToConsole('bookmarks:', bookmarks);
//   // look at each bookmark
//   // see if it has children
//   // if so, look at each child
//   // continue doing this until you get to the last child
//   for (x in bookmarks) {
//     // let title = bookmarks[x].title || bookmarks[x].url
//     // if (tree[bookmarks[x].title])
//     if (bookmarks[x].children) {
//       logToConsole('folder:', bookmarks[x]);
//       buildBookmarksTree(bookmarks[x].children);
//     }
//     else {
//       let bookmark = {[bookmarks[x].title] : bookmarks[x].url};

//       bookmarkNames.push(bookmark);
//     };
//   }
//   logToConsole('bookmarkNames:', bookmarkNames);
// }

// function buildBookmarksString (bookmarks, str) {
//   logToConsole('bookmarks:', bookmarks);
//   logToConsole('str0:', str);
//   for (x in bookmarks) {
//     let { children } = bookmarks[x];

//     logToConsole('children:', children);
//     str += `${bookmarks[x].title}\n`;
//     if (children) {
//       return buildBookmarksTree(children, str);
//     }
//     logToConsole('str1:', str);
//     return str;
//   }
// }

getBookmarks();

document.getElementById('pop').addEventListener('click', () => {
  document.getElementById('popped').append("Pop\n");
});