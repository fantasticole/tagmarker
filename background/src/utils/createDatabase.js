export default function createDatabase (data) {
  // account for if the browser doesn't use indexedDB
  if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. TagMarker will not be available.");
  }

  var request = window.indexedDB.open('TesterDatabasez', 1);

  // if there's an error, alert
  request.onerror = (e) => console.log('error:', e);

  request.onupgradeneeded = (e) => {
    console.log('DB Open UpgradeNeeded', e);

    let db = e.target.result,
        objectStore = db.createObjectStore(
          'bookmarks',
          { keyPath: 'id' }
        );

    objectStore.createIndex('dateAdded', 'dateAdded', { unique: false });
    objectStore.createIndex('parentId', 'parentId', { unique: false });
    objectStore.createIndex('tags', 'tags', { unique: false });
    objectStore.createIndex('title', 'title', { unique: false });
    objectStore.createIndex('url', 'url', { unique: true });

    objectStore.transaction.oncomplete = (event) => {
      // add each bookmark to the database
      data.bookmarks.forEach((bookmark) => {
        db.transaction('bookmarks', 'readwrite').objectStore('bookmarks').add(bookmark);
      });
    }
  }

  var db;

  request.onsuccess = (e) => {
    console.log('DB Open Success');
    db = e.target.result;
    window.db = db;
    db.onerror = (event) => {
      console.log('event: ' + event);
      console.log('DB Error: ' + event.target.errorCode);
    }
    listBookmarks();
  }

  function listBookmarks () {
    let allBookmarks = [];

    db.transaction('bookmarks').objectStore('bookmarks').openCursor().onsuccess = (event) => {
      var cursor = event.target.result;
      if (cursor) {
        allBookmarks.push(cursor.value.title);
        // console.log( 'ID ' + cursor.key + ' is ' + cursor.value );
        cursor.continue();
      } else {
        console.log('Got em:', allBookmarks);
      }
    }
  }
}

// // get all bookmarks
// db.transaction("bookmarks", "readwrite").objectStore("bookmarks").getAll().onsuccess = (x) => console.log(x.target.result)

// // get the first bookmark with a parentId of "1"
// db.transaction("bookmarks","readonly").objectStore("bookmarks").index("parentId").get("1").onsuccess = (x) => console.log(x.target.result)

// // get all bookmarks whose parentId values are less than 2000
// var boundKeyRange = IDBKeyRange.bound("1", "2000"),
//     bookmarkList = [];

// db.transaction('bookmarks').objectStore('bookmarks').index("parentId").openCursor(boundKeyRange).onsuccess = function(event) {
//   var cursor = event.target.result;
//   if (cursor) {
//     bookmarkList.push(cursor.value)
//     cursor.continue();
//   }
// };

// // get all bookmarks whose id values are less than 2000
// var bookmarkList = [];

// db.transaction('bookmarks').objectStore('bookmarks').openCursor(boundKeyRange).onsuccess = function(event) {
//   var cursor = event.target.result;
//   if (cursor) {
//     bookmarkList.push(cursor.value)
//     cursor.continue();
//   }
// };
