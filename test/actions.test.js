import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../background/src/store/actions';
import initialState from '../background/src/store/initialState';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
const store = mockStore(initialState);

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
    it('should create an action to create or update a bookmark object', () => {
      // CREATE_OR_UPDATE_BOOKMARK
    });

    it('should create an action to filterBookmarksAndTags with currently selected tags', () => {
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
      // SET_BOOKMARKS
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
      // SET_TAGS
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
      // UPDATE_FILTERED_BOOKMARKS
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
      // UPDATE_FILTERED_TAGS
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
      // UPDATE_SELECTED_TAGS
      const tags = [1, 2, 3];
      const expectedAction = {
        type: 'UPDATE_SELECTED_TAGS',
        tags
      }
      expect(actions.updateSelectedTags(tags)).toEqual(expectedAction)
    });
  })
})
