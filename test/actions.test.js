import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../background/src/store/actions';
import testState from './testState';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  describe('initialize', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions()
    const data = {
      bookmarks: {
        1: { id: 1, title: 'bookmark', tags: [ 3 ] },
        2: { id: 2, title: 'other bookmark', tags: [ 3, 4 ] },
      },
      tags: {
        3: { id: 3, title: 'tag', bookmarks: [ 1 ] },
        4: { id: 4, title: 'other tag', bookmarks: [ 1, 2 ] },
      },
    };

    store.dispatch(actions.initialize(data))
    it('should create an action to setBookmarks with bookmarks from data param', () => {
      const setBookmarksAction = { type: 'SET_BOOKMARKS', data: data.bookmarks };
      expect(storeActions[0]).toEqual(setBookmarksAction)
    });

    it('should create an action to setTags with tags from data param', () => {
      const setTagsAction = { type: 'SET_TAGS', data: data.tags };
      expect(storeActions[1]).toEqual(setTagsAction)
    });
  })

  describe('createOrUpdateBookmarks', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();
    const bookmark = { id: 5, title: 'new bookmark' };
    const bookmarks = [{ id: 6, title: 'newer bookmark' }, { id: 7, title: 'newest bookmark' }];

    store.dispatch(actions.createOrUpdateBookmarks(bookmark))

    it('should create an action to create or update a bookmark object', () => {
      const createOrUpdateAction = { type: 'CREATE_OR_UPDATE_BOOKMARKS', bookmarks: [bookmark] };
      expect(storeActions[0]).toEqual(createOrUpdateAction)
    });

    store.dispatch(actions.createOrUpdateBookmarks(bookmarks))

    it('should create an action to create or update all bookmark objects that are passed in', () => {
      const createOrUpdateMultiAction = { type: 'CREATE_OR_UPDATE_BOOKMARKS', bookmarks };
      expect(storeActions[1]).toEqual(createOrUpdateMultiAction)
    })
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
})
