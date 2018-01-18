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
    });
  })

  describe('setTags', () => {
    it('should create an action to set the tags object', () => {
      // SET_TAGS
    });
  })

  describe('updateFilteredBookmarks', () => {
    it('should create an action to set the filtered bookmarks array', () => {
      // UPDATE_FILTERED_BOOKMARKS
    });
  })

  describe('updateFilteredTags', () => {
    it('should create an action to set the filtered tags array', () => {
      // UPDATE_FILTERED_TAGS
    });
  })

  describe('updateSelectedTags', () => {
    it('should create an action to set the selected tags array', () => {
      // UPDATE_SELECTED_TAGS
    });
  })
})
