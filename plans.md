# PLANS

## To Do
* Delete tag functionality
  * ~~Remove from array of tags on bookmark in store~~
  * ~~Remove bookmark id from tag's bookmarks array in store~~
  * Update db
* Add tag functionality
  * ~~Create/import dropdown/autocomplete with existing tags~~
  * ~~Add to array of tags on bookmark in store~~
  * ~~Add bookmark id to tag's bookmarks array in store~~
  * Update db
* Edit bookmark name functionality
  * Update bookmark name in Chrome
* Add bookmark functionality
  * Ask where new folders/bookmarks should be created
    * Bookmarks Bar or Other Bookmarks
    * Choose folder name
  * Add bookmark to Chrome (where?)
  * Listen for manually created bookmarks
* Add tag functionality
  * ~~Create custom folder in 'Other Bookmarks'~~
  * ~~Check to see if it exists~~
* Figure out where to store all of this so it persists
  * indexedDB?
* Make tags searchable
  * When one tag is selected, the only other tags that should show should be the ones that overlap.

## Tag Storage
- Set an object somewhere (IndexedDB?) to hold folder and tag objects
- When a bookmark/tag is added, add that ID to the corresponding tag's bookmarks array and remove for deletion.
- Have an array of bookmark objects that have an array of tag IDs in their data.

Example:
If a bookmark exists in this folder structure:

```
School
  |- Math
  |-- Homework
  |--- December 1st Assignment
```

The storage should look like this:
```
data.tags = {
  1: {
    bookmarks: [ "123", "554", ... ],
    dateAdded: 1329359260125
    dateGroupModified: 1481077695941
    id: "1",
    parentId: "0",
    parents: [],
    title: "Bookmarks Bar",
  },
  2: {
    bookmarks: [ "123", "554", "623", "197" ],
    id: "2",
    title: "School",
    ...
  },
  3: {
    bookmarks: [ "461", "123", "901" ],
    id: "3",
    title: "Math",
    ...
  },
}
```
```
data.bookmarks = [
  {
    dateAdded: 1329359259993,
    id: "123",
    parentId: "14",
    tags: ["3", "2", "1"],
    title: "December 1st Assignment",
    url: "www.example.com"
  },
  {
    id: "554",
    tags: ["2", "1"]
    title: "November 1st Assignment",
    ...
  },
]
```



## Chrome Bookmark Structure
### Folder
```
{
  children: (2) [{…}, {…}],
  dateAdded: 1491239049558,
  dateGroupModified: 1496710991662,
  id: "1234",
  index: 17,
  parentId: "1",
  title: "Folder Name",
}
```
### Bookmark
```
{
  dateAdded: 1492097791214,
  id: "1001",
  index: 2,
  parentId: "1234",
  title: "Example Bookmark",
  url: "https://www.example.com",
}
```