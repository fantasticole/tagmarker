import * as reducers from '../background/src/store/reducers';
import initialState from '../background/src/store/initialState';

describe('bookmarks reducer', () => {
  const allBookmarks = {
    1: { id: 1, title: 'bookmark'},
    2: { id: 2, title: 'other bookmark'},
  };

  const newBookmarks = {
    3: { id: 3, title: 'new bookmark'},
    4: { id: 4, title: 'other new bookmark'},
  };

  it('should return the initial state', () => {
    expect(reducers.bookmarks(undefined, {})).toEqual(initialState.bookmarks)
  })

  it('should handle SET_BOOKMARKS', () => {
    // should set the bookmarks object in the store
    expect(
      reducers.bookmarks({}, { type: 'SET_BOOKMARKS', data: allBookmarks})
    ).toEqual(allBookmarks);

    expect(
      reducers.bookmarks(allBookmarks, { type: 'SET_BOOKMARKS', data: newBookmarks })
    ).toEqual(newBookmarks);
  })

  it('should handle CREATE_OR_UPDATE_BOOKMARKS', () => {
    const bookmark = newBookmarks[3];
    const updatedBookmarks = Object.assign({}, allBookmarks, { [bookmark.id]: bookmark });

    // adds a bookmark
    expect(
      reducers.bookmarks(allBookmarks, { type: 'CREATE_OR_UPDATE_BOOKMARKS', bookmarks: [bookmark] })
    ).toEqual(updatedBookmarks);

    // updates one bookmark while adding another
    bookmark.title = 'new title';
    const bookmarks = [ bookmark, newBookmarks[4] ];
    const newestBookmarks = Object.assign({}, updatedBookmarks, { 4 : newBookmarks[4]});
    newestBookmarks[3].title = 'new title';
    expect(
      reducers.bookmarks(allBookmarks, { type: 'CREATE_OR_UPDATE_BOOKMARKS', bookmarks })
    ).toEqual(newestBookmarks);
  })

  it('should handle DELETE_BOOKMARK', () => {
    const oneBookmark = { 1: { id: 1, title: 'bookmark'} }

    // deletes a bookmark
    expect(
      reducers.bookmarks(allBookmarks, { type: 'DELETE_BOOKMARK', id: 2 })
    ).toEqual(oneBookmark);
  })
})

describe('spreadsheet reducer', () => {
  it('should return the initial state', () => {
    expect(reducers.spreadsheet({}, {})).toEqual({})
  })

  it('should handle SET_SPREADSHEET', () => {
    const data = {
      id: 'abc',
      bookmarksSheet: 1,
      tagsSheet: 2,
    }

    // should set the spreadsheet in the store
    expect(
      reducers.spreadsheet({}, { type: 'SET_SPREADSHEET', data })
    ).toEqual(data);
  })
})

describe('tags reducer', () => {
  const allTags = {
    1: { id: 1, title: 'tag'},
    2: { id: 2, title: 'other tag'},
  };

  const newTags = {
    3: { id: 3, title: 'new tag'},
    4: { id: 4, title: 'other new tag'},
  };

  it('should return the initial state', () => {
    expect(reducers.tags(undefined, {})).toEqual(initialState.tags)
  })

  it('should handle SET_TAGS', () => {
    // should set the tags object in the store
    expect(
      reducers.tags({}, { type: 'SET_TAGS', data: allTags})
    ).toEqual(allTags);

    expect(
      reducers.tags(allTags, { type: 'SET_TAGS', data: newTags })
    ).toEqual(newTags);
  })

  it('should handle CREATE_OR_UPDATE_TAGS', () => {
    const tag = newTags[3];
    const tags = [ tag ];
    const updatedTags = Object.assign({}, allTags, { [tag.id]: tag });

    // adds a tag
    expect(
      reducers.tags(allTags, { type: 'CREATE_OR_UPDATE_TAGS', tags })
    ).toEqual(updatedTags);

    // add multiple tags
    const allNewTags = Object.values(newTags);
    const allUpdatedTags = Object.assign({}, allTags, newTags)
    expect(
      reducers.tags(allTags, { type: 'CREATE_OR_UPDATE_TAGS', tags: allNewTags })
    ).toEqual(allUpdatedTags);

    // updates a tag
    tags[0].title = 'new title';
    updatedTags[3].title = 'new title';
    expect(
      reducers.tags(allTags, { type: 'CREATE_OR_UPDATE_TAGS', tags })
    ).toEqual(updatedTags);
  })

  it('should handle DELETE_TAG', () => {
    const oneTag = { 1: { id: 1, title: 'tag'} }

    // deletes a tag
    expect(
      reducers.tags(allTags, { type: 'DELETE_TAG', id: 2 })
    ).toEqual(oneTag);
  })
})
