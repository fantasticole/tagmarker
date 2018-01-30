import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as aliases from '../background/src/store/aliases';
import testState from './testState';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('aliases', () => {
  describe('createBookmark', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();
    const storeState = store.getState();
    const bookmark = { id: 5, title: 'bookmark' };
    const tagsToAdd = [ 3, 4 ];

    store.dispatch(aliases.createBookmark({ bookmark, tagsToAdd }))

    it('should create an action to create or update tags', () => {
      const tags = [
        { id: 3, title: 'tag', bookmarks: [ 1, 2, 5 ], parents: [ 4 ] },
        { id: 4, title: 'other tag', bookmarks: [ 1, 5 ] }
      ];
      const createOrUpdateTagsAction = { type: 'CREATE_OR_UPDATE_TAGS', tags };
      expect(storeActions[0]).toEqual(createOrUpdateTagsAction)
    });

    it('should create an action to create or update a bookmark', () => {
      const newBookmark = Object.assign({}, bookmark, { tags: tagsToAdd } )
      const createOrUpdateBookmarkAction = { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark: newBookmark };
      expect(storeActions[1]).toEqual(createOrUpdateBookmarkAction)
    });
  })

  describe('createFolder', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();
    const storeState = store.getState();
    const folder = {
      dateAdded: 1317956200396,
      dateGroupModified: 1516230597434,
      id: 6,
      parentId: 3,
      title: 'title',
    };

    store.dispatch(aliases.createFolder({ folder }))

    it('should create an action to create a tag from a folder object', () => {
      const parentsList = storeState.tags[folder.parentId].parents;
      const tags = [Object.assign({}, folder, {
        bookmarks: [],
        parents: [...parentsList, folder.parentId],
      })];
      const createOrUpdateTagsAction = { type: 'CREATE_OR_UPDATE_TAGS', tags };
      expect(storeActions[0]).toEqual(createOrUpdateTagsAction)
    });
  })

  describe('createTag', () => {
    const store = mockStore(testState);
    const storeState = store.getState();

    it('should create a tag with an id that does not already exist in the tags object in the store', () => {
      const title = 'new Tag';
      const { tags } = storeState;
      const bookmarkId = 1;
      const newTag = aliases.createTag(title, tags, bookmarkId);
      // newTag's id should not exist in the store
      expect(tags[newTag.id]).toEqual(undefined);
      expect(newTag.title).toEqual(title);
      expect(newTag.bookmarks).toEqual([bookmarkId]);
    });
  })

  describe('getTagsToUpdate', () => {
    const store = mockStore(testState);
    const storeState = store.getState();
    const tagsToAdd = [ 'test' ];
    const tagsToDelete = [ 4 ];
    const { tags } = storeState;
    const bookmarkId = 2;
    const tagsToUpdate = aliases.getTagsToUpdate(tagsToAdd, tagsToDelete, tags, bookmarkId);
    const newTag = tagsToUpdate.find(tag => tag.title === 'test')

    it('should create a tag for any id we are adding that does not already exist', () => {
      expect(tags[newTag.id]).toEqual(undefined);
    });

    it('should add the bookmark id to the tag object for any tag id we are adding', () => {
      expect(newTag.bookmarks).toEqual([ bookmarkId ]);
    });

    it('should remove the bookmark id from the tag object for any tag id we are removing', () => {
      const removedTagBookmarks = tagsToUpdate[1].bookmarks;
      expect(removedTagBookmarks.includes(bookmarkId)).toEqual(false);
    });

    it('should return an array of tag objects', () => {
      tagsToUpdate.forEach(tag => {
        expect(typeof tag).toEqual("object");
      })
    });
  })

  describe('removeBookmark', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();

    store.dispatch(aliases.removeBookmark({ id: 1 }));

    it('should create an action to update the bookmark tags to not have the bookmark id', () => {
      const updateTagsAction = { type: 'CREATE_OR_UPDATE_TAGS', tags: [ { id: 3, title: 'tag', bookmarks: [ 2 ], parents: [ 4 ] } ] };
      expect(storeActions[0]).toEqual(updateTagsAction);
    });

    it('should create an action to delete the bookmark from the store', () => {
      const deleteBookmarkAction = { type: 'DELETE_BOOKMARK', id: 1 };
      expect(storeActions[1]).toEqual(deleteBookmarkAction);
    });
  })

  describe('removeTag', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();

    store.dispatch(aliases.removeTag({ id: 3 }));

    it('should create an action to update each associated bookmark to not have the tag id', () => {
      const updateBookmarkAction = { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark: { id: 1, title: 'bookmark', tags: [] } };
      const updateBookmarkAction2 = { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark: { id: 2, title: 'other bookmark', tags: [ 4 ] } };
      expect(storeActions[0]).toEqual(updateBookmarkAction);
      expect(storeActions[1]).toEqual(updateBookmarkAction2);
    });

    it('should create an action to delete the tag from the store', () => {
      const deleteTagAction = { type: 'DELETE_TAG', id: 3 };
      expect(storeActions[2]).toEqual(deleteTagAction);
    });
  })

  describe('updateBookmark', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();
    const bookmark = Object.assign({}, testState.bookmarks[2], { title: 'new title' })

    store.dispatch(aliases.updateBookmark({ bookmark }));

    it('should create an action to create or update tags', () => {
      const tags = [];
      const createOrUpdateTagsAction = { type: 'CREATE_OR_UPDATE_TAGS', tags };
      expect(storeActions[0]).toEqual(createOrUpdateTagsAction)
    });

    it('should create an action to update a bookmark', () => {
      const createOrUpdateBookmarkAction = { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark };
      expect(storeActions[1]).toEqual(createOrUpdateBookmarkAction)
    });
  })
})
