import * as reducers from '../background/src/store/reducers';
import initialState from '../background/src/store/initialState';

describe('bookmarks reducer', () => {
  it('should return the initial state', () => {
    expect(reducers.bookmarks(undefined, {})).toEqual(initialState.bookmarks)
  })

  it('should handle SET_BOOKMARKS', () => {
    let allBookmarks = {
          1: { title: 'bookmark'},
          2: { title: 'other bookmark'},
        },
        newBookmarks = {
          3: { title: 'new bookmark'},
          4: { title: 'other new bookmark'},
        };

    // should set the bookmarks object in the store
    expect(
      reducers.bookmarks({}, { type: 'SET_BOOKMARKS', data: allBookmarks})
    ).toEqual(allBookmarks);

    expect(
      reducers.bookmarks(allBookmarks, { type: 'SET_BOOKMARKS', data: newBookmarks })
    ).toEqual(newBookmarks);
  })

  it('should handle CREATE_OR_UPDATE_BOOKMARK', () => {
    // adds or updates action.bookmark
  })
})

describe('filteredBookmarks reducer', () => {
  it('should return the initial state', () => {
    expect(reducers.filteredBookmarks(undefined, {})).toEqual(initialState.filteredBookmarks)
  })

  it('should handle UPDATE_FILTERED_BOOKMARKS', () => {
    // sets list to action.bookmarks
  })
})

describe('filteredTags reducer', () => {
  it('should return the initial state', () => {
    expect(reducers.filteredTags(undefined, {})).toEqual(initialState.filteredTags)
  })

  it('should handle UPDATE_FILTERED_TAGS', () => {
    // sets list to action.tags
  })
})

describe('selected reducer', () => {
  it('should return the initial state', () => {
    expect(reducers.selected(undefined, {})).toEqual(initialState.selected)
  })

  it('should handle UPDATE_SELECTED_TAGS', () => {
    // sets list to action.tags
  })
})

describe('sort reducer', () => {
  it('should return the initial state', () => {
    expect(reducers.sort(undefined, {})).toEqual(initialState.sort)
  })

  it('should handle SET_SORT', () => {
    // updates state.list.sortBy & state.list.ascending
    // based on action.sort and action.list
  })
})

describe('tags reducer', () => {
  it('should return the initial state', () => {
    expect(reducers.tags(undefined, {})).toEqual(initialState.tags)
  })

  it('should handle SET_TAGS', () => {
    let allTags = {
          1: { title: 'tag'},
          2: { title: 'other tag'},
        },
        newTags = {
          3: { title: 'new tag'},
          4: { title: 'other new tag'},
        };

    // should set the tags object in the store
    expect(
      reducers.tags({}, { type: 'SET_TAGS', data: allTags})
    ).toEqual(allTags);

    expect(
      reducers.tags(allTags, { type: 'SET_TAGS', data: newTags })
    ).toEqual(newTags);
  })

  it('should handle CREATE_OR_UPDATE_TAGS', () => {
    // adds or updates each tag in action.tags
  })
})