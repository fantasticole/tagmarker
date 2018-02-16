# PLANS

## To Do
* Tests
  * components
  * ~~actions~~
  * ~~aliases~~
  * ~~reducers~~
* Delete tag functionality
  * ~~Remove from array of tags on bookmark in store~~
  * ~~Remove bookmark id from tag's bookmarks array in store~~
  * ~~Check to see if the folder should be deleted as well~~
  * Check to see if/which the folder contents should be deleted as well
  * ~~Update db~~
* ~~Delete bookmark functionality~~
  * ~~Remove from bookmarks object in store~~
  * ~~Check to see if the chrome bookmark should be deleted as well~~
* ~~Add tag functionality~~
  * ~~Create/import dropdown/autocomplete with existing tags~~
  * ~~Add to array of tags on bookmark in store~~
  * ~~Add bookmark id to tag's bookmarks array in store~~
  * ~~Update db~~
* Edit bookmark functionality
  * ~~Update bookmark name in extension~~
  * ~~Update bookmark name in Chrome~~
  * Add notes
* Add bookmark functionality
  * ~~Ask where new bookmark should be created~~
  * ~~Add bookmark to Chrome~~
  * ~~Get and save bookmark details on 'add' command~~
  * ~~Update db~~
  * Check page for keywords as suggested tags
* ~~Listen for manually created bookmarks and folders~~
  * ~~Create bookmark in extension for new bookmark~~
  * ~~Create tag in extension for new folder~~
  * ~~Ask for tags for new bookmarks~~
* Listen for moved bookmarks and folders
  * update bookmark's tags
  * update tag's parents
* Add "All tags" option
  * ???
* Batch tagging
  * Add or remove tags for multiple bookmarks at once
* ~~Figure out where to store all of this so it persists~~
  * ~~google drive!~~
* Connect bookmarks
  * link them manually/by date
* FEATURE REQUEST: Page previews?
  * on hover show screen rendering
* Add context details to tags in select box
  * ~~bookmark count~~
  * update bookmark count
  * Put parent folder name in parens after?
* Add backup capability
  * ~~Store all in google drive~~
  * Add ability to create/duplicate spreadsheet
  * Add ability to point extension to chosen spreadsheet
* Toggle tag selection mode
  * ~~narrowing~~
  * concatting
* ~~Track drawer status by tab~~
  * ~~Make sure the drawer knows where to be open and where to be closed~~
  * ~~default to close on page load/refresh, only open when told~~
* ~~Listen for manually updated bookmarks and folders~~
  * ~~Update bookmark in extension for corresponding bookmark~~
  * ~~Update tag in extension for corresponding folder~~
* ~~Listen for manually deleted bookmarks and folders~~
  * ~~Delete bookmark in extension for deleted bookmark~~
  * ~~Delete tag in extension for deleted folder~~
* ~~Make tags searchable~~
  * ~~When one tag is selected, the only other tags that should show should be the ones that overlap.~~
* ~~Add tag functionality~~
  * ~~Create new tag with custom id~~
* ~~Add ability to create a folder in the folder select~~
  * ~~make sure spreadsheet has it before new bookmark tag updates are sent~~
* Continuity
  * Make sure each browser instance updates when you make a change in one
* Inform user about spreadsheet
  * add worksheet to beginning with warning about editing data


## Tag Storage
- Set an object somewhere (IndexedDB?) to hold folder and tag objects
- When a bookmark/tag is added, add that ID to the corresponding tag's bookmarks array and remove for deletion.
- Have an object of bookmarks that have an array of tag IDs in their data.

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
    bookmarks: [],
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
data.bookmarks = {
  "123": {
    dateAdded: 1329359259993,
    id: "123",
    parentId: "14",
    tags: ["14", "3", "2"],
    title: "December 1st Assignment",
    url: "www.example.com"
  },
  "554": {
    id: "554",
    parentId: "2",
    tags: ["2"]
    title: "November 1st Assignment",
    ...
  },
}
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