import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../background/src/store/actions';
import initialState from '../background/src/store/initialState';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
const testState = {
  bookmarks: {
    1: { id: 1, title: 'bookmark', tags: [ 3 ] },
    2: { id: 2, title: 'other bookmark', tags: [ 3, 4 ] },
  },
  filteredBookmarks: [],
  filteredTags: [],
  selected: [],
  sort: {
    bookmarks: { ascending: true, sortBy: 'date' },
    tags: { ascending: true, sortBy: 'alpha' },
  },
  tags: {
    3: { id: 3, title: 'tag', bookmarks: [ 1 ] },
    4: { id: 4, title: 'other tag', bookmarks: [ 1, 2 ] },
  },
};
const store = mockStore(testState);

describe('actions', () => {
  describe('initialize', () => {
    it('should create an action to setBookmarks with bookmarks from data param', () => {
    });

    it('should create an action to setTags with tags from data param', () => {
    });

    it('should create an action to updateFilteredBookmarks with an empty arrray', () => {
    });

    it('should create an action to updateFilteredTags with all tag ids', () => {
    });
  })

  describe('createOrUpdateBookmark', () => {
    const storeActions = store.getActions()
    const bookmark = { id: 5, title: 'new bookmark' };

    store.dispatch(actions.createOrUpdateBookmark(bookmark))

    it('should create an action to create or update a bookmark object', () => {
      const createOrUpdateAction = { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark };
      expect(storeActions[0]).toEqual(createOrUpdateAction)
    });

    it('should create an action to filter bookmarks', () => {
      // no tags are selected so no bookmarks should be filtered
      const filteredBookmarksAction = { type: 'UPDATE_FILTERED_BOOKMARKS', bookmarks: [] };
      expect(storeActions[1]).toEqual(filteredBookmarksAction)
    });

    it('should create an action to filter tags', () => {
      // and all tags should be returned
      const filteredTagsAction = { type: 'UPDATE_FILTERED_TAGS', tags: [ "3", "4"] };
      expect(storeActions[2]).toEqual(filteredTagsAction)
    });
  })

  describe('createOrUpdateTags', () => {
    it('should create an action to add a tag', () => {
      const tags = [{ title: 'test' }];
      const expectedAction = {
        type: 'CREATE_OR_UPDATE_TAGS',
        tags
      }
      expect(actions.createOrUpdateTags(tags)).toEqual(expectedAction)
    });
  })

  describe('filterBookmarksAndTags', () => {
    it('should create an action to updateFilteredBookmarks with an empty array if no tags are selected', () => {
    });

    it('should create an action to updateFilteredTags with all tag ids if no tags are selected', () => {
    });

    it('should create an action to updateFilteredBookmarks with the ids for all bookmarks that have every selected tag in their tags array', () => {
    });

    it('should create an action to updateFilteredTags with all tags related to the filtered bookmarks that are not selected', () => {
    });
  })

  describe('setBookmarks', () => {
    it('should create an action to set the bookmarks object', () => {
      const data = {
        1: { id: 1, title: 'bookmark'},
        2: { id: 2, title: 'other bookmark'},
      };
      const expectedAction = {
        type: 'SET_BOOKMARKS',
        data
      }
      expect(actions.setBookmarks(data)).toEqual(expectedAction)
    });
  })

  describe('setTags', () => {
    it('should create an action to set the tags object', () => {
      const data = {
        1: { id: 1, title: 'tag'},
        2: { id: 2, title: 'other tag'},
      };
      const expectedAction = {
        type: 'SET_TAGS',
        data
      }
      expect(actions.setTags(data)).toEqual(expectedAction)
    });
  })

  describe('updateFilteredBookmarks', () => {
    it('should create an action to set the filtered bookmarks array', () => {
      const bookmarks = [1, 2, 3];
      const expectedAction = {
        type: 'UPDATE_FILTERED_BOOKMARKS',
        bookmarks
      }
      expect(actions.updateFilteredBookmarks(bookmarks)).toEqual(expectedAction)
    });
  })

  describe('updateFilteredTags', () => {
    it('should create an action to set the filtered tags array', () => {
      const tags = [1, 2, 3];
      const expectedAction = {
        type: 'UPDATE_FILTERED_TAGS',
        tags
      }
      expect(actions.updateFilteredTags(tags)).toEqual(expectedAction)
    });
  })

  describe('updateSelectedTags', () => {
    it('should create an action to set the selected tags array', () => {
      const tags = [1, 2, 3];
      const expectedAction = {
        type: 'UPDATE_SELECTED_TAGS',
        tags
      }
      expect(actions.updateSelectedTags(tags)).toEqual(expectedAction)
    });
  })
})
