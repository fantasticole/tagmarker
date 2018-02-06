export default {
  bookmarks: {
    1: { id: 1, title: 'bookmark', tags: [ 3 ] },
    2: { id: 2, title: 'other bookmark', tags: [ 3, 4 ] },
  },
  filteredBookmarks: [],
  filteredTags: [],
  selected: [ 3 ],
  sort: {
    bookmarks: { ascending: true, sortBy: 'date' },
    tags: { ascending: true, sortBy: 'alpha' },
  },
  spreadsheet: {
    id: null,
    url: null,
  },
  tags: {
    3: { id: 3, title: 'tag', bookmarks: [ 1, 2 ], parents: [ 4 ] },
    4: { id: 4, title: 'other tag', bookmarks: [ 1 ] },
  },
};
