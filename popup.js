function logToConsole (...data) {
  // use '...data' to pass in arbitrary number of arguments
  chrome.extension.getBackgroundPage().console.log(...data);
}

function getBookmarks () {
  chrome.bookmarks.getTree(arr => {
    logToConsole('arr:', arr);
    let tree = buildBookmarksTree(arr, {});
    logToConsole('tree:', tree);
  });
}

function buildBookmarksTree (bookmarks, tree) {
  tree['bookmarks'] = [];
  for (x in bookmarks) {
    if (bookmarks[x].children) {
      tree[`${bookmarks[x].title}`] = buildBookmarksTree(bookmarks[x].children, {});
    }
    else {
      let bookmark = {[`${bookmarks[x].title}`] : bookmarks[x].url};

      tree['bookmarks'].push(bookmark);
    };
  }
  return tree;
}

getBookmarks();

document.getElementById('pop').addEventListener('click', () => {
  document.getElementById('popped').append("Pop\n");
});